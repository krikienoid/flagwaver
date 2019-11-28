import { Side } from '../../constants';
import Flagpole from './Flagpole';
import { createPoleGeometryTypeT } from './utils/FlagpoleGeometryHelpers';

/**
 * @class CrossbarFlagpole
 */
export default class CrossbarFlagpole extends Flagpole {
    buildGeometry(options) {
        return createPoleGeometryTypeT(options);
    }

    addFlag(flag) {
        flag.unpin();
        flag.pin({ edges: [Side.LEFT] });
        flag.setLengthConstraints(Side.LEFT);
        flag.object.position.x = flag.cloth.height / 2;
        flag.object.rotateZ(Math.PI * 3 / 2);
    }
}
