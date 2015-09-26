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

;(function ( window, document, $, undefined ) {

    var $setImgLink  = $( '#set-img-link' ),
        $openImgFile = $( '#open-img-file' ),
        $windToggle  = $( '#wind-toggle' );

    //
    // Hash Links
    //

    // Set flag image
    function setImg ( flagData ) {
        window.flagWaver.setFlagImg( flagData );
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
        window.location.hash = window.escape( JSON.stringify( { src : $setImgLink.val() } ) );
    }

    // Load flag image from hash on page load
    $( window.document ).ready( fromHash );

    // Load flag image from hash on user entered hash
    $( window ).on( 'hashchange', fromHash );

    // Load flag image from user given url
    $setImgLink.on( 'change', function () {
        toHash();
        setImg( { src : $setImgLink.val() } );
    } );

    //
    // Load from file
    //

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

    $windToggle.on( 'change', function () {
        if ( this.checked ) window.flagWaver.setWind( 300 );
        else window.flagWaver.setWind( 0 );
    } );

}( window, document, jQuery ));
