import { Mesh, MeshStandardMaterial, Vector3 } from 'three';

import { Side, FlagpoleType } from '../../constants';
import { createPoleGeometryTypeI } from './utils/FlagpoleGeometryHelpers';

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
        const material = new MeshStandardMaterial({
            color:     0xfefefe,
            metalness: 0.98,
            roughness: 0.55
        });

        // Mesh
        const mesh = new Mesh(geometry, material);

        mesh.receiveShadow = true;
        mesh.castShadow    = true;

        this.top = new Vector3(0, settings.poleLength, 0);
        this.mesh = mesh;
        this.object = this.mesh;
    }

    static defaults = (() => {
        const o = {};

        o.flagpoleType          = FlagpoleType.VERTICAL;
        o.poleWidth             = 0.076;
        o.poleLength            = 6;
        o.poleCapSize           = o.poleWidth * 4 / 3;
        o.crossbarWidth         = o.poleWidth * 2 / 3;
        o.crossbarLength        = 1.2;
        o.crossbarCapSize       = o.crossbarWidth * 3 / 2;
        o.poleTopOffset         = 0.1;

        return o;
    })();

    destroy() {
        this.mesh.material.dispose();
        this.mesh.geometry.dispose();
    }

    buildGeometry(options) {
        return createPoleGeometryTypeI(options);
    }

    addFlag(flag) {
        flag.unpin();
        flag.pin({ edges: [Side.LEFT] });
        flag.setLengthConstraints(Side.LEFT);
        flag.object.position.add(this.top);
    }
}
