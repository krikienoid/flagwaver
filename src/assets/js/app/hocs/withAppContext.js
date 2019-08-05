import React from 'react';

import AppContext from '../contexts/AppContext';

export default function withAppContext(WrappedComponent) {
    return props => (
        <AppContext.Consumer>
            {app => app && (
                <WrappedComponent {...props} app={app} />
            )}
        </AppContext.Consumer>
    );
}
