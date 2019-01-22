import React from 'react';

import AppContext from '../contexts/AppContext';

export default function withAppContext(Component) {
    return props => (
        <AppContext.Consumer>
            {app => app && (
                <Component {...props} app={app} />
            )}
        </AppContext.Consumer>
    );
}
