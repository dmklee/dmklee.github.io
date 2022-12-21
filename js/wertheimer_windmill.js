const PI = 3.14159; 

export class WindmillVisualization {
	constructor(parent_div) {
		this.running = false;
		this.xscale = d3.scaleLinear()
					  .range([0, parent_div.style('width').slice(0,-2)])
					  .domain([-1, 1])
		this.yscale = d3.scaleLinear()
					  .range([0, parent_div.style('height').slice(0,-2)])
					  .domain([-1, 1])
		this.age = 0;
		this.flip_mod = 36;

		this.stroke_width = '3px';

		this.svg = parent_div.append('svg')
		   		.attr('width', parent_div.style('width'))
				.attr('height', parent_div.style('height'))
				.style('background', '#0e0e0e')
				.append('g')
		this.reset();

		this.svg.append('text')
			   .attr('x', 12)
			   .attr('y', 36)
			   .text("Windmill")
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
		let windmill = d3.path();
		windmill.moveTo(this.xscale(0.4), this.yscale(0.4));
		windmill.lineTo(this.xscale(-0.4), this.yscale(-0.4));
		windmill.moveTo(this.xscale(-0.4), this.yscale(0.4));
		windmill.lineTo(this.xscale(0.4), this.yscale(-0.4));
		this.windmill = this.svg.append('path')
							.attr('d', windmill)
							.attr('stroke', 'white')
							.attr('stroke-width', '7px')
	}
	step() {
		if (this.running) {
			this.step_physics();
			this.render();
		}
	}
	step_physics() {
		this.age = (this.age + 1) % this.flip_mod;
	}
	render() {
		let rot = 45*(this.age >= this.flip_mod/2);
		let tfm = `rotate(${rot}, ${this.xscale(0)}, ${this.yscale(0)})`;
		this.windmill.attr('transform', tfm)
	}
}
