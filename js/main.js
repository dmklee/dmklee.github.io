import { ThreeBodyVisualization } from './three_body.js';
import { CorridorVisualization } from './corridor.js';
//import { FlockVisualization } from './flock.js';
//import { ErosionVisualization } from './erosion.js';

const publications = [
	{'title' : "I2I: Image to Icosahedral Projection for SO(3) Object Reasoning from Single-View Images",
	 'authors' : 'David M. Klee, Ondrej Biza, Robert Platt, Robin Walters',
	 'destination' : 'Preprint',
	 'media' : 'assets/publications/i2i/media.png',
	 'buttons' : {
		 'PDF' : 'https://arxiv.org/abs/2207.08925',
	 }
	},
	{'title' : 'Graph Structured Policy Learning for Multi-Goal Manipulation Tasks',
	 'authors' : 'David M. Klee, Ondrej Biza, Robert Platt',
	 'destination' : 'IROS 2022, Kyoto, Japan',
	 'media' : 'assets/publications/iros22/media.png',
	 'buttons' : {
		 'Webpage' : 'https://dmklee.github.io/graph-structured-manip',
		 'PDF' : 'https://arxiv.org/abs/2207.11313',
		 'Video' : '',
		 'Talk' : '',
		 'Code' : 'https://github.com/dmklee/graph-structured-manip',
	 }
	},
	{'title' : "Understanding the Mechanism behind Data Augmentation's Success on Image Based RL",
	 'authors' : 'David M. Klee, Robin Walters, Robert Platt',
	 'destination' : 'RLDM 2022, Providence, RI, USA',
	 'media' : 'assets/publications/data_aug/media.png',
	 'buttons' : {
		 'PDF' : './assets/publications/data_aug/paper.pdf',
		 'Poster' : './assets/publications/data_aug/poster.pdf',
	 }
	},
	{'title' : "A compact, portable, re-configurable, and automated system for on-demand pharmaceutical tablet manufacturing",
	 'authors' : 'Mohammad Azad, Juan Osorio, David Brancazio, Gregory Hammersmith, David M. Klee, Kersten Rapp, Allan Myerson',
	 'destination' : 'International Journal of Pharmaceutics 539 (1-2), 157-164',
	 'media' : 'assets/publications/pod/media.png',
	 'buttons' : {
		 'PDF' : 'https://www.sciencedirect.com/science/article/am/pii/S0378517318300395',
	 }
	},
	// template
	{'title' : "",
	 'authors' : '',
	 'destination' : '',
	 'media' : '',
	 'buttons' : {
		 'PDF' : '',
		 'Website' : '',
		 'Poster' : '',
		 'Cite' : '',
	 }
	},
];
const teaching_experiences = [
	{'course' : 'CS4910: Deep Learning for Robotics',
	 'website' : 'https://www.ccs.neu.edu/home/dmklee/cs4910_s22/index.html',
	 'role' : 'Instructor',
	 'location' : 'Northeastern University',
	 'date' : 'Spring 2022',
	 'buttons' : {
	 },
	},
	{'course' : 'CS5100: Foundations of Artificial Intelligence',
	 'role' : 'Teaching Assistant',
	 'website' : '',
	 'location' : 'Northeastern University',
	 'date' : 'Fall 2020',
	 'buttons' : {
	 },
	},
];
const socials = [
	{'name' : 'Email',
	 'link' : 'mailto:klee.d@northeastern.edu',
	 'img' : 'assets/images/mail_icon.png',
	},
	{'name' : 'Github',
	 'link' : 'https://www.github.com/dmklee',
	 'img' : 'assets/images/github_icon.png',
	},

];
const projects = [
	{'title' : 'NURO Arm',
	 'desc' : 'Accessible educational platform for hands-on robotics projects.  Offers simple Python interface for controlling robotic arm with cross-platform support and virtual simulator.',
	 'media' : 'assets/projects/nuro-arm/media.png',
	 'buttons' : {
		 'Website' : 'https://github.com/dmklee/nuro-arm',
		 'Docs' : 'https://nuro-arm.readthedocs.io/en/latest/?',
	 }
	},
]

