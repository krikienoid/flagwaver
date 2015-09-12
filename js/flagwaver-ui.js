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

    var $setLink = $( '#set-img-link' ),
        $getLink = $( '#get-img-link' ),
        $openImg = $( '#open-img-file' );

    // Set flag img
    function setLink ( imgSrc ) {
        window.flagWaver.setFlagImg( { src : imgSrc } );
    }

    // Auto load flag image from hash data url
    $( window.document ).ready( function getDataFromURL () {
        var hashData = window.location.href.split( '#' ),
            imgSrc;
        if ( hashData && hashData.length > 1 ) {
            imgSrc = window.unescape( hashData[ 1 ] );
            setLink( imgSrc );
            $setLink.val( imgSrc );
        }
    } );

    // Generate hashed url for loaded flag image
    $getLink.on( 'click', function getLink () {
        if ( $setLink.val().length ) {
            window.prompt(
                'Your link:',
                window.location.href.split( '#' )[ 0 ] + '#' + window.escape( $setLink.val() )
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

    //
    // Load from file
    //

    $openImg.on( 'change', function () {
        var file   = $openImg[ 0 ].files[ 0 ],
            reader = new FileReader();
        reader.onload = function (e) {
            setLink( e.target.result );
        };
        reader.readAsDataURL( file );
    } );

}( window, document, jQuery ));
