import { Side } from '../../constants';
import Flagpole from './Flagpole';
import { createPoleGeometryTypeI } from './utils/FlagpoleGeometryHelpers';

/**
 * @class AustralianFlagpole
 */
export default class AustralianFlagpole extends Flagpole {
    buildGeometry(options) {
        const geometry = createPoleGeometryTypeI(options);

        geometry.rotateZ(Math.PI);

        return geometry;
    }

    addFlag(flag) {
        flag.unpin();
        flag.pin({ edges: [Side.LEFT] });
        flag.setLengthConstraints(Side.LEFT);
        flag.object.translateY(flag.cloth.height);
    }
}
