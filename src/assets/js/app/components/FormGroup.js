import React from 'react';
import PropTypes from 'prop-types';

function FormGroup({
    className,
    valid,
    feedback,
    feedbackId,
    children,
    ...attributes
}) {
    return (
        <div className={className + (!valid ? ' ' + 'has-error' : '')} {...attributes}>
            {children}

            {!valid ? (
                <p className="form-input-hint" id={feedbackId}>
                    {feedback}
                </p>
            ) : null}
        </div>
    );
}

FormGroup.propTypes = {
    className: PropTypes.string,
    valid: PropTypes.bool.isRequired,
    feedback: PropTypes.node,
    feedbackId: PropTypes.string,
    children: PropTypes.node
};

FormGroup.defaultProps = {
    className: 'form-group'
};

export default FormGroup;
