/**
 * Flag Waver
 *
 * Simulate a flag waving in the breeze right in your browser window.
 *
 * /u/krikienoid
 *
 */

//
// Flag Waver UI
//

;(function ( window, document, $, flagWaver, undefined ) {

    var $setImgLink,
        $openImgFile,
        $windToggle;

    //
    // Functions
    //

    // Set flag image
    function setImg ( flagData ) {
        flagWaver.setFlagImg( flagData );
    }

    // Get URI variables
    function getURIVars () {
        var vars  = [],
            pairs = window.location.href.slice( window.location.href.indexOf( '?' ) + 1 ).split( '&' ),
            pair, i;
        for ( i = 0, ii = pairs.length; i < ii; i++ ) {
            pair = pairs[ i ].split( '=' );
            vars.push( pair[ 0 ] );
            vars[ pair[ 0 ] ] = pair[ 1 ];
        }
        return vars;
    }

    // Get hash data
    function fromHash () {
        var hashData = window.location.hash.split( '#' )[ 1 ],
            imgSrc,
            flagData;
        if ( hashData ) {
            if ( hashData[ 0 ] === '?' ) {
                hashData = getURIVars()[ 'src' ];
                if ( hashData ) {
                    imgSrc = window.decodeURIComponent( hashData );
                }
            }
            else {
                // Old version links
                imgSrc = window.unescape( hashData );
            }
        }
        if ( imgSrc ) {
            flagData = { src : imgSrc };
            $setImgLink.val( imgSrc );
            setImg( flagData );
        }
        else {
            setImg( { src : 'img/NZ.2b.png' } );
        }
    }

    // Set hash data
    function toHash () {
        if ( $setImgLink.val() ) {
            window.location.hash = '?src=' + window.encodeURIComponent( $setImgLink.val() );
        }
        else {
            window.location.hash = '';
        }
    }

    //
    // Init
    //

    $( document ).ready( function () {

        //
        // Get DOM elements
        //

        $setImgLink  = $( '#set-img-link' );
        $openImgFile = $( '#open-img-file' );
        $windToggle  = $( '#wind-toggle' );

        //
        // Add event handlers
        //

        // Load flag image from hash on user entered hash
        $( window ).on( 'popstate', fromHash );

        // Load flag image from user given url
        $setImgLink.on( 'change', function () {
            toHash();
            setImg( { src : $setImgLink.val() } );
        } );

        // Load flag image from file
        $openImgFile.on( 'change', function () {
            var file   = $openImgFile[ 0 ].files[ 0 ],
                reader = new FileReader();
            reader.onload = function (e) {
                $setImgLink.val( '' );
                //toHash();
                setImg( { src : e.target.result } );
            };
            reader.readAsDataURL( file );
        } );

        //
        // Settings
        //

        // Turn wind on or off
        $windToggle.on( 'change', function () {
            if ( this.checked ) {
                flagWaver.setWind( 300 );
            }
            else {
                flagWaver.setWind( 0 );
            }
        } );

        //
        // Init
        //

        // Init flagWaver and append renderer to DOM
        flagWaver.init();
        $( '.js-flag-canvas' ).append( flagWaver.canvas );
        window.dispatchEvent( new window.Event( 'resize' ) );

        // Load flag image from hash on page load
        fromHash();

    } );

}( window, document, jQuery, window.flagWaver ));
