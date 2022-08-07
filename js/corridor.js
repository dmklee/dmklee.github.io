var PI = 3.14159;

function lineSegmentIntersection(segA, segB) {
  //https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
  let dxA, dyA, dxB, dyB, denom, s, t;
  dxA = segA[1][0] - segA[0][0];
  dyA = segA[1][1] - segA[0][1];
  dxB = segB[1][0] - segB[0][0];
  dyB = segB[1][1] - segB[0][1];
  denom = -dxB*dyA + dxA*dyB
  s = (-dyA * (segA[0][0] - segB[0][0]) + dxA * (segA[0][1] - segB[0][1])) / denom; 
  t = ( dxB * (segA[0][1] - segB[0][1]) - dyB * (segA[0][0] - segB[0][0])) / denom; 
  
  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    return [segA[0][0] + t * dxA,
            segA[0][1] + t * dyA];
  }
  return null;
}
class Polygon {
  constructor (pts) {
    //this.pts = pts;
    this.pts = this.arrangePoints(pts);
  }
  getSide(i) {
    return [this.pts[i], this.pts[(i+1)%this.N]];
  }
  *getSides() {
    let i = 0;
    let N = this.N;
    while(i!=N) {
      yield this.getSide(i);
      i++;
    }
  }
  *getPoints() {
    for (const pt in this.pts) {
      yield pt;
    }
    yield this.pts[0];
  }
  findIntersections(line_seg) {
    let tmp;
    let intersections = [];
    for (const side of this.getSides()) {
      tmp = lineSegmentIntersection(side, line_seg);
      if (tmp !== null) {
        intersections.push(tmp);
      }
    }
    return intersections;
  }
  get N() {
    return this.pts.length;
  }
  containsPoint(pt) {
    // checks cross product is positive, this requires the points being in CCW order
    let i=0;
    let a,b,c,d;
    while (i != this.N) {
      a = this.pts[(i+1)%this.N][0] - this.pts[i][0];
      b = this.pts[(i+1)%this.N][1] - this.pts[i][1];
      c = pt[0] - this.pts[i][0];
      d = pt[1] - this.pts[i][1];
      if ((a*d - b*c) < 0) {
        return false;
      }
      i++;
    }
    return true;
  }
  arrangePoints(pts) {
    let i, midx, midy;
    let midpt = pts.reduce((a,b) => [a[0]+b[0], a[1]+b[1]], [0, 0]);
    midpt[0] /= pts.length;
    midpt[1] /= pts.length;
    let sorted_ids = pts.map((p,i) => [Math.atan2(p[1]-midpt[1],p[0]-midpt[0]),i])
                        .sort((a,b) => a[0] - b[0])
                        .map(a => a[1]);
    return sorted_ids.map(i => pts[i]);
  }
  polygonOverlap(other) {
    //returns [polygon of overlap]
    let ids_in_this = [...Array(other.N).keys()].filter(i => this.containsPoint(other.pts[i]));
    let ids_in_other = [...Array(this.N).keys()].filter(i => other.containsPoint(this.pts[i]));
    if (ids_in_this.length == 0 && ids_in_other.length == 0) {
      return null;
    } else if (ids_in_other.length == this.N) {
      return this;
    } else if (ids_in_this.length == other.N) {
      return other;
    } else {
      let new_pts = [];
      for (const side of other.getSides()) {
        new_pts.push(...this.findIntersections(side));
      }
      let overlap = new Polygon(new_pts.concat(
        ids_in_this.map(i=>other.pts[i]),
        ids_in_other.map(i=>this.pts[i])
      ))
      return overlap;
    }
  }
  getBoundingBox() {
    let min_x = 0;
    let min_y = 0;
    let max_x = 0;
    let max_y = 0;
    for (const pt in this.pts) {
      min_x = Math.min(min_x, pt[0]);
      min_y = Math.min(min_y, pt[1]);
      max_x = Math.max(max_x, pt[0]);
      max_y = Math.max(max_y, pt[1]);
    }
    return [[min_x, min_y],[max_x, max_y]];
  }
  getUpperBoundArea() {
    let bb = this.getBoundingBox();
    return (bb[1][0] - bb[0][0]) * (bb[1][1] - bb[0][1]);
  }
}

