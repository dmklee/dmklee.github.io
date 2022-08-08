export class FlockVisualization {
	constructor(parent_div) {
		this.running = false;
		this.xscale = d3.scaleLinear()
					  .range([0, parent_div.style('width')])
					  .domain([-0.1, 1.1])
		this.yscale = d3.scaleLinear()
					  .range([0, parent_div.style('height')])
					  .domain([-0.1, 1.1])
		this.n_birds = 100;
		this.bird_size = 0.04;
		this.noise_magn = 0.05;
		this.dt = 0.01;
		this.svg = parent_div.append('svg')
		   		.attr('width', parent_div.style('width'))
				.attr('height', parent_div.style('height'))
				.style('background', '#0e0e0e')
				.append('g')
		this.reset_birds();
		this.render();
		this.svg.append('text')
			   .attr('x', 12)
			   .attr('y', 36)
			   .text('Flock Together')
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
		this.reset_birds();
	}
	step() {
		if (this.running) {
			this.step_physics();
			this.render();
		}
	}
	reset_birds() {
		this.birds = [];
		for (let i=0; i<this.n_birds; i++) {
			this.birds.push({
				x:Math.random(),
				y:Math.random(),
				th:2*3.14159*Math.random(),
			});
		}
		this.birds.forEach(function(d) {d.dx = Math.cos(d.th); d.dy = Math.sin(d.th);});
	}
	render() {
		this.svg.selectAll('#bird')
		   .data(this.birds)
		   .join(
			   function(enter) {return enter.append('line');},
			   function(update) {return update;}
		   )
		   .transition()
		   .duration(1000*this.dt)
		   .attr('id', 'bird')
		   .attr('x1', d => this.yscale(d.x - 0.5*this.bird_size*d.dx))
		   .attr('y1', d => this.xscale(d.y - 0.5*this.bird_size*d.dy))
		   .attr('x2', d => this.xscale(d.x + 0.5*this.bird_size*d.dx))
		   .attr('y2', d => this.xscale(d.y + 0.5*this.bird_size*d.dy))
		   .attr('stroke', 'white')
		   .attr('stroke-width', 3)
		this.svg.selectAll('#birdhead')
		   .data(this.birds)
		   .join(
			   function(enter) {return enter.append('line');},
			   function(update) {return update;}
		   )
		   .transition()
		   .duration(1000*this.dt)
		   .attr('id', 'birdhead')
		   .attr('x1', d => this.yscale(d.x))
		   .attr('y1', d => this.xscale(d.y))
		   .attr('x2', d => this.xscale(d.x + 0.5*this.bird_size*d.dx))
		   .attr('y2', d => this.xscale(d.y + 0.5*this.bird_size*d.dy))
		   .attr('stroke', 'blue')
		   .attr('stroke-width', 3)
	}
	step_physics() {
		// avoid wall
		let grid_pools = [];
		let n_grid = 5;
		for (let i=0; i< n_grid*n_grid; i++){
			grid_pools.push({dx:0, dy:0});
		}
		for (let i=0;i<this.n_birds; i++) {
			let x = Math.min(Math.max(this.birds[i].x, 0.001), 0.999);
			let y = Math.min(Math.max(this.birds[i].y, 0.001), 0.999);
			this.birds[i].grid_id = Math.floor(n_grid*x) + n_grid * Math.floor(n_grid*y);
			grid_pools[this.birds[i].grid_id].dx += this.birds[i].dx;
			grid_pools[this.birds[i].grid_id].dy += this.birds[i].dy;
		}
		for (let i=0;i<this.n_birds; i++) {
			let d = this.birds[i];
			let dth = 0.15*(Math.random()-0.5);
			// adjust dth to avoid wall, need to make this smooth
			if (d.x < 0.1 && d.dx < 0) {
				dth += d.dy < 0 ? 0.15 : -0.15;
			} else if (d.x > 0.9 && d.dx > 0) {
				dth += d.dy > 0 ? 0.15 : -0.15;
			} else if (d.y < 0.1 && d.dy < 0) {
				dth += d.dx > 0 ? 0.15 : -0.15;
			} else if (d.y > 0.9 && d.dy > 0) {
				dth += d.dx < 0 ? 0.15 : -0.15;
			}
			let dot = grid_pools[d.grid_id].dx * d.dx + grid_pools[d.grid_id].dy * d.dy;
			let cross = grid_pools[d.grid_id].dx * d.dy - grid_pools[d.grid_id].dy * d.dx;
			if (0.95 > Math.abs(dot) > 0.1) {
				dth -= Math.sign(cross) * 0.1;
			}

			d.x += d.dx * this.dt;
			d.y += d.dy * this.dt;
			d.th += dth;
			d.dx = Math.cos(d.th);
			d.dy = Math.sin(d.th);
		};
	}
}
