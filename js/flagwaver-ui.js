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

    // Get hash data
    function fromHash () {
        var hashData = window.unescape(
            window.location.hash.split( '#' )[ 1 ]
        );
        if ( hashData ) {
            if ( hashData[ 0 ] === '{' ) {
                flagData = window.JSON.parse( hashData );
            }
            else {
                flagData = { src : hashData };
            }
            setImg( flagData );
            $setImgLink.val( flagData.src );
        }
    }

    // Set hash data
    function toHash () {
        window.location.hash = window.escape(
            window.JSON.stringify( { src : $setImgLink.val() } )
        );
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
        $( window ).on( 'hashchange', fromHash );

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
                setImg( { src : e.target.result } );
                $setImgLink.val( '' );
                toHash();
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

        // Init FlagWaver
        flagWaver.init( $( '.js-flag-canvas' )[ 0 ] );

        // Load flag image from hash on page load
        fromHash();

    } );

}( window, document, jQuery, window.flagWaver ));
