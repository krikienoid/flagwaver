import PropTypes from 'prop-types';

import useChildRef from '../hooks/useChildRef';
import useFocusDisabled from '../hooks/useFocusDisabled';

function FocusDisabled({
    disabled,
    children
}) {
    const [childWithRef, childRef] = useChildRef(children);

    // Disables focus while element is transitioning out
    useFocusDisabled(childRef, disabled);

    return childWithRef;
}

FocusDisabled.propTypes = {
    disabled: PropTypes.bool.isRequired,
    children: PropTypes.element.isRequired
};

export default FocusDisabled;