const name = "David M. Klee";

d3.select("body")
	.style("max-width", "1000px")
	.style("margin", "0 auto")
	.style("font-family", "Times New Roman")
	.style("font-size", "1.2rem")

var header = d3.select("#header")
	.style('width', '100%')
	.style('border-bottom', '4px solid black')
	.append('p')
	.text(name)
	.style('font-size', '2.1rem')
	.style('padding', '25px 0 5px 20px')
	.style('margin', '0')

var main = d3.select('#main')

var intro_div = main.append('div')
					.style('margin', '15px auto 0 auto')
					.style('display', 'flex')
					.style('flex-wrap', 'wrap')
					.style('flex-direction', 'row')
					.style('justify-content', 'space-around')
					.style('padding', '15px')
				

// avatar
intro_div.append('div')
		 .style('width', '30%')
		 .style('margin', 'auto 0')
		 .style('min-width', '100px')
		 .style('max-width', '200px')
		 .append('img')
		 .attr('id', 'avatar')
		 .attr('src', 'assets/images/avatar.png')
		 .style('border-radius', '50%')
		 .style('width', '100%')

// introduction
var text_intro = intro_div.append('div')
		      .style('margin', 'auto 0')
		      .style('min-width', '300px')
		      .style('max-width', '600px')
		      .style('text-align', 'justify')

var bio_text = `I am a PhD student at Northeastern University.  I am a member of the Helping Hands Lab, 
			   advised by Robert Platt. I am studying how to learn object representations for robotic 
			   manipulation tasks. I am also interested in robotics education and low-cost robotic manipulators.`
var links_to_add = [
	{text: 'Helping Hands Lab', href:'https://www2.ccs.neu.edu/research/helpinghands/group.html'},
	{text: 'Robert Platt', href:'https://www.khoury.northeastern.edu/people/robert-platt/'},
];
					

function add_text_with_links(text, links, parent_div) {
	for (let i=0; i<links.length; i++) {
		links[i].start_idx = text.search(links[i].text);
	}
	links = links.sort((a,b) => (a.start_idx > b.start_idx) ? 1 : -1)

	// now go in order through the text adding spans or anchors as needed
	let loc = 0
	for (let i=0; i<links.length; i++) {
		if (links[i].start_idx == -1 ) continue;
		parent_div.append('span')
				  .text(text.slice(loc, links[i].start_idx))
		parent_div.append('a')
				  .attr('href', links[i].href)
				  .text(links[i].text)
		loc = links[i].start_idx + links[i].text.length;
	}
	parent_div.append('span')
			  .text(text.slice(loc))
}
add_text_with_links(bio_text, links_to_add, text_intro);
text_intro.selectAll("a")
		  .style('color', 'blue')

