// utility functions
function argMin(array) {
  return [].reduce.call(array, (m, c, i, arr) => c < arr[m] ? i : m, 0);
}
function fastDist2(a, b) {
  return (a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y);
}
function almostEqual(a, b) {
  return Math.abs(a-b) < 1;
}
function triangleToCircle(vertices) {
  //http://www.ambrsoft.com/TrigoCalc/Circle3D.htm
  var [[x1,y1],[x2,y2],[x3,y3]] = vertices;
  var s1 = x1*x1 + y1*y1;
  var s2 = x2*x2 + y2*y2;
  var s3 = x3*x3 + y3*y3;
  var A = x1*(y2-y3)-y1*(x2-x3)+x2*y3-x3*y2;
  var B = s1*(y3-y2)+s2*(y1-y3) +s3*(y2-y1);
  var C = s1*(x2-x3)+s2*(x3-x1) +s3*(x1-x2);
  var D = s1*(x3*y2-x2*y3)+s2*(x1*y3-x3*y1) +s3*(x2*y1-x1*y2);
  
  return {vertices : vertices,
          r2 : (B*B + C*C - 4*A*D)/(4*A*A),
          center : {x:-B/(2*A), y:-C/(2*A)}};
}
function withinCircumference(point, tri) {
  var dist2 = fastDist2(point, tri.center);
  return dist2 < tri.r2;
}
function hashEdge(vertices) {
  // hacky way, works because allvalues will be around 1
  var midx = (vertices[0][0]+vertices[1][0])/2;
  var midy = (vertices[0][1]+vertices[1][1])/2;
  return midx + 10000*midy;
}
function hashVertex(vertex) {
  // hacky way, works because allvalues will be around 1
  return vertex[0].toString() + ',' + vertex[1].toString();
}
function unhashVertex(hash) {
  // hacky way, works because allvalues will be around 1
  return hash.split(',').map(parseFloat)
}


function arrangePathVertices(center, pts) {
	//ToDo: make this faster, use cross product instead 
	pts = pts.sort((a,b) => Math.atan2(a[1]-center[1], a[0]-center[0]) - Math.atan2(b[1]-center[1], b[0]-center[0]));
	pts = pts.sort((a,b) => Math.atan2(a[1]-center[1], a[0]-center[0]) - Math.atan2(b[1]-center[1], b[0]-center[0]));
	return  pts;
}


export class VoronoiVisualization {
	constructor(parent_div) {
		this.running = false;
		this.xscale = d3.scaleLinear()
					  .range([0, parent_div.style('width')])
					  //.domain([-2.5, 2.5])
					  .domain([0,1])
		this.yscale = d3.scaleLinear()
					  .range([0, parent_div.style('height')])
					  //.domain([-2.5, 2.5])
					  .domain([0,1])
		this.dt = 0.008;
		this.svg = parent_div.append('svg')
		   		.attr('width', parent_div.style('width'))
				.attr('height', parent_div.style('height'))
				.style('background', '#0e0e0e')
				.append('g')

		this.n_points = 60;
		this.age_limit = 3;
		this.color_cycle = 500;
		this.age = 0;

		this.reset();
		this.render();

		this.svg.append('text')
			   .attr('x', 12)
			   .attr('y', 36)
			   .text('Voronoi')
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
		this.points = [];
		for (let i=0; i!=this.n_points;i++) {
			this.points.push({i: i,
							  x: Math.random(),
							  y: Math.random(),
				              dx: Math.random()-0.5,
							  dy: Math.random()-0.5});
		}

		this.paths = [];
		let path = this.compute_voronoi()
		for (let i=0; i!=this.age_limit; i++) {
			this.paths.push(path);
		}
	}
	compute_voronoi() {
		let triangulation = this.run_BW_triangulation();

		// calculate voronoi, e.g. inversion of delauney triangulation
		// https://en.wikipedia.org/wiki/Delaunay_triangulation
		var dict = {};
		for (let i=0; i!=this.n_points; i++) {
			dict[hashVertex([this.points[i].x, this.points[i].y])] = [];
		}

		this.data = [];
		var hash, hash_center, existing;
		for (const [index, tri] of triangulation.entries()) {
			hash_center = hashVertex([tri.center.x, tri.center.y]);
			for (let i=0; i!=3; i++) {
				hash = hashVertex(tri.vertices[i]);
				if (hash in dict) {
					dict[hash].push(hash_center);
				}
			}
		}
		let pt_id = 0;
		let cx, cy;
		for (const [hash, ob] of Object.entries(dict)) {
			let vertex = unhashVertex(hash);
			let pts = [];
			let other;
			for (const o of ob) {
				other = unhashVertex(o);
				pts.push(other);
			}
			pts = arrangePathVertices(vertex, pts);
		 
			this.data.push(pts);

			// TODO: stabilize this movement, it becomes large near the edges
			//cx = pts.reduce((a,b)=>a+b[0],0)/pts.length;
			//cy = pts.reduce((a,b)=>a+b[1],0)/pts.length;
			//this.points[pt_id].dx = -0.5*Math.random()*(this.points[pt_id].x - cx);
			//this.points[pt_id].dy = -0.5*Math.random()*(this.points[pt_id].y - cy);

			pt_id++;
		}
	}
	render() {
		this.paths.shift()
		this.paths.push(this.convert_to_path(this.data));

		this.svg.selectAll("path")
		   .data(this.paths.entries())
		   .join(
			  function(enter) {
				return enter.append("path")
			  },
			  function(update) {
				return update;
			  }
		   )
		   .attr("d", d => d[1])
		   .attr("fill", "none")
		   .attr("stroke", d => d3.interpolateRainbow(((d[0]+this.age)%(this.color_cycle))/(this.color_cycle)))
		   .attr("stroke-width", "2px")
		   .attr("stroke-opacity", d => 1-d[0]/this.age_limit);

	}
	convert_to_path(data) {
		let path = d3.path();
		let x, y, L;
		for (const pts of data) {
			x = pts.map(d => this.xscale(d[0]).slice(0,-2));
			y = pts.map(d => this.yscale(d[1]).slice(0,-2));
			L = pts.length;
			path.moveTo(x[0],y[0]);
			for (let i=0; i!=L; i++) {
				path.lineTo(x[i],y[i]);
			}
			path.lineTo(x[0],y[0]);
		}
		path.closePath();

		return path;
	}

