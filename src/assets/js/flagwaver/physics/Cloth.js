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
export default class Cloth {
    constructor(xSegments, ySegments, restDistance, mass) {
        // Cloth properties
        const width = restDistance * xSegments;
        const height = restDistance * ySegments;

        const particles = [];
        const constraints = [];

        // Get particle at position (u, v)
        const particleAt = (u, v) => particles[u + v * (xSegments + 1)];

        // Cloth plane function
        const plane = (u, v, target) => {
            target.set(u * width, v * height, 0);
        };

        //
        // Particles
        //

        const position = new THREE.Vector3();
        const particleMass = mass / ((ySegments + 1) * (xSegments + 1));

        for (let v = 0; v <= ySegments; v++) {
            for (let u = 0; u <= xSegments; u++) {
                plane(u / xSegments, v / ySegments, position);

                particles.push(new Particle(position, particleMass));
            }
        }

        //
        // Constraints
        //

        // Structural constraints

        for (let v = 0; v < ySegments; v++) {
            for (let u = 0; u < xSegments; u++) {
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

        for (let u = xSegments, v = 0; v < ySegments; v++) {
            constraints.push(new Constraint(
                particleAt(u, v),
                particleAt(u, v + 1),
                restDistance
            ));
        }

        for (let v = ySegments, u = 0; u < xSegments; u++) {
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

        const diagonalDistance = Math.sqrt(restDistance * restDistance * 2);

        for (let v = 0; v < ySegments; v++) {
            for (let u = 0; u < xSegments; u++) {
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
        const x2Distance = restDistance * 2;
        const y2Distance = restDistance * 2;

        const diagonalDistance2 = Math.sqrt(
            x2Distance * x2Distance +
            y2Distance * y2Distance
        );

        for (let v = 0; v < ySegments - 1; v++) {
            for (let u = 0; u < xSegments - 1; u++) {
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
                    diagonalDistance2
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
                    diagonalDistance2
                ));
            }
        }
        // */

        //
        // Geometry
        //

        const geometry = new THREE.ParametricGeometry(
            plane,
            xSegments,
            ySegments,
            true
        );

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

    reset() {
        const particles = this.particles;

        for (let i = 0, ii = particles.length; i < ii; i++) {
            const particle = particles[i];

            particle.previous.copy(
                particle.position.copy(
                    particle.original
                )
            );
        }
    }

    simulate(deltaTime) {
        const particles   = this.particles;
        const constraints = this.constraints;
        const deltaTimeSq = deltaTime * deltaTime;

        // Compute new particle positions
        for (let i = 0, ii = particles.length; i < ii; i++) {
            particles[i].integrate(deltaTimeSq);
        }

        // Resolve constraints
        for (let i = 0, ii = constraints.length; i < ii; i++) {
            constraints[i].resolve();
        }
    }

    render() {
        const particles = this.particles;
        const geometry  = this.geometry;
        const vertices  = geometry.vertices;

        for (let i = 0, ii = particles.length; i < ii; i++) {
            vertices[i].copy(particles[i].position);
        }

        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        geometry.normalsNeedUpdate = true;
        geometry.verticesNeedUpdate = true;
    }
}
