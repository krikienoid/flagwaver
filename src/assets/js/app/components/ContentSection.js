import React from 'react';
import PropTypes from 'prop-types';

function ContentSection({ children }) {
    return (
        <div className="section">
            <div className="container">
                <div className="text-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

ContentSection.propTypes = {
    children: PropTypes.node.isRequired
};

export default ContentSection;