	step_physics() {
		for (let i=0; i!=this.n_points;i++) {
			this.points[i].x += this.dt * this.points[i].dx;
			this.points[i].y += this.dt * this.points[i].dy;

			this.points[i].x += -1.4*(this.points[i].x > 1.2) + 1.4*(this.points[i].x < -0.2);
			this.points[i].y += -1.4*(this.points[i].y > 1.2) + 1.4*(this.points[i].y < -0.2);
		}
	}
	step() {
		if (this.running) {
			if (this.age%3 == 0) {
				this.step_physics();
				this.compute_voronoi();
				this.render();
			}
			this.age++;
		}
	}
	run_BW_triangulation() {
  		// bowyer watson algorithm
  		// sorting will result in better performance
  		var sorted_pts = [...this.points].sort((a,b) => a.x > b.x);
  
  		var triangulation = [];
  		// start with super triangle holding all points
  		var super_triangle = triangleToCircle([[-1,-0.5],[0.5,2.5],[2,-0.5]]);
  		triangulation.push(super_triangle);
  
  		var bad_triangles, bad_edge_dict, polygon, point, tri, edge;
  		var polygon;
  		var count = 0;
  		for (point of sorted_pts) {
    		count += 1;
    		bad_triangles = [];
    		bad_edge_dict = {};
    		for (tri of triangulation) {
				if (withinCircumference(point, tri)) {
					bad_triangles.push(tri);
					for (let j=0;j<3;++j) {
						var hash_val = hashEdge([tri.vertices[j], tri.vertices[(j+1)%3]]);
						bad_edge_dict[hash_val] = hash_val in bad_edge_dict ? bad_edge_dict[hash_val]+1 : 1;
					}
				}
    		}
    		polygon = [];
    		for (tri of bad_triangles) {
				for (let j=0;j<3;++j) {
					var vert = [tri.vertices[j], tri.vertices[(j+1)%3]];
					if (bad_edge_dict[hashEdge(vert)] == 1) {
						polygon.push(vert);
					}
				}
    		}
    		var old_length = triangulation.length;
    		for (tri of bad_triangles) {
				var index = triangulation.indexOf(tri);
				if (index > -1) {
					triangulation.splice(index, 1);
				}
    		}
    		for (edge of polygon) {
				triangulation.push(triangleToCircle([edge[0],edge[1], [point.x,point.y]]));
    		}
		}
  		return triangulation;
	}
}
