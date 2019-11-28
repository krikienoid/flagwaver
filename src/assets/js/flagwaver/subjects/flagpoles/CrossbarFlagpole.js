import { Side, VerticalHoisting } from '../../constants';
import Flagpole from './Flagpole';
import { createPoleGeometryTypeT } from './utils/FlagpoleGeometryHelpers';

/**
 * @class CrossbarFlagpole
 */
export default class CrossbarFlagpole extends Flagpole {
    constructor(options) {
        super(options);

        this.verticalHoisting = options.verticalHoisting;
    }

    buildGeometry(options) {
        return createPoleGeometryTypeT(options);
    }

    addFlag(flag) {
        flag.unpin();

        switch (this.verticalHoisting) {
            case VerticalHoisting.NONE:
                flag.pin({ edges: [Side.TOP] });
                flag.setLengthConstraints(Side.TOP);
                flag.object.position.x = -flag.cloth.width / 2;

                break;

            case VerticalHoisting.TOP_LEFT:
                flag.pin({ edges: [Side.LEFT] });
                flag.setLengthConstraints(Side.LEFT);
                flag.object.position.x = -flag.cloth.height / 2;
                flag.object.rotateZ(Math.PI * 3 / 2);
                flag.object.rotateX(Math.PI);

                break;

            case VerticalHoisting.TOP_RIGHT:
            default:
                flag.pin({ edges: [Side.LEFT] });
                flag.setLengthConstraints(Side.LEFT);
                flag.object.position.x = flag.cloth.height / 2;
                flag.object.rotateZ(Math.PI * 3 / 2);

                break;
        }
    }
}
