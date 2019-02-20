import PropTypes from 'prop-types';

export const fileRecordPropType = PropTypes.shape({
    url: PropTypes.string,
    file: PropTypes.shape({
        name: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired
    })
});
