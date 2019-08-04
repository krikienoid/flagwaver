import React from 'react';
import PropTypes from 'prop-types';

function EmptyStateScreen({ children }) {
    return (
        <div className="empty empty-screen">
            <div className="v-align">
                <div className="v-align-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

EmptyStateScreen.propTypes = {
    children: PropTypes.node.isRequired
};

export default EmptyStateScreen;