function make_header(title) {
	main.append('div')
		.style('border-bottom', '2px solid black')
		.style('width', '100%')
		.append('p')
		.style('margin', '0')
		.style('padding-left', '15px')
		.style('padding-top', '30px')
		.style('padding-bottom', '5px')
		.style('font-size', '1.6rem')
		.text(title)
}
function add_publication(pub) {
	if (pub['title'].length == 0) {
		return;
	}
	var div = main.append('div')
				  .style('width', '95%')
				  .style('display', 'flex')
				  .style('flex-wrap', 'wrap')
			 	  .style('flex-direction', 'row')
				  .style('justify-content', 'flex-start')
				  .style('align-items', 'center')
				  .style('margin', '20px 10px 20px 10px')

	var media = div.append('div')
					.append('img')
					.attr('src', pub['media'])
					.style('overflow', 'hidden')
					.style('object-fit', 'scale-down')
					.style('width', '200px')
					.style('margin-right', '20px')

	var ref = div.append('div')
		.style('margin', 'auto 0')
		.style('max-width', '700px')
	ref.append('text')
		.style('font-weight', 'bold')
		.text(pub['title'])
	ref.append('br')
	ref.append('text')
		.text(pub['authors'])
	ref.append('br')
	ref.append('text')
		.style('font-style', 'italic')
		.text(pub['destination'])

	var buttons_row = ref.append('div')
						  .style('width', '100%')
						  .style('display', 'flex')
						  .style('flex-direction', 'row')
						  .style('justify-content', 'flex-start')

	function add_button(button) {
		var text = button[0];
		var target = button[1];
		if (target.length == 0) return;

		buttons_row.append('a')
				   .on('mouseover', function() {
					   d3.select(this).style('background-color', 'blue');
					   d3.select(this).style('color', 'white');
					   d3.select(this).style('font-weight', 'bold');
				   })
				   .on('mouseout', function() {
					   d3.select(this).style('background-color', 'white');
					   d3.select(this).style('color', 'blue');
					   d3.select(this).style('font-weight', 'normal');
				   })
				   .style('text-decoration', 'none')
				   .style('color', 'blue')
				   .style('font-size', '1.0rem')
				   .style('border', 'blue 1px solid')
				   .style('padding', '2px 4px')
				   .style('margin', '6px 5px')
				   .style('border-radius', '5px')
				   .attr('href', target)
				   .text(text)
	}
	Object.entries(pub['buttons']).map(add_button);
}

make_header('Publications');
publications.map(add_publication);

function add_teaching_experience(exp) {
	var div = main.append('div')
				  .style('width', '95%')
				  .style('margin', '10px auto')
				  .style('display', 'flex')
				  .style('flex-wrap', 'wrap')
			 	  .style('flex-direction', 'row')
				  .style('justify-content', 'flex-start')
	var ref = div.append('div')
	if (exp['website'] != '') {
		ref.append('a')
			.attr('href', exp['website']).text(exp['course'])
	} else {
		ref.text(exp['course'])
	}
	ref.append('text')
		.text(' (' + exp['date'] + ')')
	ref.append('br')
	ref.append('text')
		.style('font-weight', 'bold')
		.text(exp['role'])
	ref.append('text')
		.style('font-style', 'italic')
		.text(', ' + exp['location'])
}
make_header('Teaching');
teaching_experiences.map(add_teaching_experience);

// outreach
//make_header('Outreach');

//main.append('div')
    //.style('width', '100%')
    //.style('height', '200px')
	//.style('overflow', 'hidden')
    //.style('border', '2px red solid')
    //.style('background', 'black')
    //.style('border-radius', '10px')
	//.append('video')
	//.attr('autoplay', 'autoplay')
	//.attr('loop', 'loop')
	//.attr('muted', 'muted')
	//.attr('playsinline', 'muted')
	//.attr('width', '50%')
	//.style('transform', 'translate(50%, 10%)')
	//.append('source')
	//.attr('src', 'https://dmklee.github.io/nuro-arm/images/media.mp4')
	//.attr('type', 'video/mp4')


