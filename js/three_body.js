class Planet {
	constructor(radius, mass, color, trace_age=0) {
		this.radius = radius;
		this.color = color;
		this.mass = mass;

		// leaves a trace behind the trajectory
		this.trace_age = trace_age;

		this.reset();
	}
	step(ax, ay, dt) {
		//updates vel and pos given acceleration
		this.vx += ax*dt;
		this.vy += ay*dt;
		let x = this.data[this.data.length-1].x + this.vx * dt;
		let y = this.data[this.data.length-1].y + this.vy * dt;
		if (this.data.length >= this.trace_age) {
			//remove oldest trace
			this.data.shift();
		}
		this.data.push({x:x, y:y});
	}
	reset() {
		// resets position and sets velocity to zero, erases trace history
		this.data = [{x:2*(Math.random()-0.5),
					  y:2*(Math.random()-0.5)}];
		this.i = 0;
		this.vx = 0;
		this.vy = 0;
	}
	recenter(cx, cy, xrange, yrange) {
		this.data[this.data.length-1].x -= cx;
		this.data[this.data.length-1].y -= cy;

		this.data[this.data.length-1].x /= xrange;
		this.data[this.data.length-1].y /= yrange;
	}
 	trace(xscale, yscale) {
		var path = d3.path();
		path.moveTo(xscale(this.data[0].x).slice(0,-2), yscale(this.data[0].y).slice(0,-2));

		for (let i=1; i<this.data.length; i++) {
			path.lineTo(xscale(this.data[i].x).slice(0,-2), yscale(this.data[i].y).slice(0,-2));
		}
		return {path: path, stroke: this.fill};
	}
	get fill() {
		return `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`;
	}
	get position() {
		return this.data[this.data.length-1];
	}
	get x() {
		return this.data[this.data.length-1].x;
	}
	get y() {
		return this.data[this.data.length-1].y;
	}
}


export class ThreeBodyVisualization {
	constructor(parent_div) {
		this.running = false;
		this.xscale = d3.scaleLinear()
					  .range([0, parent_div.style('width')])
					  .domain([-1, 1])
		this.yscale = d3.scaleLinear()
					  .range([0, parent_div.style('height')])
					  .domain([-1, 1])
		this.age = 100; // length of tracer
		this.G = 8;
		this.dt = 0.002;
		this.svg = parent_div.append('svg')
		   		.attr('width', parent_div.style('width'))
				.attr('height', parent_div.style('height'))
				.style('background', '#0e0e0e')
				.append('g')
		this.reset_planets();
		this.render();
		this.svg.append('text')
			   .attr('x', 12)
			   .attr('y', 36)
			   .text('Three Body Problem')
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
		this.reset_planets();
	}
	step() {
		if (this.running) {
			this.step_physics();
			this.render();
		}
	}
	reset_planets() {
		this.planets = [new Planet(10, 1, [220,   0,   0], this.age),
						new Planet(10, 1, [220, 220,   80], this.age),
			    		new Planet(10, 1, [  0,   0, 220], this.age)];
		// redistribute this.planets
		var xs = this.planets.map(d=>d.x);
		var ys = this.planets.map(d=>d.y);
		var x_min = Math.min(...xs);
		var x_max = Math.max(...xs);
		var y_min = Math.min(...ys);
		var y_max = Math.max(...ys);
		var cx = (x_max + x_min) / 2;
		var cy = (y_max + y_min) / 2;
		this.planets.forEach(d=>d.recenter(cx, cy, x_max-x_min, y_max-y_min))
		return this.planets;
	}
	step_physics() {
		// this function computes the forces between all planets and updates their
		// positions. it does NOT do any rendering
		let n_planets = this.planets.length;

		let accelerations = [];
		for (let i=0; i!=n_planets; i++) {
			accelerations.push({ax:0,ay:0});
		}
		let distx, disty, dist;
		for (let i=0; i<n_planets; i++) {
			for (let j=i+1; j<n_planets; j++) {
				// dist from i to j
				distx = this.planets[j].x - this.planets[i].x;
				disty = this.planets[j].y - this.planets[i].y;
				dist = distx*distx + disty*disty;

				// to prevent ejection of planets, add minimal distance
				dist = Math.max(dist, 0.0001);

				accelerations[i].ax += distx * this.G * this.planets[j].mass / dist;
				accelerations[i].ay += disty * this.G * this.planets[j].mass / dist;

				accelerations[j].ax -= distx * this.G * this.planets[i].mass / dist;
				accelerations[j].ay -= disty * this.G * this.planets[i].mass / dist;
			}
		}

		// update 
		for (let i=0; i<n_planets; i++) {
			this.planets[i].step(accelerations[i].ax, accelerations[i].ay, this.dt);
		}
	}
	render() {
		this.svg.selectAll('#trace')
		   .data(this.planets.map(d=>d.trace(this.xscale, this.yscale)))
		   .join(
			   function(enter) {return enter.append('path');},
			   function(update) {return update;}
		   )
		   .attr('id', 'trace')
		   .attr('d', d => d.path)
		   .attr('stroke', d => d.stroke)
		   .attr('stroke-width', 2)
		   .attr('fill', 'none')

		this.svg.selectAll('#planet')
		   .data(this.planets)
		   .join(
			   function(enter) {return enter.append('circle');},
			   function(update) {return update;}
		   )
		   .transition()
		   .duration(1000*this.dt)
		   .attr('id', 'planet')
		   .attr('r', d => d.radius)
		   .attr('fill', d => d.fill)
		   .attr('cx', d => this.xscale(d.x))
		   .attr('cy', d => this.yscale(d.y))
	}
}
