import { FlagpoleType, VerticalHoisting } from '../constants';
import Flagpole from '../subjects/flagpoles/Flagpole';
import HorizontalFlagpole from '../subjects/flagpoles/HorizontalFlagpole';
import OutriggerFlagpole from '../subjects/flagpoles/OutriggerFlagpole';
import CrossbarFlagpole from '../subjects/flagpoles/CrossbarFlagpole';
import GalleryFlagpole from '../subjects/flagpoles/GalleryFlagpole';
import AustralianFlagpole from '../subjects/flagpoles/AustralianFlagpole';

/**
 * @function buildFlagpole
 *
 * @description Helper for generating different types of flagpoles.
 *
 * @param {Object} [options]
 * @param {Flag} flag
 */
export default function buildFlagpole(options, flag) {
    const settings = Object.assign({}, options);
    let flagpole;

    switch (settings.flagpoleType) {
        case FlagpoleType.HORIZONTAL:
            flagpole = new HorizontalFlagpole(settings);

            break;

        case FlagpoleType.OUTRIGGER:
            flagpole = new OutriggerFlagpole(settings);

            break;

        case FlagpoleType.CROSSBAR:
            settings.crossbarLength = (
                settings.verticalHoisting === VerticalHoisting.NONE
                    ? flag.cloth.width
                    : flag.cloth.height
            );

            flagpole = new CrossbarFlagpole(settings);

            break;

        case FlagpoleType.GALLERY:
            settings.crossbarLength = flag.cloth.width;

            flagpole = new GalleryFlagpole(settings);

            break;

        case FlagpoleType.AUSTRALIAN:
            flagpole = new AustralianFlagpole(settings);

            break;

        case FlagpoleType.VERTICAL:
        default:
            flagpole = new Flagpole(settings);

            break;
    }

    return flagpole;
}
