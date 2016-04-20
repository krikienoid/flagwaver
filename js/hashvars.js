/**
 * Hash Vars
 *
 * Encode and decode variables using the URL hash fragment.
 *
 * /u/krikienoid
 *
 */

//
// Hash Vars
//

;( function ( window, document, undefined ) {

    //
    // Vars
    //

    var isHistorySupported = !!( window.history && window.history.pushState );

    var hashVars = [];

    var settings = {
        startingChar   : '?',
        delimiterChar  : '&',
        assignmentChar : '=',
        hideIfDefault  : true,
        useHistoryAPI  : isHistorySupported
    };

    //
    // HashVar class
    //

    function HashVar ( props ) {
        this.key = props.key;
        this.defaultValue = props.defaultValue;
        if ( typeof props.encode === 'function' ) {
            this.encode = props.encode;
        }
        if ( typeof props.decode === 'function' ) {
            this.decode = props.decode;
        }
    }

    HashVar.prototype.encode = function ( value ) {
        return window.encodeURIComponent( value );
    };

    HashVar.prototype.decode = function ( str ) {
        return window.decodeURIComponent( str );
    };

    HashVar.prototype.remove = function () {
        return hashVars.splice( hashVars.indexOf( this ), 1 )[ 0 ];
    };

    function create ( props ) {
        var hashVar;
        if ( props && props.key ) {
            hashVar = new HashVar( props );
            hashVars.push( hashVar );
            return hashVar;
        }
        else {
            return false;
        }
    }

    function get ( key ) {
        var i, ii;
        if ( typeof key === 'undefined' ) {
            return hashVars;
        }
        else if ( typeof key === 'number' ) {
            return hashVars[ key ] || false;
        }
        else if ( typeof key === 'string' ) {
            for ( i = 0, ii = hashVars.length; i < ii; i++ ) {
                if ( key === hashVars[ i ].key ) {
                    return hashVars[ i ];
                }
            }
        }
        return false;
    }

    function remove ( key ) {
        var hashVar;
        if ( typeof key !== 'undefined' ) {
            hashVar = get( key );
            if ( hashVar ) { return hashVar.remove(); }
        }
        return false;
    }

    //
    // Functions
    //

    function getVarsFromHash ( hash ) {
        var vars = [],
            hash = hash || window.location.hash,
            pos  = hash.indexOf( settings.startingChar ),
            pairs, i, ii, pair, key;
        if ( pos < 0 ) { return vars; }
        pairs = hash.slice( pos + 1 ).split( settings.delimiterChar );
        for ( i = 0, ii = pairs.length; i < ii; i++ ) {
            if ( pairs[ i ] ) {
                pair = pairs[ i ].split( settings.assignmentChar );
                if ( pair[ 0 ] ) {
                    key = pair[ 0 ].toLowerCase();
                    vars.push( key );
                    vars[ key ] = pair[ 1 ] || '';
                }
            }
        }
        return vars;
    }

    function getData ( hash ) {
        var data = {},
            vars = getVarsFromHash( hash ),
            i, ii, hashVar, str;
        for ( i = 0, ii = hashVars.length; i < ii; i++ ) {
            hashVar = hashVars[ i ];
            str = vars[ hashVar.key.toLowerCase() ];
            if ( str ) {
                data[ hashVar.key ] = hashVar.decode( str );
            }
            else {
                data[ hashVar.key ] = hashVar.defaultValue;
            }
        }
        return data;
    }

    function getHash ( data ) {
        var pairs = [],
            i, ii, hashVar, value;
        for ( i = 0, ii = hashVars.length; i < ii; i++ ) {
            hashVar = hashVars[ i ];
            value = data[ hashVar.key ];
            if ( value !== hashVar.defaultValue || !settings.hideIfDefault ) {
                pairs.push(
                    hashVar.key.toLowerCase() +
                    settings.assignmentChar +
                    hashVar.encode( value )
                );
            }
        }
        if ( pairs.length ) {
            pairs[ 0 ] = '#' + settings.startingChar + pairs[ 0 ];
            return pairs.join( settings.delimiterChar );
        }
        else {
            return '';
        }
    }

    function setData ( data, opts ) {
        var hash = getHash( data );
        if ( opts && opts.clearHash ) { hash = ''; }
        if ( isHistorySupported ) {
            hash = hash || '.';
            try {
                if ( opts && opts.isNewState ) {
                    window.history.pushState( null, '', hash );
                }
                else {
                    window.history.replaceState( null, '', hash );
                }
            }
            catch ( e ) {
                window.console.log( e.message );
                window.console.log(
                    'Error: HashVars: Cannot push states to history object.'
                );
                isHistorySupported = false;
                setData( data, opts );
            }
        }
        else {
            window.location.hash = hash;
        }
    }

    function configure ( opts ) {
        if ( opts ) {
            if ( typeof opts.startingChar === 'string' ) {
                settings.startingChar = opts.startingChar;
            }
            if ( typeof opts.delimiterChar === 'string' ) {
                settings.delimiterChar = opts.delimiterChar;
            }
            if ( typeof opts.assignmentChar === 'string' ) {
                settings.assignmentChar = opts.assignmentChar;
            }
            settings.hideIfDefault = !!( opts.hideIfDefault );
            settings.useHistoryAPI = !!(
                opts.useHistoryAPI && isHistorySupported
            );
        }
        return settings;
    }

    //
    // Export
    //

    window.hashVars = {
        getData   : getData,
        setData   : setData,
        create    : create,
        get       : get,
        remove    : remove,
        configure : configure,
        settings  : settings
    };

} )( window, document );
