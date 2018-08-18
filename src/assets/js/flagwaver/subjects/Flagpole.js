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
function Flagpole(options) {
    var settings = Object.assign({}, Flagpole.defaults, options);

    var geometry;
    var material;
    var mesh;

    // Geometry
    geometry = this.buildGeometry(settings);

    // Material
    material = new THREE.MeshPhongMaterial({
        color:     0x6A6A6A,
        specular:  0xffffff,
        metal:     true,
        shininess: 18
    });

    // Mesh
    mesh = new THREE.Mesh(geometry, material);

    mesh.receiveShadow = true;
    mesh.castShadow    = true;

    this.mesh = mesh;
    this.object = this.mesh;
}

Object.assign(Flagpole, {
    defaults: (function () {
        var o = {};

        o.flagpoleType    = FlagpoleType.VERTICAL;
        o.poleWidth       = 6;
        o.poleLength      = 8192;
        o.poleCapSize     = o.poleWidth + 2;
        o.crossbarWidth   = o.poleWidth - 2;
        o.crossbarLength  = 200;
        o.crossbarCapSize = o.crossbarWidth + 2;
        o.poleTopOffset   = 60;

        return o;
    })()
});

Object.assign(Flagpole.prototype, {
    destroy: function () {
        if (this.mesh instanceof THREE.Mesh) {
            this.mesh.material.dispose();
            this.mesh.geometry.dispose();
        }
    },

    buildGeometry: function (options) {
        return createPoleGeometryTypeI(options);
    },

    addFlag: function (flag) {
        flag.unpin();
        flag.pin({ edges: [Side.LEFT] });
        flag.setLengthConstraints(Side.LEFT);
    }
});

export default Flagpole;
