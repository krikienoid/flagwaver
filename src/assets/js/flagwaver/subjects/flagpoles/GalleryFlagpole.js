import { Side } from '../../constants';
import Flagpole from './Flagpole';
import { createPoleGeometryTypeL } from './utils/FlagpoleGeometryHelpers';

/**
 * @class GalleryFlagpole
 */
export default class GalleryFlagpole extends Flagpole {
    buildGeometry(options) {
        return createPoleGeometryTypeL(options);
    }

    addFlag(flag) {
        flag.unpin();
        flag.pin({ edges: [Side.LEFT, Side.TOP] });
        flag.setLengthConstraints(Side.LEFT);
        flag.object.position.add(this.top);
    }
}
