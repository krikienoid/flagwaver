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

    var $setImgLink  = $( '#set-img-link' ),
        $getImgLink  = $( '#get-img-link' ),
        $openImgFile = $( '#open-img-file' ),
        $windToggle  = $( '#wind-toggle' );

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
            $setImgLink.val( imgSrc );
        }
    } );

    // Generate hashed url for loaded flag image
    $getImgLink.on( 'click', function getLink () {
        if ( $setImgLink.val().length ) {
            window.prompt(
                'Your link:',
                window.location.href.split( '#' )[ 0 ] + '#' + window.escape( $setImgLink.val() )
            );
        }
        else {
            window.alert( 'Input field is empty!' );
        }
    } );

    // Load flag image from user given url
    $setImgLink.on( 'change', function () {
        setLink( $setImgLink.val() );
    } );

    //
    // Load from file
    //

    $openImgFile.on( 'change', function () {
        var file   = $openImgFile[ 0 ].files[ 0 ],
            reader = new FileReader();
        reader.onload = function (e) {
            setLink( e.target.result );
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
