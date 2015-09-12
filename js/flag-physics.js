/*
 * Aug 9 2012
 * Its Singapore's National Day, so
 * Making a quick tweaks to simulate the Singapore flag in the wind
 *
 */
/*
 * Aug 3 2012
 *
 * Since I started working for a new startup not too long ago,
 * I commute between home and work for over 2 hours a day.
 * Although this means less time on three.js,
 * I try getting a little coding on the train.
 *
 * This set of experiments started from a simple hook's law doodle,
 * to spring simulation, string simulation, and I realized
 * I once again stepped onto physics and particle simulation,
 * this time, more specifically soft body physics.
 *
 * Based on the "Advanced Character Physics" article,
 * this experiment attempts to use a "massless"
 * cloth simulation model. It's somewhat similiar
 * but simplier to most cloth simulations I found.
 *
 * This was coded out fairly quickly, so expect more to come
 * meanwhile feel free to experiment yourself and share
 *
 * Cheers,
 * Graphics Noob (aka @Blurspline, zz85)
 */

// Suggested Readings

// Advanced Character Physics by Thomas Jakobsen Character - http://web.archive.org/web/20070610223835/http:/www.teknikus.dk/tj/gdc2001.htm
// http://freespace.virgin.net/hugo.elias/models/m_cloth.htm
// http://en.wikipedia.org/wiki/Cloth_modeling
// http://cg.alexandra.dk/tag/spring-mass-system/
// Real-time Cloth Animation http://www.darwin3d.com/gamedev/articles/col0599.pdf

var DAMPING = 0.03;
var DRAG = 1 - DAMPING;
var MASS = .1;
var restDistance = 20;


var xSegs = 15; // ratio is 2:3
var ySegs = 10; //

var clothFunction = plane(restDistance * xSegs, restDistance * ySegs);

var cloth = new Cloth(xSegs, ySegs);

var GRAVITY = 981 * 1.4; //
var gravity = new THREE.Vector3( 0, -GRAVITY, 0 ).multiplyScalar(MASS);


var TIMESTEP = 18 / 1000;
var TIMESTEP_SQ = TIMESTEP * TIMESTEP;

var pins = [];


var wind = true;
var windStrength = 300;
var windForce = new THREE.Vector3(0,0,0);

var ballPosition = new THREE.Vector3(0, -45, 0);
var ballSize = 60; //40

var tmpForce = new THREE.Vector3();

var lastTime;




function plane(width, height) {

	return function(u, v) {
		var x = u * width; //(u-0.5)
		var y = v * height;
		var z = 0;

		return new THREE.Vector3(x, y, z);
	};
}

function Particle(x, y, z, mass) {
	this.position = clothFunction(x, y); // position
	this.previous = clothFunction(x, y); // previous
	this.original = clothFunction(x, y);
	this.a = new THREE.Vector3(0, 0, 0); // acceleration
	this.mass = mass;
	this.invMass = 1 / mass;
	this.tmp = new THREE.Vector3();
	this.tmp2 = new THREE.Vector3();
}

// Force -> Acceleration
Particle.prototype.addForce = function(force) {
	this.a.addSelf(
		this.tmp2.copy(force).multiplyScalar(this.invMass)
	);
};


// Performs verlet integration
Particle.prototype.integrate = function(timesq) {
	var newPos = this.tmp.sub(this.position, this.previous);
	newPos.multiplyScalar(DRAG).addSelf(this.position);
	newPos.addSelf(this.a.multiplyScalar(timesq));

	this.tmp = this.previous;
	this.previous = this.position;
	this.position = newPos;

	this.a.set(0, 0, 0);
}


var diff = new THREE.Vector3();

function satisifyConstrains(p1, p2, distance) {
	diff.sub(p2.position, p1.position);
	var currentDist = diff.length();
	if (currentDist==0) return; // prevents division by 0
	var correction = diff.multiplyScalar(1 - distance/currentDist);
	var correctionHalf = correction.multiplyScalar(0.5);
	p1.position.addSelf(correctionHalf);
	p2.position.subSelf(correctionHalf);

	// float difference = (restingDistance - d) / d
	// im1 = 1 / p1.mass // inverse mass quantities
	// im2 = 1 / p2.mass
	// p1.position += delta * (im1 / (im1 + im2)) * stiffness * difference

}


