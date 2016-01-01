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

;( function ( window, document, $, flagWaver, undefined ) {

    //
    // Vars
    //

    // Settings

    var isWindOn = true;

    // Controls

    var isHistorySupported;

    var $controlImgUpload,
        $setImgUploadMode,
        $inputImgLink,
        $setImgLink,
        $setHoisting,
        $setTopEdge,
        $openImgFile,
        $infoImgFile,
        $windToggle;

    //
    // Functions
    //

    // Set flag image
    function setFlagOpts ( flagData ) {
        flagWaver.flag.setOpts( flagData );
    }

    // Get hash variables
    function getHashVars () {
        var vars  = [],
            url   = window.location.href,
            pos   = url.search( /\#(\!|\?)/ ) + 2,
            pairs = url.slice( pos ).split( '&' ),
            pair, i;
        for ( i = 0, ii = pairs.length; i < ii; i++ ) {
            if ( pairs[ i ].length ) {
                pair = pairs[ i ].split( '=' );
                if ( pair.length && pair[ 0 ].length ) {
                    vars.push( pair[ 0 ] );
                    vars[ pair[ 0 ] ] = pair[ 1 ] || null;
                }
            }
        }
        return vars;
    }

    // Get hash data
    function getHashData () {
        return window.location.hash.split( '#' )[ 1 ];
    }

    // Get image src from hash data
    function fromHash () {
        var hashData = getHashData(),
            imgSrc;
        if ( hashData ) {
            if ( hashData[ 0 ] === '!' || hashData[ 0 ] === '?' ) {
                hashData = getHashVars()[ 'src' ];
                if ( hashData ) {
                    imgSrc = window.decodeURIComponent( hashData );
                }
            }
            else { // Old version links
                imgSrc = window.unescape( hashData );
            }
        }
        if ( imgSrc ) {
            $inputImgLink.val( imgSrc );
            setFlagOpts( { imgSrc : imgSrc } );
        }
        else {
            $inputImgLink.val( '' );
            setFlagOpts( { imgSrc : 'img/NZ.2b.png' } );
        }
    }

    // Set hash data
    function toHash () {
        if ( isHistorySupported ) {
            try {
                if ( $inputImgLink.val() ) {
                    window.history.pushState(
                        null,
                        null,
                        '#' + '?src=' + window.encodeURIComponent( $inputImgLink.val() )
                    );
                }
                else {
                    window.history.pushState( null, null, null );
                }
            }
            catch ( e ) {
                window.console.log( e.message );
                window.console.log(
                    'Error: FlagWaverUI: Cannot push states to history object.'
                );
                isHistorySupported = false;
            }
        }
    }

    // Load flag image from file reader
    function loadImgFile ( e ) {
        if ( $inputImgLink.val() || getHashData() ) {
            $inputImgLink.val( '' );
            toHash();
        }
        setFlagOpts( { imgSrc : e.target.result } );
        $infoImgFile.text( $openImgFile.val().split( '\\' ).pop() );
    }

    // Expandable controls
    function updateExpander ( $expander ) {
        var $expandable = $( $expander.data( 'target' ) );
        if ( $expandable.hasClass( 'expanded' ) ) {
            $expander
                .removeClass( 'closed' )
                .addClass( 'open' )
                .val( $expander.data( 'text-selected' ) )
                .attr( 'aria-expanded', 'true' );
            $expandable.attr( 'aria-hidden', 'false' );
        }
        else {
            $expander
                .removeClass( 'open' )
                .addClass( 'closed' )
                .val( $expander.data( 'text-unselected' ) )
                .attr( 'aria-expanded', 'false' );
            $expandable.attr( 'aria-hidden', 'true' );
        }
    }

    //
    // Init
    //

    $( document ).ready( function () {

        //
        // Init Globals
        //

        isHistorySupported = !!( window.history && window.history.pushState );

        //
        // Get DOM elements
        //

        $controlImgUpload = $( '#control-img-upload' );
        $setImgUploadMode = $( '#set-img-upload-mode' );
        $inputImgLink     = $( '#input-img-link' );
        $setImgLink       = $( '#set-img-link' );
        $setHoisting      = $( '#set-hoisting' );
        $setTopEdge       = $( '#set-top-edge' );
        $openImgFile      = $( '#open-img-file' );
        $infoImgFile      = $( '#info-img-file' );
        $windToggle       = $( '#wind-toggle' );

        //
        // Add event handlers
        //

        // Load flag image from hash on user entered hash
        if ( isHistorySupported ) $( window ).on( 'popstate', fromHash );

        // Determine file loading mode
        $setImgUploadMode.on( 'change', function () {
            var mode = $setImgUploadMode.val();
            if ( mode === 'web' ) {
                $controlImgUpload
                    .removeClass( 'upload-mode-file' )
                    .addClass( 'upload-mode-web' )
                    .append( $( '.input-img-web' ) );
            }
            else if ( mode === 'file' ) {
                $controlImgUpload
                    .removeClass( 'upload-mode-web' )
                    .addClass( 'upload-mode-file' )
                    .append( $( '.input-img-file' ) );
            }
        } ).trigger( 'change' );

        // Load flag image from user given url
        $setImgLink.on( 'click', function () {
            toHash();
            setFlagOpts( { imgSrc : $inputImgLink.val() } );
        } );

        // Load flag image from file
        $openImgFile
            .on( 'change', function () {
                var file   = $openImgFile[ 0 ].files[ 0 ],
                    reader = new window.FileReader();
                reader.onload = loadImgFile;
                reader.readAsDataURL( file );
            } )
            .on( 'focus', function () {
                $openImgFile.parent().addClass( 'active' );
            } )
            .on( 'blur', function () {
                $openImgFile.parent().removeClass( 'active' );
            } );

        $( 'input[type="button"].expander' ).on( 'click', function () {
            var $this = $( this );
            $( $this.data( 'target' ) ).toggleClass( 'expanded' );
            updateExpander( $this );
        } ).each( function ( i, elem ) { updateExpander( $( elem ) ); } );

        //
        // Settings
        //

        // Turn wind on or off
        $windToggle.on( 'click', function () {
            isWindOn = !isWindOn;
            if ( isWindOn ) {
                flagWaver.setWind( 300 );
                $windToggle.val( $windToggle.data( 'text-selected' ) );
            }
            else {
                flagWaver.setWind( 0 );
                $windToggle.val( $windToggle.data( 'text-unselected' ) );
            }
        } ).val( $windToggle.data( 'text-selected' ) );

        $setHoisting.on( 'change', function () {
            setFlagOpts( {
                hoisting : $setHoisting.val()
            } );
        } );

        $setTopEdge.on( 'change', function () {
            setFlagOpts( {
                topEdge : $setTopEdge.val()
            } );
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

} )( window, document, jQuery, window.flagWaver );
