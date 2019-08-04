import React from 'react';

import EmptyStateScreen from '../components/EmptyStateScreen';

export default function withWebGLBrowserTest(WrappedComponent) {
    return (props) => {
        if (!window.WebGLRenderingContext) {
            // Browser does not support WebGL
            return (
                <EmptyStateScreen>
                    <h2>Your browser or device does not support WebGL</h2>
                    <p>This page requires a browser that supports WebGL.</p>
                    <p><a href="http://get.webgl.org/" rel="noopener" target="_blank">More information</a></p>
                </EmptyStateScreen>
            );
        } else {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

            if (!ctx) {
                // Browser supports WebGL but initialization failed
                return (
                    <EmptyStateScreen>
                        <h2>WebGL could not be initialized</h2>
                        <p>Your browser supports WebGL but has encountered another problem.</p>
                        <p><a href="http://get.webgl.org/troubleshooting" rel="noopener" target="_blank">More information</a></p>
                    </EmptyStateScreen>
                );
            }
        }

        // All good
        return (
            <WrappedComponent {...props} />
        );
    };
}
