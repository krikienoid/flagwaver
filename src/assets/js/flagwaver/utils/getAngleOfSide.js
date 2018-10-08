import { Side } from '../constants';

export default function getAngleOfSide(side) {
    switch (side) {
        case Side.TOP: return 0;
        case Side.LEFT: return -Math.PI / 2;
        case Side.BOTTOM: return Math.PI;
        case Side.RIGHT: return Math.PI / 2;
        default: return 0;
    }
}
