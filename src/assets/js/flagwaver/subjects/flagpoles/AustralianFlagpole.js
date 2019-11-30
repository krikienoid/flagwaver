import { Side } from '../../constants';
import Flagpole from './Flagpole';
import { createPoleGeometryTypeI } from './utils/FlagpoleGeometryHelpers';

/**
 * @class AustralianFlagpole
 */
export default class AustralianFlagpole extends Flagpole {
    constructor(options) {
        super(options);

        const settings = Object.assign({}, this.constructor.defaults, options);

        this.top.set(0, settings.poleLength * 2 / 3, 0);
    }

    buildGeometry(options) {
        const geometry = createPoleGeometryTypeI(options);

        geometry.translate(0, -options.poleLength * 5 / 3, 0);
        geometry.rotateZ(Math.PI);

        return geometry;
    }

    addFlag(flag) {
        flag.unpin();
        flag.pin({ edges: [Side.LEFT] });
        flag.setLengthConstraints(Side.LEFT);
        flag.object.position.add(this.top);
        flag.object.translateY(flag.cloth.height);
    }
}