function Cloth(w, h) {
	w = w || 10;
	h = h || 10;
	this.w = w;
	this.h = h;

	var particles = [];
	var constrains = [];

	var u, v;

	// Create particles
	for (v=0;v<=h;v++) {
		for (u=0;u<=w;u++) {
			particles.push(
				new Particle(u/w, v/h, 0, MASS)
			);
		}
	}

	// Structural

	for (v=0;v<h;v++) {
		for (u=0;u<w;u++) {

			constrains.push([
				particles[index(u, v)],
				particles[index(u, v+1)],
				restDistance
			]);

			constrains.push([
				particles[index(u, v)],
				particles[index(u+1, v)],
				restDistance
			]);

		}
	}

	for (u=w, v=0;v<h;v++) {
		constrains.push([
			particles[index(u, v)],
			particles[index(u, v+1)],
			restDistance

		]);
	}

	for (v=h, u=0;u<w;u++) {
		constrains.push([
			particles[index(u, v)],
			particles[index(u+1, v)],
			restDistance
		]);
	}


	// While many system uses shear and bend springs,
	// the relax constrains model seem to be just fine
	// using structural springs.
	// Shear
	var diagonalDist = Math.sqrt(restDistance * restDistance * 2);


	for (v=0;v<h;v++) {
		for (u=0;u<w;u++) {

			constrains.push([
				particles[index(u, v)],
				particles[index(u+1, v+1)],
				diagonalDist
			]);

			constrains.push([
				particles[index(u+1, v)],
				particles[index(u, v+1)],
				diagonalDist
			]);

		}
	}


	// // Bend

	// var wlen = restDistance * 2;
	// var hlen = restDistance * 2;
	// diagonalDist = Math.sqrt(wlen * wlen + hlen * hlen);

	// for (v=0;v<h-1;v++) {
	// 	for (u=0;u<w-1;u++) {
	// 		constrains.push([
	// 			particles[index(u, v)],
	// 			particles[index(u+2, v)],
	// 			wlen
	// 		]);

	// 		constrains.push([
	// 			particles[index(u, v)],
	// 			particles[index(u, v+2)],
	// 			hlen
	// 		]);

	// 		constrains.push([
	// 			particles[index(u, v)],
	// 			particles[index(u+2, v+2)],
	// 			diagonalDist
	// 		]);

	// 		constrains.push([
	// 			particles[index(u, v+2)],
	// 			particles[index(u+2, v+2)],
	// 			wlen
	// 		]);

	// 		constrains.push([
	// 			particles[index(u+2, v+2)],
	// 			particles[index(u+2, v+2)],
	// 			hlen
	// 		]);

	// 		constrains.push([
	// 			particles[index(u+2, v)],
	// 			particles[index(u, v+2)],
	// 			diagonalDist
	// 		]);

	// 	}
	// }


	this.particles = particles;
	this.constrains = constrains;

	function index(u, v) {
		return u + v * (w + 1);
	}

	this.index = index;

}

function simulate(time) {
	if (!lastTime) {
		lastTime = time;
		return;
	}

	// TIMESTEP = (time - lastTime);
	// TIMESTEP = (TIMESTEP > 30) ? TIMESTEP / 1000 : 30 / 1000;
	// TIMESTEP_SQ = TIMESTEP * TIMESTEP;
	// lastTime = time;
	// console.log(TIMESTEP);

	var i, il, particles, particle, pt, constrains, constrain;

	// Aerodynamics forces
	if (wind) {
		var face, faces = clothGeometry.faces, normal;

		particles = cloth.particles;

		for (i=0,il=faces.length;i<il;i++) {
			face = faces[i];
			normal = face.normal;

			tmpForce.copy(normal).normalize().multiplyScalar(normal.dot(windForce));
			particles[face.a].addForce(tmpForce);
			particles[face.b].addForce(tmpForce);
			particles[face.c].addForce(tmpForce);
		}
	}

	for (particles = cloth.particles, i=0, il = particles.length
			;i<il;i++) {
		particle = particles[i];
		particle.addForce(gravity);
		//
		// var x = particle.position.x, y = particle.position.y, z = particle.position.z, t=Date.now() / 1000;
		// windForce.set(Math.sin(x*y*t), Math.cos(z*t), Math.sin(Math.cos(5*x*y*z))).multiplyScalar(100);
		// particle.addForce(windForce);
		particle.integrate(TIMESTEP_SQ);
	}

	// Start Constrains

	constrains = cloth.constrains,
	il = constrains.length;
	for (i=0;i<il;i++) {
		constrain = constrains[i];
		satisifyConstrains(constrain[0], constrain[1], constrain[2]);
	}

	// Ball Constrains


	ballPosition.z = -Math.sin(Date.now()/300) * 90 ; //+ 40;
	ballPosition.x = Math.cos(Date.now()/200) * 70

	// if (sphere.visible)
	// for (particles = cloth.particles, i=0, il = particles.length
	// 		;i<il;i++) {
	// 	particle = particles[i];
	// 	pos = particle.position;
	// 	diff.sub(pos, ballPosition);
	// 	if (diff.length() < ballSize) {
	// 		// collided
	// 		diff.normalize().multiplyScalar(ballSize);
	// 		pos.copy(ballPosition).addSelf(diff);
	// 	}
	// }
	//
	// // Pin Constrains

	for (i=0, il=pins.length;i<il;i++) {
		var xy = pins[i];
		var p = particles[xy];
		p.position.copy(p.original);
		p.previous.copy(p.original);
	}


}