///////////////////////////////////////////////
// projects
///////////////////////////////////////////////
function add_project(proj) {
	if (proj['title'].length == 0) {
		return;
	}
	var div = main.append('div')
				  .style('width', '95%')
				  .style('display', 'flex')
				  .style('flex-wrap', 'wrap')
			 	  .style('flex-direction', 'row')
				  .style('justify-content', 'flex-start')
				  .style('align-items', 'center')
				  .style('margin', '20px 10px 20px 10px')

	var media = div.append('div')
					.append('img')
					.attr('src', proj['media'])
					.style('overflow', 'hidden')
					.style('object-fit', 'scale-down')
					.style('width', '200px')
					.style('margin-right', '20px')

	var ref = div.append('div')
		.style('margin', 'auto 0')
		.style('max-width', '700px')
	ref.append('text')
		.style('font-weight', 'bold')
		.text(proj['title'])
	ref.append('br')
	ref.append('text')
		.text(proj['desc'])

	var buttons_row = ref.append('div')
						  .style('width', '100%')
						  .style('display', 'flex')
						  .style('flex-direction', 'row')
						  .style('justify-content', 'flex-start')

	function add_button(button) {
		var text = button[0];
		var target = button[1];
		if (target.length == 0) return;

		buttons_row.append('a')
				   .on('mouseover', function() {
					   d3.select(this).style('background-color', 'blue');
					   d3.select(this).style('color', 'white');
					   d3.select(this).style('font-weight', 'bold');
				   })
				   .on('mouseout', function() {
					   d3.select(this).style('background-color', 'white');
					   d3.select(this).style('color', 'blue');
					   d3.select(this).style('font-weight', 'normal');
				   })
				   .style('text-decoration', 'none')
				   .style('color', 'blue')
				   .style('font-size', '1.0rem')
				   .style('border', 'blue 1px solid')
				   .style('padding', '2px 4px')
				   .style('margin', '6px 5px')
				   .style('border-radius', '5px')
				   .attr('href', target)
				   .text(text)
	}
	Object.entries(proj['buttons']).map(add_button);
}
make_header('Projects');
projects.map(add_project);

///////////////////////////////////////////////
// make visualizations
///////////////////////////////////////////////
var visualizations = [
	{name: 'Three Body Problem', constructor: ThreeBodyVisualization, obj: null},
	{name: 'Infinite Corridor', constructor: CorridorVisualization, obj: null},
	//{name: 'Flock', constructor: FlockVisualization, obj: null},
	//{name: 'Erosion', constructor: ErosionVisualization, obj: null},
];
if (visualizations.length > 0) {
	make_header('Visualizations');
	var vis_div = main.append('div')
					  .style('width', '100%')
					  .style('display', 'flex')
					  .style('flex-wrap', 'wrap')
					  .style('flex-direction', 'row')
					  .style('justify-content', 'space-around')
					  .style('margin', '20px')


	for (let i=0; i<visualizations.length; i++) {
		let div = vis_div.append('div')
		   .style('margin', '20px')
		   .style('height', '400px')
		   .style('width', '400px')
		   .style('border', '2px black solid')
		   .style('border-radius', '20px')
		   .style('overflow', 'hidden')
		visualizations[i].obj = new visualizations[i].constructor(div);
		div.on('mouseover', function(d) {
			   d3.select(this).selectAll('text').transition().duration(500).style('opacity', 0);
			   d3.select(this).transition().duration(1000).style('cursor', 'none');
			   visualizations[i].obj.running = true;
		   })
		   .on('mouseout', function(d) {
			   d3.select(this).selectAll('text').transition().duration(500).style('opacity', 1);
			   visualizations[i].obj.running = false;
		   })
		   .on('dblclick', function(event, d) {
			   event.preventDefault();
			   visualizations[i].obj.reset();
		   })
	}
	function update_visualizations() {
		visualizations.forEach(d=>d.obj.step());
	}
	d3.interval(update_visualizations, 30);
}


///////////////////////////////////////////////
// make footer
///////////////////////////////////////////////
var footer = d3.select("#footer")
	.style('width', '100%')
	.style('display', 'flex')
	.style('margin', '0')
	.style('margin-top', '40px')
	.style('border-top', '4px solid black')
	.append('p')
	.text('© 2022 by David Klee. Made with D3.js.')
	.style('font-size', '1rem')
	.style('font-style', 'italic')
	.style('margin', '10px auto')


//function resize() {
	////https://stackoverflow.com/questions/29617177/change-image-with-page-width-resize
//}
//resize();
//$(window).on('resize', resize);
