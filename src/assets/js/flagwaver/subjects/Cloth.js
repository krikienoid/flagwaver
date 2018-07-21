import THREE from 'three';
import Particle from './Particle';
import Constraint from './Constraint';

/**
 * @class Cloth
 *
 * @classdesc Simulates the physics of a rectangular cloth using
 * a mass-spring system.
 *
 * @param {number} xSegments - Number of nodes along the x-axis
 * @param {number} ySegments - Number of nodes along the y-axis
 * @param {number} restDistance - Rest distance between adjacent nodes
 * @param {number} mass - Mass of the cloth material
 */
function Cloth(xSegments, ySegments, restDistance, mass) {
    // Cloth properties
    var width = restDistance * xSegments;
    var height = restDistance * ySegments;

    var particles;
    var constraints;

    var particleAt;
    var plane;
    var geometry;

    var diagonalDistance;
    var u, v;

    // Get particle at position (u, v)
    particleAt = function (u, v) {
        return particles[u + v * (xSegments + 1)];
    };

    // Cloth plane function
    plane = function (u, v) {
        return new THREE.Vector3(u * width, v * height, 0);
    };

    //
    // Particles
    //

    particles = [];

    for (v = 0; v <= ySegments; v++) {
        for (u = 0; u <= xSegments; u++) {
            particles.push(new Particle(
                plane(u / xSegments, v / ySegments),
                mass
            ));
        }
    }

    //
    // Constraints
    //

    constraints = [];

    // Structural constraints

    for (v = 0; v < ySegments; v++) {
        for (u = 0; u < xSegments; u++) {
            constraints.push(new Constraint(
                particleAt(u, v),
                particleAt(u, v + 1),
                restDistance
            ));

            constraints.push(new Constraint(
                particleAt(u, v),
                particleAt(u + 1, v),
                restDistance
            ));
        }
    }

    for (u = xSegments, v = 0; v < ySegments; v++) {
        constraints.push(new Constraint(
            particleAt(u, v),
            particleAt(u, v + 1),
            restDistance
        ));
    }

    for (v = ySegments, u = 0; u < xSegments; u++) {
        constraints.push(new Constraint(
            particleAt(u, v),
            particleAt(u + 1, v),
            restDistance
        ));
    }

    /*
     * While many systems use shear and bend springs, the
     * relax constraints model seems to be just fine using
     * structural springs.
     */

    // Shear constraints

    diagonalDistance = Math.sqrt(restDistance * restDistance * 2);

    for (v = 0; v < ySegments; v++) {
        for (u = 0; u < xSegments; u++) {
            constraints.push(new Constraint(
                particleAt(u, v),
                particleAt(u + 1, v + 1),
                diagonalDistance
            ));

            constraints.push(new Constraint(
                particleAt(u + 1, v),
                particleAt(u, v + 1),
                diagonalDistance
            ));
        }
    }

    // Bend constraints

    /* //
    var x2Distance = restDistance * 2;
    var y2Distance = restDistance * 2;

    diagonalDistance = Math.sqrt(
        x2Distance * x2Distance +
        y2Distance * y2Distance
    );

    for (v = 0; v < ySegments - 1; v++) {
        for (u = 0; u < xSegments - 1; u++) {
            constraints.push(new Constraint(
                particleAt(u, v),
                particleAt(u + 2, v),
                x2Distance
            ));

            constraints.push(new Constraint(
                particleAt(u, v),
                particleAt(u, v + 2),
                y2Distance
            ));

            constraints.push(new Constraint(
                particleAt(u, v),
                particleAt(u + 2, v + 2),
                diagonalDistance
            ));

            constraints.push(new Constraint(
                particleAt(u, v + 2),
                particleAt(u + 2, v + 2),
                x2Distance
            ));

            constraints.push(new Constraint(
                particleAt(u + 2, v + 2),
                particleAt(u + 2, v + 2),
                y2Distance
            ));

            constraints.push(new Constraint(
                particleAt(u + 2,  v),
                particleAt(u , v + 2),
                diagonalDistance
            ));
        }
    }
    // */

    //
    // Geometry
    //

    geometry = new THREE.ParametricGeometry(plane, xSegments, ySegments, true);
    geometry.dynamic = true;
    geometry.computeFaceNormals();

    // Public properties and methods
    this.xSegments    = xSegments;
    this.ySegments    = ySegments;
    this.restDistance = restDistance;
    this.width        = width;
    this.height       = height;
    this.particles    = particles;
    this.constraints  = constraints;
    this.particleAt   = particleAt;
    this.geometry     = geometry;
}

Object.assign(Cloth.prototype, {
    reset: function () {
        var particles = this.particles;
        var particle;
        var i, il;

        for (i = 0, il = particles.length; i < il; i++) {
            particle = particles[i];

            particle.previous.copy(
                particle.position.copy(
                    particle.original
                )
            );
        }
    },

    simulate: function (deltaTime) {
        var particles   = this.particles;
        var constraints = this.constraints;
        var deltaTimeSq = deltaTime * deltaTime;
        var i, il;

        // Compute new particle positions
        for (i = 0, il = particles.length; i < il; i++) {
            particles[i].integrate(deltaTimeSq);
        }

        // Resolve constraints
        for (i = 0, il = constraints.length; i < il; i++) {
            constraints[i].resolve();
        }
    },

    render: function () {
        var particles = this.particles;
        var geometry  = this.geometry;
        var vertices  = geometry.vertices;
        var i, il;

        for (i = 0, il = particles.length; i < il; i++) {
            vertices[i].copy(particles[i].position);
        }

        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        geometry.normalsNeedUpdate = true;
        geometry.verticesNeedUpdate = true;
    }
});

export default Cloth;
