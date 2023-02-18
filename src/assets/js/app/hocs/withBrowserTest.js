import setLoadedClass from '../globals/setLoadedClass';
import EmptyStateScreen from '../components/EmptyStateScreen';

export default function withBrowserTest(WrappedComponent) {
    return (props) => {
        if (!window.WebGLRenderingContext) {
            // Browser does not support WebGL

            setLoadedClass();

            return (
                <EmptyStateScreen>
                    <h2>Your browser or device does not support WebGL</h2>
                    <p>This site requires a browser that supports WebGL.</p>
                    <p><a href="http://get.webgl.org/" rel="noopener" target="_blank">More information</a></p>
                </EmptyStateScreen>
            );
        } else {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext && (
                canvas.getContext('webgl') ||
                canvas.getContext('experimental-webgl')
            );

            if (!ctx) {
                // Browser supports WebGL but initialization failed

                setLoadedClass();

                return (
                    <EmptyStateScreen>
                        <h2>WebGL could not be initialized</h2>
                        <p>Your browser supports WebGL but has encountered another problem.</p>
                        <p><a href="http://get.webgl.org/troubleshooting" rel="noopener" target="_blank">More information</a></p>
                    </EmptyStateScreen>
                );
            }
        }

        // IE 10 and IE 11
        const isIE = /Trident\/|MSIE/.test(window.navigator.userAgent);

        if (isIE) {
            // Browser is not supported

            setLoadedClass();

            return (
                <EmptyStateScreen>
                    <h2>Your browser is not supported</h2>
                    <p>Please upgrade your browser to use FlagWaver.</p>
                </EmptyStateScreen>
            );
        }

        // All good
        return (
            <WrappedComponent {...props} />
        );
    };
}
