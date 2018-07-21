import THREE from 'three';
import { Side } from '../constants';
import Utils from '../utils/Utils';
import ShaderChunk from '../webgl/ShaderChunk';
import Cloth from './Cloth';
import FixedConstraint from './FixedConstraint';

// Default flag texture
var WHITE_TEXTURE = THREE.ImageUtils
    .generateDataTexture(1, 1, new THREE.Color(0xffffff));

/**
 * @class Flag
 *
 * @classdesc Initializes a cloth object to simulate the motion of a flag
 * and applies the cloth geometry to a mesh.
 *
 * @param {Object} [options]
 *   @param {number} [options.width]
 *   @param {number} [options.height]
 *   @param {number} [options.mass]
 *   @param {number} [options.granularity]
 *   @param {THREE.Texture} [options.texture]
 *   @param {Object} [options.pin]
 */
var Flag = (function () {
    function buildCloth(options) {
        var restDistance = options.height / options.granularity;

        return new Cloth(
            Math.round(options.width / restDistance),
            Math.round(options.height / restDistance),
            restDistance,
            options.mass
        );
    }

    function buildMesh(cloth, options) {
        var texture = WHITE_TEXTURE;
        var geometry = cloth.geometry;
        var material;
        var mesh;

        // Material
        material = new THREE.MeshPhongMaterial({
            alphaTest: 0.5,
            color:     0xffffff,
            specular:  0x030303,
            /*
             * shininess cannot be 0 as it causes bugs in some systems.
             * https://github.com/mrdoob/three.js/issues/7252
             */
            shininess: 0.001,
            metal:     false,
            side:      THREE.DoubleSide
        });

        /* //
        material = new THREE.MeshBasicMaterial({
            color:       0x00ff00,
            wireframe:   true,
            transparent: true,
            opacity:     0.9
        });
        // */

        // Texture
        if (options && options.texture) {
            if (options.texture instanceof THREE.Texture) {
                texture = options.texture;
                texture.needsUpdate = true;
                texture.anisotropy  = 16;
                texture.minFilter   = THREE.LinearFilter;
                texture.magFilter   = THREE.LinearFilter;
                texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
            } else {
                console.error(
                    'FlagWaver.Flag: options.texture must be an instance of THREE.Texture.'
                );
            }
        }

        material.map = texture;

        // Mesh
        mesh = new THREE.Mesh(geometry, material);

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.customDepthMaterial = new THREE.ShaderMaterial({
            uniforms:       { texture: { type: 't', value: texture } },
            vertexShader:   ShaderChunk.depth_vert,
            fragmentShader: ShaderChunk.depth_frag
        });

        return mesh;
    }

    function Flag(options) {
        var settings = Object.assign({}, Flag.defaults, options);

        this.cloth = buildCloth(settings);
        this.pins = [];
        this.lengthConstraints = [];

        this.mesh = buildMesh(this.cloth, settings);
        this.mesh.position.set(0, -this.cloth.height, 0);

        this.object = new THREE.Object3D();
        this.object.add(this.mesh);

        this.pin(settings.pin);
    }

    return Flag;
})();

Object.assign(Flag, {
    defaults: {
        width:          300,
        height:         200,
        mass:           0.1,
        granularity:    10,
        rigidness:      1,
        texture:        WHITE_TEXTURE,
        pin:            {
            edges: [Side.LEFT]
        }
    }
});

Object.assign(Flag.prototype, {
    destroy: function () {
        if (this.mesh instanceof THREE.Mesh) {
            this.mesh.material.dispose();
            this.mesh.geometry.dispose();
            this.mesh.material.map.dispose();
            this.mesh.customDepthMaterial.dispose();
        }
    },

    pin: (function () {
        var defaults = {
            edges: [],
            spacing: 1
        };

        function ensureValidSpacing(spacing) {
            if (Utils.isNumeric(spacing) && spacing >= 1) {
                return Math.floor(spacing);
            } else {
                return defaults.spacing;
            }
        }

        function pinEdge(cloth, pins, edge, options) {
            var xSegments  = cloth.xSegments;
            var ySegments  = cloth.ySegments;
            var particleAt = cloth.particleAt;
            var spacing    = options.spacing;
            var i;

            switch (edge) {
                case Side.TOP:
                    for (i = 0; i <= xSegments; i += spacing) {
                        pins.push(particleAt(i, ySegments));
                    }

                    break;

                case Side.LEFT:
                    for (i = 0; i <= ySegments; i += spacing) {
                        pins.push(particleAt(0, i));
                    }

                    break;

                case Side.BOTTOM:
                    for (i = 0; i <= xSegments; i += spacing) {
                        pins.push(particleAt(i, 0));
                    }

                    break;

                case Side.RIGHT:
                    for (i = 0; i <= ySegments; i += spacing) {
                        pins.push(particleAt(xSegments, i));
                    }

                    break;

                default:
                    break;
            }
        }

        return function pin(options) {
            var settings = Object.assign({}, defaults, options);

            var cloth = this.cloth;
            var pins = this.pins;

            var edges = settings.edges;
            var i, il;

            settings.spacing = ensureValidSpacing(settings.spacing);

            if (typeof edges === 'string') {
                // If edges is a string
                pinEdge(cloth, pins, edges, settings);
            } else if (edges && edges.length) {
                // If edges is an array
                for (i = 0, il = edges.length; i < il; i++) {
                    pinEdge(cloth, pins, edges[i], settings);
                }
            }
        };
    })(),

    unpin: function () {
        this.pins = [];
    },

    // Add additional constraints to cloth to mitigate stretching
    setLengthConstraints: function (hoistwardSide) {
        var xSegments         = this.cloth.xSegments;
        var ySegments         = this.cloth.ySegments;
        var restDistance      = this.cloth.restDistance;
        var particleAt        = this.cloth.particleAt;
        var lengthConstraints = [];
        var u, v;

        /*
         * Order is important, constraints closest to the hoist must be
         * resolved first.
         */

        if (hoistwardSide === Side.LEFT) {
            // Add horizontal constraints that run from hoist to fly
            for (v = 0; v <= ySegments; v++) {
                for (u = 0; u < xSegments; u++) {
                    lengthConstraints.push(new FixedConstraint(
                        particleAt(u, v),
                        particleAt(u + 1, v),
                        restDistance
                    ));
                }
            }
        } else if (hoistwardSide === Side.TOP) {
            // Add vertical constraints that run from top to bottom
            for (u = 0; u <= xSegments; u++) {
                for (v = ySegments; v > 0; v--) {
                    lengthConstraints.push(new FixedConstraint(
                        particleAt(u, v),
                        particleAt(u, v - 1),
                        restDistance
                    ));
                }
            }
        }

        this.lengthConstraints = lengthConstraints;
    },

    reset: function () {
        this.cloth.reset();
    },

    simulate: function (deltaTime) {
        var pins              = this.pins;
        var lengthConstraints = this.lengthConstraints;
        var particle;
        var i, il;

        this.cloth.simulate(deltaTime);

        // Pin constraints
        for (i = 0, il = pins.length; i < il; i++) {
            particle = pins[i];

            particle.previous.copy(
                particle.position.copy(
                    particle.original
                )
            );
        }

        // Length constraints
        for (i = 0, il = lengthConstraints.length; i < il; i++) {
            lengthConstraints[i].resolve();
        }
    },

    render: function () {
        this.cloth.render();
    }
});

export default Flag;
