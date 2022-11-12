import {
    BackSide,
    ClampToEdgeWrapping,
    DoubleSide,
    FrontSide,
    GLSL3,
    LinearFilter,
    sRGBEncoding,

    Color,
    Mesh,
    MeshStandardMaterial,
    Object3D,
    ShaderMaterial,
    Texture
} from 'three';

import { ITERATION_COUNT, Side } from '../constants';
import { generateDataTexture } from '../utils/ImageUtils';
import ShaderChunk from '../webgl/ShaderChunk';
import Cloth from '../physics/Cloth';
import FixedConstraint from '../physics/FixedConstraint';

// Default flag texture
const WHITE_TEXTURE = generateDataTexture(1, 1, new Color(0xffffff));

function buildCloth(options) {
    const { width, height, mass, restDistance } = options;

    return new Cloth(
        Math.max(1, Math.round(width / restDistance)),
        Math.max(1, Math.round(height / restDistance)),
        restDistance,
        mass * width * height
    );
}

function buildMesh(cloth, options) {
    const geometry = cloth.geometry;
    let texture = WHITE_TEXTURE;
    let backSideTexture;

    const prepareTexture = (texture) => {
        texture.needsUpdate = true;
        texture.anisotropy  = 16;
        texture.minFilter   = LinearFilter;
        texture.magFilter   = LinearFilter;

        texture.wrapS = texture.wrapT = ClampToEdgeWrapping;

        return texture;
    };

    const prepareMesh = (texture, side) => {
        texture.encoding = sRGBEncoding;

        const material = new MeshStandardMaterial({
            alphaTest: 0.5,
            color:     0xffffff,
            metalness: 0.08,
            roughness: 0.86,
            side:      side,
            map:       texture
        });

        /* //
        material = new MeshBasicMaterial({
            color:       0x00ff00,
            wireframe:   true,
            transparent: true,
            opacity:     0.9
        });
        // */

        const mesh = new Mesh(geometry, material);

        mesh.castShadow = true;
        mesh.customDepthMaterial = new ShaderMaterial({
            glslVersion:    GLSL3,
            uniforms:       { textureMap: { value: texture } },
            vertexShader:   ShaderChunk.depth_vert,
            fragmentShader: ShaderChunk.depth_frag
        });

        mesh.position.set(0, -cloth.height, 0);

        return mesh;
    };

    if (options && options.texture) {
        if (options.texture instanceof Texture) {
            texture = prepareTexture(options.texture);

            if (options.backSideTexture instanceof Texture) {
                backSideTexture = prepareTexture(options.backSideTexture);
            }
        } else {
            console.error(
                'FlagWaver.Flag: options.texture must be an instance of THREE.Texture.'
            );
        }
    }

    return [
        prepareMesh(texture, backSideTexture ? FrontSide : DoubleSide),
        backSideTexture ? prepareMesh(backSideTexture, BackSide) : null
    ];
}

const pin = (() => {
    const defaults = {
        edges: [],
        spacing: 1
    };

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
 *   @param {number} [options.restDistance]
 *   @param {THREE.Texture} [options.texture]
 *   @param {THREE.Texture} [options.backSideTexture]
 *   @param {Object} [options.pin]
 */
export default class Flag {
    constructor(options) {
        const settings = Object.assign({}, Flag.defaults, options);

        this.cloth = buildCloth(settings);
        this.pins = [];
        this.lengthConstraints = [];

        const [mesh, mesh2] = buildMesh(this.cloth, settings);

        this.mesh = mesh;
        this.mesh2 = mesh2;

        this.object = new Object3D();
        this.object.add(this.mesh);

        if (this.mesh2) {
            this.object.add(this.mesh2);
        }

        this.pin(settings.pin);
    }

    static defaults = {
        width:                  1.8,
        height:                 1.2,
        mass:                   0.11, // 110 g/m^s
        restDistance:           1.2 / 10,
        rigidness:              1,
        texture:                WHITE_TEXTURE,
        backSideTexture:        null,
        pin: {
            edges:              [Side.LEFT]
        }
    };

    destroy() {
        this.mesh.material.dispose();
        this.mesh.geometry.dispose();
        this.mesh.material.map.dispose();
        this.mesh.customDepthMaterial.dispose();

        if (this.mesh2) {
            this.mesh2.material.dispose();
            this.mesh2.material.map.dispose();
            this.mesh2.customDepthMaterial.dispose();
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
        for (let n = 0, nn = ITERATION_COUNT; n < nn; n++) {
            for (let i = 0, ii = lengthConstraints.length; i < ii; i++) {
                lengthConstraints[i].resolve();
            }
        }
    }

    render() {
        this.cloth.render();
    }
}
