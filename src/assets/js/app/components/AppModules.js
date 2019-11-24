import React, { Fragment } from 'react';

import FlagGroupContainer from '../containers/FlagGroupContainer';
import LightingContainer from '../containers/LightingContainer';
import WindContainer from '../containers/WindContainer';

export default function AppModules() {
    return (
        <Fragment>
            <FlagGroupContainer />
            <LightingContainer />
            <WindContainer />
        </Fragment>
    );
}