function generatePolygonPoints(n_sides, scale, x, y, theta) {
  let d_angle = 2*PI / (n_sides);
  return [...Array(n_sides)].map((d,i) => [scale*Math.cos(theta+d_angle*i)+x, 
                                           scale*Math.sin(theta+d_angle*i)+y]);
}
function get_corners(shape, vp) {
  let d_angle = 2 * PI / shape.n_sides;
  let size = shape.scale * FOCAL_LENGTH / shape.z;
  let corners = [];
  let eff_x = shape.x*(1 - shape.z/vp.z);
  let eff_y = shape.y*(1 - shape.z/vp.z);
  for (let i=0; i != shape.n_sides; i++) {
    corners.push([eff_x + size * Math.cos(shape.theta + i * d_angle),
                  eff_y + size * Math.sin(shape.theta + i * d_angle)]);
  }
  return corners;
}
function generate_shape(x, y, z, theta) {
  return {n_sides : N_SIDES, 
          theta : theta, 
          x : x, 
          y : y, 
          z : z, 
          scale : 1};
}


///////////////////////////////////////////////////////////////
// Define animation variables
///////////////////////////////////////////////////////////////
var SPEED = 0.8;
var SPAWN_INTERVAL = 4;
var MIN_DEPTH = 0.1;
var FOCAL_LENGTH = 14;
var N_SIDES = 4;
var MIN_RENDER_AREA = 0.01;

export class CorridorVisualization {
	constructor(parent_div) {
		this.running = false;
		this.width = parent_div.style('width').slice(0, -2);
		this.height = parent_div.style('height').slice(0, -2);
		this.xscale = d3.scaleLinear()
					  .range([0, this.width])
					  .domain([-1, 1])
		this.yscale = d3.scaleLinear()
					  .range([0, this.height])
					  .domain([-1, 1])
		this.svg = parent_div.append('svg')
		   		.attr('width', this.width)
				.attr('height', this.height)
				.style('background', '#0e0e0e')
				.append('g')
		this.shapes = new Array();
		this.vp = {x: 0, y:0, theta:0, z : 200};
		this.t = 0;
		this.lines = [];
		this.reset()
		this.render()

		this.svg.append('text')
			   .attr('x', 12)
			   .attr('y', 36)
			   .text('Infinite Corridor')
			   .style('fill', 'white')
			   .style('font-size', '32px')
		this.svg.append('text')
			   .attr('x', '50%')
			   .attr('y', '99%')
			   .text('hover to animate, 2x click to reset')
			   .style('fill', 'white')
			   .style('font-style', 'italic')
			   .style('font-size', '12px')
	}
	reset() {
		this.shapes = new Array();
  		while (1) {
    		this.step_physics();
    		if (this.shapes[0].z < 1) {
				break;
			}
		}
	}
	step() {
		if (this.running) {
			this.step_physics();
			this.render();
		}
	}
	render() {
		this.svg.selectAll("line")
			.data(this.lines)
			.join(function(enter) {
				return enter.append("line")
				},
				function(update) {
					return update;
				})
			.attr("x1", d => this.xscale(d.pts[0][0]))
			.attr("y1", d => this.yscale(d.pts[0][1]))
			.attr("x2", d => this.xscale(d.pts[1][0]))
			.attr("y2", d => this.yscale(d.pts[1][1]))
			.attr("stroke-width", function(d) {
				return d.z < 15 ? 15-d.z : 1;
			})
			.attr("opacity", function(d) {
				return d.z < 15 ? d.z/20 : 1;
			})
			.style("stroke", "white");
	}
	update_vp() {
		// updates viewpoint
		this.vp.theta = this.t/500 ;
		this.vp.x = 0.26 * Math.cos(-this.t/50);
		this.vp.y = 0.2 * Math.sin(-this.t/70);
	}
	step_physics() {
  		this.update_vp();
  		if (this.t % SPAWN_INTERVAL == 0) {
    		this.shapes.push(generate_shape(this.vp.x, this.vp.y, this.vp.z, this.vp.theta));
  		}
		this.t++;
  		this.shapes.forEach(sh => {sh.z -= SPEED;});
  		var n_to_remove = 0;
  		let polygon, new_render_area;
  		let render_area = new Polygon([[-this.width/2,-this.height/2],
                                 		[ this.width/2,-this.height/2],
                                 		[-this.width/2, this.height/2],
                                 		[ this.width/2, this.height/2]]);
  		
  		this.lines = [];
  		var i = 0;
  		while (i != this.shapes.length) {
    		if (this.shapes[i].z < MIN_DEPTH) {
				n_to_remove += 1;
    		} else {
				let polygon = new Polygon(get_corners(this.shapes[i], this.vp));
				new_render_area = render_area.polygonOverlap(polygon);
				if (new_render_area !== null) {
					render_area = new_render_area;
					for (const x of render_area.getSides()) {
						this.lines.push({pts:x, z:this.shapes[i].z});
					}
					if (render_area.getUpperBoundArea() < MIN_RENDER_AREA) {
						break;
					}
				}
    		}
    		i++;
  		}
  		if (n_to_remove > 0) {
    		this.shapes.splice(n_to_remove-1, n_to_remove);
  		}
	}
}
