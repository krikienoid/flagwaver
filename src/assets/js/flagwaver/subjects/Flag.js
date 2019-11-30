import THREE from 'three';

import { Side } from '../constants';
import { generateDataTexture } from '../utils/ImageUtils';
import { isNumeric } from '../utils/TypeUtils';
import ShaderChunk from '../webgl/ShaderChunk';
import Cloth from '../physics/Cloth';
import FixedConstraint from '../physics/FixedConstraint';

// Default flag texture
const WHITE_TEXTURE = generateDataTexture(1, 1, new THREE.Color(0xffffff));

function buildCloth(options) {
    const { width, height, mass, granularity } = options;
    const restDistance = height / granularity;

    return new Cloth(
        Math.round(width / restDistance),
        Math.round(height / restDistance),
        restDistance,
        mass * width * height
    );
}

function buildMesh(cloth, options) {
    let texture = WHITE_TEXTURE;
    const geometry = cloth.geometry;

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

    // Material
    const material = new THREE.MeshPhongMaterial({
        alphaTest: 0.5,
        color:     0xffffff,
        specular:  0x030303,
        /*
         * shininess cannot be 0 as it causes bugs in some systems.
         * https://github.com/mrdoob/three.js/issues/7252
         */
        shininess: 0.001,
        side:      THREE.DoubleSide,
        map:       texture
    });

    /* //
    material = new THREE.MeshBasicMaterial({
        color:       0x00ff00,
        wireframe:   true,
        transparent: true,
        opacity:     0.9
    });
    // */

    // Mesh
    const mesh = new THREE.Mesh(geometry, material);

    mesh.castShadow = true;
    mesh.customDepthMaterial = new THREE.ShaderMaterial({
        uniforms:       { texture: { value: texture } },
        vertexShader:   ShaderChunk.depth_vert,
        fragmentShader: ShaderChunk.depth_frag
    });

    return mesh;
}

const pin = (() => {
    const defaults = {
        edges: [],
        spacing: 1
    };

    function ensureValidSpacing(spacing) {
        if (isNumeric(spacing) && spacing >= 1) {
            return Math.floor(spacing);
        } else {
            return defaults.spacing;
        }
    }

    function pinEdge(cloth, pins, edge, options) {
        const { xSegments, ySegments, particleAt } = cloth;
        const { spacing } = options;

        switch (edge) {
            case Side.TOP:
                for (let i = 0; i <= xSegments; i += spacing) {
                    pins.push(particleAt(i, ySegments));
                }

                break;

            case Side.LEFT:
                for (let i = 0; i <= ySegments; i += spacing) {
                    pins.push(particleAt(0, i));
                }

                break;

            case Side.BOTTOM:
                for (let i = 0; i <= xSegments; i += spacing) {
                    pins.push(particleAt(i, 0));
                }

                break;

            case Side.RIGHT:
                for (let i = 0; i <= ySegments; i += spacing) {
                    pins.push(particleAt(xSegments, i));
                }

                break;

            default:
                break;
        }
    }

    return function pin(cloth, pins, options) {
        const settings = Object.assign({}, defaults, options);
        const { edges } = settings;

        settings.spacing = ensureValidSpacing(settings.spacing);

        if (typeof edges === 'string') {
            // If edges is a string
            pinEdge(cloth, pins, edges, settings);
        } else if (edges && edges.length) {
            // If edges is an array
            for (let i = 0, ii = edges.length; i < ii; i++) {
                pinEdge(cloth, pins, edges[i], settings);
            }
        }
    };
})();

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
export default class Flag {
    constructor(options) {
        const settings = Object.assign({}, Flag.defaults, options);

        this.cloth = buildCloth(settings);
        this.pins = [];
        this.lengthConstraints = [];

        this.mesh = buildMesh(this.cloth, settings);
        this.mesh.position.set(0, -this.cloth.height, 0);

        this.object = new THREE.Object3D();
        this.object.add(this.mesh);

        this.pin(settings.pin);
    }

    static defaults = {
        width:          1.8,
        height:         1.2,
        mass:           0.11, // 110 g/m^s
        granularity:    10,
        rigidness:      1,
        texture:        WHITE_TEXTURE,
        pin:            {
            edges: [Side.LEFT]
        }
    };

    destroy() {
        if (this.mesh instanceof THREE.Mesh) {
            this.mesh.material.dispose();
            this.mesh.geometry.dispose();
            this.mesh.material.map.dispose();
            this.mesh.customDepthMaterial.dispose();
        }
    }

    pin(options) {
        pin(this.cloth, this.pins, options);
    }

    unpin() {
        this.pins = [];
    }

    // Add additional constraints to cloth to mitigate stretching
    setLengthConstraints(hoistwardSide) {
        const { xSegments, ySegments, restDistance, particleAt } = this.cloth;
        const lengthConstraints = [];

        /*
         * Order is important, constraints closest to the hoist must be
         * resolved first.
         */

        if (hoistwardSide === Side.LEFT) {
            // Add horizontal constraints that run from hoist to fly
            for (let v = 0; v <= ySegments; v++) {
                for (let u = 0; u < xSegments; u++) {
                    lengthConstraints.push(new FixedConstraint(
                        particleAt(u, v),
                        particleAt(u + 1, v),
                        restDistance
                    ));
                }
            }
        } else if (hoistwardSide === Side.TOP) {
            // Add vertical constraints that run from top to bottom
            for (let u = 0; u <= xSegments; u++) {
                for (let v = ySegments; v > 0; v--) {
                    lengthConstraints.push(new FixedConstraint(
                        particleAt(u, v),
                        particleAt(u, v - 1),
                        restDistance
                    ));
                }
            }
        }

        this.lengthConstraints = lengthConstraints;
    }

    reset() {
        this.cloth.reset();
    }

    simulate(deltaTime) {
        const pins              = this.pins;
        const lengthConstraints = this.lengthConstraints;

        this.cloth.simulate(deltaTime);

        // Pin constraints
        for (let i = 0, ii = pins.length; i < ii; i++) {
            const particle = pins[i];

            particle.previous.copy(
                particle.position.copy(
                    particle.original
                )
            );
        }

        // Length constraints
        for (let i = 0, ii = lengthConstraints.length; i < ii; i++) {
            lengthConstraints[i].resolve();
        }
    }

    render() {
        this.cloth.render();
    }
}
