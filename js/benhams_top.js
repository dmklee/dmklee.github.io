const PI = 3.14159; 

export class BenhamsTopVisualization {
	constructor(parent_div) {
		this.running = false;
		this.xscale = d3.scaleLinear()
					  .range([0, parent_div.style('width').slice(0,-2)])
					  .domain([-1, 1])
		this.yscale = d3.scaleLinear()
					  .range([0, parent_div.style('height').slice(0,-2)])
					  .domain([-1, 1])
		this.rscale = d3.scaleLinear()
					  .range([0, parent_div.style('height').slice(0,-2)])
					  .domain([0, 2])
		this.dt = 19;

		this.angle = 0;
		this.radius = 0.75;
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
			   .text("Benham's Top")
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
		// outer circle
		this.svg.append('circle')
				.attr('cx', this.xscale(0))
				.attr('cy', this.yscale(0))
				.attr('r', this.rscale(this.radius))
				.attr('fill', 'white')
				.attr('stroke', '#0e0e0e')
				.attr('stroke-width', this.stroke_width)

		// semicircle
		let semi_path = d3.path();
		semi_path.moveTo(this.xscale(0), this.yscale(0));
		semi_path.arc(this.xscale(0), this.yscale(0), this.rscale(this.radius), PI/2, 3*PI/2, true);
		semi_path.closePath();
		this.semi = this.svg.append('path')
							.attr('d', semi_path)
							.attr('fill', '#0e0e0e')

		// 
		let arcs = d3.path();
		for (let i=0; i<4; i++) {
			for (let j=0; j<3; j++) {
				let r = (0.22+(i+j/3)/5)*this.radius;
				arcs.moveTo(this.xscale(r*Math.cos(0.75*PI+i*PI/4)),
						   this.yscale(-r*Math.sin(0.75*PI+i*PI/4)))
				arcs.arc(this.xscale(0), this.yscale(0), this.rscale(r),
						 1.5*PI-(i+1)*PI/4, 1.5*PI-i*PI/4)
			}
		}
		this.arcs = this.svg.append('path')
							.attr('d', arcs)
							.attr('fill', 'none')
							.attr('stroke', '#0e0e0e')
							.attr('stroke-width', this.stroke_width)
	}
	step() {
		if (this.running) {
			this.step_physics();
			this.render();
		}
	}
	step_physics() {
		this.angle = (this.angle + this.dt) % 360;
	}
	render() {
		let tfm = `rotate(${-this.angle}, ${this.xscale(0)}, ${this.yscale(0)})`;
		this.arcs
			.attr('transform', tfm)
			//.transition();
		this.semi
			.attr('transform', tfm)
			//.transition();
	}
}
