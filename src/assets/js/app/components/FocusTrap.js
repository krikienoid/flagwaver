import PropTypes from 'prop-types';

import useChildRef from '../hooks/useChildRef';
import useFocusTrap from '../hooks/useFocusTrap';

function FocusTrap({
    active,
    focusTrapOptions,
    children
}) {
    const [childWithRef, childRef] = useChildRef(children);

    useFocusTrap(childRef, active, focusTrapOptions);

    return childWithRef;
}

FocusTrap.propTypes = {
    active: PropTypes.bool.isRequired,
    focusTrapOptions: PropTypes.object,
    children: PropTypes.element.isRequired
};

export default FocusTrap;
