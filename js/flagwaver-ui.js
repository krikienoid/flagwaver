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

    //
    // Quick Links
    //

    var $setLink = $( '#set-link' ),
        $getLink = $( '#get-link' );

    // Set flag img
    function setLink ( imgSrc, w, h ) {
        window.flagWaver.setFlagImg( { src : imgSrc, w : w, h : h } );
    }

    // Auto load flag image from hash data url
    $( window.document ).ready( function getDataFromURL () {
        var hashData = window.location.href.split( '#' ),
            imgSrc;
        if ( hashData && hashData.length > 1 ) {
            imgSrc = window.unescape( hashData[ 1 ] );
            setLink(
                imgSrc,
                window.unescape( hashData[ 2 ] ),
                window.unescape( hashData[ 3 ] )
            );
            $setLink.val( imgSrc );
        }
    } );

    // Generate hashed url for loaded flag image
    $getLink.on( 'click', function getLink () {
        if ( $setLink.val().length ) {
            var imageData = window.flagWaver.getFlagImg(),
                w = ( imageData.w )? imageData.w : 0,
                h = ( imageData.h )? imageData.h : 0;
            window.prompt(
                'Your link:',
                window.location.href.split( '#' )[ 0 ] +
                '#' + window.escape( $setLink.val() ) +
                ((w && h)? '#' + window.escape( w ) : '') +
                ((w && h)? '#' + window.escape( h ) : '')
            );
        }
        else {
            window.alert( 'Input field is empty!' );
        }
    } );

    // Load flag image from user given url
    $setLink.on( 'change', function () {
        setLink( $setLink.val() );
    } );

}( window, document, jQuery ));
