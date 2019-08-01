import React from 'react';

import ContentSection from '../components/ContentSection';

export default function withWebGLBrowserTest(WrappedComponent) {
    return (props) => {
        if (!window.WebGLRenderingContext) {
            // Browser does not support WebGL
            return (
                <ContentSection>
                    <h2>Your browser or device does not support WebGL.</h2>
                    <p>This page requires a browser that supports WebGL. <a href="http://get.webgl.org/" rel="noopener" target="_blank">Follow this link for more information</a>.</p>
                </ContentSection>
            );
        } else {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

            if (!ctx) {
                // Browser supports WebGL but initialization failed
                return (
                    <ContentSection>
                        <h2>WebGL could not be initialized.</h2>
                        <p>Your browser supports WebGL but has encountered another problem. <a href="http://get.webgl.org/troubleshooting" rel="noopener" target="_blank">Follow this link for more information</a>.</p>
                    </ContentSection>
                );
            }
        }

        // All good
        return (
            <WrappedComponent {...props} />
        );
    };
}
