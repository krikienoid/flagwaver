import { Side } from '../../constants';
import Flagpole from './Flagpole';
import { createPoleGeometryTypeI } from './utils/FlagpoleGeometryHelpers';

/**
 * @class OutriggerFlagpole
 */
export default class OutriggerFlagpole extends Flagpole {
    buildGeometry(options) {
        const geometry = createPoleGeometryTypeI(options);

        geometry.rotateZ(Math.PI * 7 / 4);

        return geometry;
    }

    addFlag(flag) {
        flag.unpin();
        flag.pin({ edges: [Side.LEFT] });
        flag.setLengthConstraints(Side.LEFT);
        flag.object.rotateZ(Math.PI * 7 / 4);
    }
}
