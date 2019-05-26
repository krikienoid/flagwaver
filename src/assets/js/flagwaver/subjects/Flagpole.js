import THREE from 'three';
import { Side, FlagpoleType } from '../constants';
import { createPoleGeometryTypeI } from './FlagpoleGeometryUtils';

/**
 * @class Flagpole
 *
 * @classdesc Creates a geometry, material, and mesh for a flagpole.
 *
 * @param {Object} [options]
 *   @param {FlagpoleType} [options.flagpoleType]
 *   @param {number} [options.poleWidth]
 *   @param {number} [options.poleLength]
 *   @param {number} [options.poleCapSize]
 *   @param {number} [options.crossbarWidth]
 *   @param {number} [options.crossbarLength]
 *   @param {number} [options.crossbarCapSize]
 *   @param {number} [options.poleTopOffset]
 */
export default class Flagpole {
    constructor(options) {
        const settings = Object.assign({}, this.constructor.defaults, options);

        // Geometry
        const geometry = this.buildGeometry(settings);

        // Material
        const material = new THREE.MeshPhongMaterial({
            color:     0x6A6A6A,
            specular:  0xffffff,
            shininess: 18
        });

        // Mesh
        const mesh = new THREE.Mesh(geometry, material);

        mesh.receiveShadow = true;
        mesh.castShadow    = true;

        this.mesh = mesh;
        this.object = this.mesh;
    }

    static defaults = (() => {
        const o = {};

        o.flagpoleType    = FlagpoleType.VERTICAL;
        o.poleWidth       = 6;
        o.poleLength      = 8192;
        o.poleCapSize     = o.poleWidth + 2;
        o.crossbarWidth   = o.poleWidth - 2;
        o.crossbarLength  = 200;
        o.crossbarCapSize = o.crossbarWidth + 2;
        o.poleTopOffset   = 60;

        return o;
    })();

    destroy() {
        if (this.mesh instanceof THREE.Mesh) {
            this.mesh.material.dispose();
            this.mesh.geometry.dispose();
        }
    }

    buildGeometry(options) {
        return createPoleGeometryTypeI(options);
    }

    addFlag(flag) {
        flag.unpin();
        flag.pin({ edges: [Side.LEFT] });
        flag.setLengthConstraints(Side.LEFT);
    }
}
