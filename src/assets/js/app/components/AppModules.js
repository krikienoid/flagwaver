import React, { Fragment } from 'react';

import FlagGroupContainer from '../containers/FlagGroupContainer';
import WindContainer from '../containers/WindContainer';

export default function AppModules() {
    return (
        <Fragment>
            <FlagGroupContainer />
            <WindContainer />
        </Fragment>
    );
}
