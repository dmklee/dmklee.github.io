const PI = 3.14159;
const SQ2 = 1.4142135;

export class FlockVisualization {
	constructor(parent_div) {
		this.running = false;
		this.xscale = d3.scaleLinear()
					  .range([0, parent_div.style('width')])
					  .domain([-0., 1.])
		this.yscale = d3.scaleLinear()
					  .range([0, parent_div.style('height')])
					  .domain([-0., 1.])
		this.n_birds = 400;
		this.bird_size = 0.03;
		this.noise_magn = 0.40;
		this.n_grid = 3;
		this.dt = 0.004;
		this.svg = parent_div.append('svg')
		   		.attr('width', parent_div.style('width'))
				.attr('height', parent_div.style('height'))
				.style('background', '#0e0e0e')
				.append('g')
		this.reset();

		this.render_first_time();
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
		this.noise_magn = 0.3 + 0.2*(Math.random()-0.5);

		this.birds = [];
		for (let i=0; i<this.n_birds; i++) {
			this.birds.push({
				x:Math.random(),
				y:Math.random(),
				th:2*PI*Math.random(),
				speed:1 + 0.2*(Math.random()-0.5),
			});
		}
		this.birds.forEach(function(d) {d.dx = Math.cos(d.th); d.dy = Math.sin(d.th);});
	}
	step() {
		if (this.running) {
			this.step_physics();
			this.render();
		}
	}
	render_first_time() {
		let m = this.xscale(this.bird_size).slice(0,-2);
		let bird_path = d3.path();
		bird_path.moveTo(m/5,0);
		bird_path.lineTo(0,-m/3);
		bird_path.lineTo(m, 0);
		bird_path.lineTo(0, m/3);
		bird_path.closePath();
		this.svg.selectAll('#bird')
		   .data(this.birds)
		   .enter()
		   .append('path')
		   .attr('id', 'bird')
		   .attr('d', bird_path)
		   .attr('fill', 'blue')
		   .attr('opacity', '0.7')
	}
	render() {
		let xscale = d => this.xscale(d).slice(0,-2);
		let yscale = d => this.yscale(d).slice(0,-2);
		this.svg.selectAll('#bird')
		   .data(this.birds)
		   //.transition()
		   //.duration(1000*this.dt)
		   .attr('transform', function(d) {
			   let tx = xscale(d.x);
			   let ty = yscale(d.y);
			   let rot = 180 * d.th / PI;
			   return `translate(${tx},${ty}) rotate(${rot})`;
		   })
	}
	step_physics() {
		// avoid wall
		let grid_pools = [];
		for (let i=0; i< this.n_grid*this.n_grid; i++){
			grid_pools.push({dx:0, dy:0, count:0});
		}
		for (let i=0;i<this.n_birds; i++) {
			let x = Math.min(Math.max(this.birds[i].x, 0.001), 0.999);
			let y = Math.min(Math.max(this.birds[i].y, 0.001), 0.999);
			this.birds[i].grid_id = Math.floor(this.n_grid*x) + this.n_grid * Math.floor(this.n_grid*y);
			grid_pools[this.birds[i].grid_id].dx += this.birds[i].dx;
			grid_pools[this.birds[i].grid_id].dy += this.birds[i].dy;
			grid_pools[this.birds[i].grid_id].count += 1;
		}
		for (let i=0; i<grid_pools.length; i++){
			grid_pools[i].dx = grid_pools[i].dx / grid_pools[i].count;
			grid_pools[i].dy = grid_pools[i].dy / grid_pools[i].count;
		}

		for (let i=0;i<this.n_birds; i++) {
			let d = this.birds[i];
			//noise
			let dth = this.noise_magn*(Math.random()-0.5);
			 //adjust dth to avoid wall, need to make this smooth
			if (d.x < 0.4 && d.dx < 0) {
				dth -= 0.1*d.dy * Math.pow(1.1-d.x, 2);
			} else if (d.x > 0.6 && d.dx > 0) {
				dth += 0.1*d.dy * Math.pow(d.x+0.1, 2);
			} else if (d.y < 0.4 && d.dy < 0) {
				dth += 0.1*d.dx * Math.pow(1.1-d.y, 2);
			} else if (d.y > 0.6 && d.dy > 0) {
				dth -= 0.1*d.dx * Math.pow(d.y+0.1, 2);
			}
			let dot = grid_pools[d.grid_id].dx * d.dx + grid_pools[d.grid_id].dy * d.dy;
			let cross = grid_pools[d.grid_id].dx * d.dy - grid_pools[d.grid_id].dy * d.dx;
			if (0.83 > Math.abs(dot) > 0.4) {
				dth -= cross*0.1;
			}
			if (Math.abs(dot) > 0.83) {
				dth += cross*0.1;
			}
			d.x += d.speed * d.dx * this.dt;
			d.y += d.speed * d.dy * this.dt;
			d.th += dth;
			d.dx = Math.cos(d.th);
			d.dy = Math.sin(d.th);
		};
	}
}
