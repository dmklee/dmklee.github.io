const publications = [
	{'title' : "I2I: Image to Icosahedral Projection for SO(3) Object Reasoning from Single-View Images",
	 'authors' : 'David M. Klee, Ondrej Biza, Robert Platt, Robin Walters',
	 'destination' : 'Preprint',
	 'media' : '',
	 'buttons' : {
		 'PDF' : 'https://arxiv.org/abs/2207.08925',
	 }
	},
	{'title' : 'Graph Structured Policy Learning for Multi-Goal Manipulation Tasks',
	 'authors' : 'David M. Klee, Ondrej Biza, Robert Platt',
	 'destination' : 'IROS 2022, Kyoto, Japan',
	 'media' : '',
	 'buttons' : {
		 'Webpage' : '',
		 'PDF' : '',
		 'Video' : '',
		 'Talk' : '',
		 'Code' : '',
	 }
	},
	{'title' : "Understanding the Mechanism behind Data Augmentation's Success on Image Based RL",
	 'authors' : 'David M. Klee, Robin Walters, Robert Platt',
	 'destination' : 'RLDM 2022, Providence, RI, USA',
	 'media' : '',
	 'buttons' : {
		 'PDF' : './assets/publications/data_aug/paper.pdf',
		 'Poster' : './assets/publications/data_aug/poster.pdf',
	 }
	},
	{'title' : "A compact, portable, re-configurable, and automated system for on-demand pharmaceutical tablet manufacturing",
	 'authors' : 'Mohammad Azad, Juan Osorio, David Brancazio, Gregory Hammersmith, David M. Klee, Kersten Rapp, Allan Myerson',
	 'destination' : 'International Journal of Pharmaceutics 539 (1-2), 157-164',
	 'media' : '',
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
	 'role' : 'Instructor',
	 'location' : 'Northeastern University',
	 'date' : 'Spring 2022',
	 'buttons' : {
	 },
	},
	{'course' : 'CS5100: Foundations of Artificial Intelligence',
	 'role' : 'Teaching Assistant',
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

const page_max_width = "800px";
const name = "David M. Klee";

d3.select("body")
	.style("max-width", "800px")
	.style("margin", "0 auto")
	.style("font-family", "Times New Roman")
	.style("font-size", "1.2rem")

var header = d3.select("#header")
	.style('width', '100%')
	.style('border-bottom', '4px solid black')
	.append('p')
	.text(name)
	.style('font-size', '2.3rem')
	.style('padding', '15px 0 5px 20px')
	.style('margin', '0')

var main = d3.select('#main')

var intro_div = main.append('div')
					.style('width', '100%')
					.style('margin-top', '15px')
					.style('display', 'flex')
					.style('flex-wrap', 'wrap')
					.style('flex-direction', 'row')
					.style('justify-content', 'flex-start')
					.style('padding', '15px')

// avatar
intro_div.append('div')
		 .style('width', '30%')
		 .style('margin', 'auto 20px')
		 .style('min-width', '100px')
		 .style('max-width', '200px')
		 .append('img')
		 .attr('id', 'avatar')
		 .attr('src', 'assets/images/avatar.png')
		 .style('border-radius', '50%')
		 .style('width', '100%')

// introduction
text_intro = intro_div.append('div')
		      .style('margin', 'auto 10px')
		      .style('min-width', '300px')
		      .style('max-width', '700px')
		      .style('width', '65%')
		      .style('text-align', 'justify')
			
text_intro.append('span')
		 .text('I am a PhD student at Northeastern University.  I am a member of the ')
text_intro.append('a').attr('href', 'https://www2.ccs.neu.edu/research/helpinghands/group.html')
		 .text('Helping Hands Lab')
text_intro.append('span')
		 .text(', advised by ')
text_intro.append('a').attr('href', 'https://www.khoury.northeastern.edu/people/robert-platt/')
		 .text('Robert Platt')
text_intro.append('span')
		 .text('.  I am studying how to learn object representations for robotic manipulation tasks.  I am also interested in robotics education and low-cost robotic manipulators.')

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
				  .style('margin', '15px auto')
				  .style('display', 'flex')
				  .style('flex-wrap', 'wrap')
			 	  .style('flex-direction', 'row')
				  .style('justify-content', 'flex-start')

	var media = div.append('div')

	var ref = div.append('div')
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
				   .style('text-decoration', 'none')
				   .style('color', 'blue')
				   .style('font-size', '1.0rem')
				   .style('border', 'blue 1px solid')
				   .style('padding', '2px 4px')
				   .style('margin', '6px 5px')
				   .style('border-radius', '5px')
				   .attr('href', target)
				   .text(text)
		console.log(text)
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
	ref.append('text')
		.text(exp['course'] + ' (' + exp['date'] + ')')
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

// make footer
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
