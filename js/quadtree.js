const PI = 3.14159;

// utility functions
function make_quadtree(pts, ctr, depth, max_depth) {
	if (depth == max_depth || pts.length == 0) {
		return {
			'pts' : pts,
			'aabb' : [ctr[0]-2**(-depth), ctr[1]-2**(-depth), ctr[0]+2**(-depth), ctr[1]+2**(-depth)],
			'is_terminal' : depth == max_depth,
		}
	}
	let quad_pts = {'nw' : [], 'ne' : [], 'se' : [], 'sw': []};
	for (const pt of pts) {
		if (pt.x >= ctr[0]) {
			if (pt.y >= ctr[1]) {
				quad_pts['ne'].push(pt);
			} else {
				quad_pts['se'].push(pt);
			}
		} else {
			if (pt.y >= ctr[1]) {
				quad_pts['nw'].push(pt);
			} else {
				quad_pts['sw'].push(pt);
			}
		}
	}
	return {
		'ne' : make_quadtree(quad_pts['ne'], [ctr[0] + 2**(-depth-1), ctr[1] + 2**(-depth-1)], depth+1, max_depth),
		'nw' : make_quadtree(quad_pts['nw'], [ctr[0] - 2**(-depth-1), ctr[1] + 2**(-depth-1)], depth+1, max_depth),
		'sw' : make_quadtree(quad_pts['sw'], [ctr[0] - 2**(-depth-1), ctr[1] - 2**(-depth-1)], depth+1, max_depth),
		'se' : make_quadtree(quad_pts['se'], [ctr[0] + 2**(-depth-1), ctr[1] - 2**(-depth-1)], depth+1, max_depth),
	}
}

function deleaf_quadtree(qtree) {
	if ("aabb" in qtree) {
		if (qtree['pts'].length == 0 && qtree['is_terminal']) {
			return [];
		} else {
			return [qtree["aabb"]];
		}

	} else {
		let aabbs = [];
		aabbs.push(...deleaf_quadtree(qtree['nw']));
		aabbs.push(...deleaf_quadtree(qtree['ne']));
		aabbs.push(...deleaf_quadtree(qtree['sw']));
		aabbs.push(...deleaf_quadtree(qtree['se']));
		return aabbs;
	}
}


export class QuadTreeVisualization {
	constructor(parent_div) {
		this.running = false;
		this.xscale = d3.scaleLinear()
					  .range([0, parent_div.style('width')])
					  .domain([-1, 1])
		this.yscale = d3.scaleLinear()
					  .range([0, parent_div.style('height')])
					  .domain([-1, 1])
		this.relscale = d3.scaleLinear()
					  .range([0, parent_div.style('height')])
					  .domain([0, 2])
		this.dt = 0.005;
		this.svg = parent_div.append('svg')
		   		.attr('width', parent_div.style('width'))
				.attr('height', parent_div.style('height'))
				.style('background', '#0e0e0e')
				.append('g')

		this.n_points = 32;
		this.max_depth = 6;
		this.age_limit = 3;
		this.color_cycle = 500;
		this.age = 0;

		this.reset();
		this.render();

		this.svg.append('text')
			   .attr('x', 12)
			   .attr('y', 36)
			   .text('QuadTree')
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
							  x: 2*Math.random()-1,
							  y: 2*Math.random()-1,
				              th: 2*PI*Math.random(),
				              vel: Math.random()/2+0.5,
			});
		}
		this.compute_quadtree();
	}
	compute_quadtree() {
		this.quadtree = make_quadtree(this.points, [0, 0], 0, this.max_depth);

		// compute all active quads
		this.aabbs = deleaf_quadtree(this.quadtree);
	}
	render() {

		this.svg.selectAll("rect")
		   .data(this.aabbs)
		   .join(
			  function(enter) {
				return enter.append("rect")
			  },
			  function(update) {
				return update;
			  }
		   )
		   .attr("x", d => this.xscale(d[0]))
		   .attr("y", d => this.yscale(d[1]))
		   .attr("width", d => this.relscale(d[2] - d[0]))
		   .attr("height", d => this.relscale(d[3] - d[1]))
		   //.attr("fill", "blue")
		   //.attr("fill-opacity", d => d.active ? 0.4 : 0.0)
		   .attr("fill", "none")
		   .attr("stroke", "white")
		   .attr("stroke-width", "1px")

		//this.svg.selectAll("circle")
		   //.data(this.points)
		   //.join(
			  //function(enter) {
				//return enter.append("circle")
			  //},
			  //function(update) {
				//return update;
			  //}
		   //)
		   //.attr("r", "2px")
		   //.attr("cx", d => this.xscale(d.x))
		   //.attr("cy", d => this.yscale(d.y))
		   //.attr("fill", "none")
		   //.attr("stroke", "blue")
		   //.attr("stroke-width", "2px")


	}
	step_physics() {
		for (let i=0; i!=this.n_points;i++) {
			this.points[i].th = this.points[i].th + 0.1*(Math.random()-0.5);
			this.points[i].x += this.dt * this.points[i].vel * Math.cos(this.points[i].th);
			this.points[i].y += this.dt * this.points[i].vel * Math.sin(this.points[i].th);

			this.points[i].x += -2.1*(this.points[i].x > 1.1) + 2.1*(this.points[i].x < -1.1);
			this.points[i].y += -2.1*(this.points[i].y > 1.1) + 2.1*(this.points[i].y < -1.1);
		}
	}
	step() {
		if (this.running) {
			this.step_physics();
			this.compute_quadtree();
			this.render();
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
