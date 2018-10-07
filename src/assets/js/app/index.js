/**
 * Flag Waver
 *
 * Simulate a flag waving in the breeze right in your browser window.
 *
 * /u/krikienoid
 *
 */

import HashState, { isHistorySupported } from './helpers/HashState';
import initFlagWaverApp from './main';

var app;

//
// Flag Waver UI
//

;(function (window, document, $, rivets, undefined) {
    //
    // Vars
    //

    // DOM elements
    var $controlImgUpload;
    var $setImgUploadMode;
    var $inputImgLink;
    var $setImgLink;
    var $setHoisting;
    var $setTopEdge;
    var $openImgFile;
    var $infoImgFile;
    var $windToggle;

    // Settings
    var flagWaverDefaults = {
        isWindOn: true,
        flag: {
            imgUploadMode: 'web',
            imgURL:        '',
            imgFilePath:   '',
            hoisting:      'dexter',
            topEdge:       'top'
        }
    };

    var flagWaverOpts = $.extend(true, {}, flagWaverDefaults);

    var flagWaverControls = {
        toggleWind: function () {
            flagWaverOpts.isWindOn = !flagWaverOpts.isWindOn;

            if (flagWaverOpts.isWindOn) {
                setWind(200);
            } else {
                setWind(0.001);
            }
        },
        flag: {
            setImgUploadMode: function () {
                if (flagWaverOpts.flag.imgUploadMode === 'web') {
                    $controlImgUpload
                        .removeClass('upload-mode-file')
                        .addClass('upload-mode-web')
                        .append($('.input-img-web'));
                } else if (flagWaverOpts.flag.imgUploadMode === 'file') {
                    $controlImgUpload
                        .removeClass('upload-mode-web')
                        .addClass('upload-mode-file')
                        .append($('.input-img-file'));
                }
            },
            setImgURL: function () {
                flagWaverOpts.flag.imgFilePath = '';

                if (flagWaverOpts.flag.imgURL) {
                    setFlagOpts({ imgSrc: flagWaverOpts.flag.imgURL });
                    toHash();
                }
            },
            setImgFile: function () {
                var file = this.files[0];
                var reader = new window.FileReader();

                flagWaverOpts.flag.imgFilePath = this.value;

                reader.onload = function (e) {
                    flagWaverOpts.flag.imgURL = '';
                    setFlagOpts({ imgSrc: e.target.result });
                    toHash();
                };

                reader.readAsDataURL(file);
            },
            setHoisting: function () {
                setFlagOpts({ hoisting: flagWaverOpts.flag.hoisting });
                toHash();
            },
            setTopEdge: function () {
                setFlagOpts({ topEdge: flagWaverOpts.flag.topEdge });
                toHash();
            }
        }
    };

    var flagWaverModel = {
        flagWaverOpts: flagWaverOpts,
        flagWaverControls: flagWaverControls
    };

    var hashState = new HashState({
        'src': {
            defaultValue: '',
            parse: value => decodeURIComponent(value),
            stringify: value => encodeURIComponent(value)
        },
        'hoisting': {
            defaultValue: 'dexter',
            parse: (string) => {
                if (string.match(/^dex(ter)?$/gi)) {
                    return 'dexter';
                } else if (string.match(/^sin(ister)?$/gi)) {
                    return 'sinister';
                }
            },
            stringify: value => 'sin'
        },
        'topedge': {
            defaultValue: 'top',
            parse: (string) => {
                if (string.match(/^(top|right|bottom|left)$/gi)) {
                    return string.toLowerCase();
                }
            }
        }
    });

    //
    // Functions
    //

    function setFlagOpts(flagData) {
        app.module('flagGroupModule').flag.setOptions(flagData);
    }

    function setWind(value) {
        app.module('windModule').setOptions({ speed: value });
        app.module('windForceModule').needsUpdate = true;
    }

    function fromHash() {
        var hashFrag = window.location.hash.split('#')[1];
        var flagOpts = {};
        var flagData;

        if (hashFrag) {
            if (window.location.href.search(/\#(\!|\?)/) >= 0) {
                flagData = hashState.getState();

                flagOpts.imgURL   = flagData.src;
                flagOpts.hoisting = flagData.hoisting;
                flagOpts.topEdge  = flagData.topedge;
            } else {
                // Compatibility with old version links
                flagOpts.imgURL = window.unescape(hashFrag);
            }
        }

        $.extend(flagWaverOpts.flag, flagWaverDefaults.flag, flagOpts);

        setFlagOpts({
            imgSrc: flagWaverOpts.flag.imgURL || './assets/img/NZ.2b.png',
            topEdge: flagWaverOpts.flag.topEdge,
            hoisting: flagWaverOpts.flag.hoisting
        });
    }

    function toHash() {
        if (flagWaverOpts.flag.imgURL) {
            hashState.setState({
                src:      flagWaverOpts.flag.imgURL,
                hoisting: flagWaverOpts.flag.hoisting,
                topedge:  flagWaverOpts.flag.topEdge
            });
        } else {
            hashState.setState(null);
        }
    }

    function updateExpander($expander) {
        var $expandable = $($expander.data('target'));

        if ($expandable.hasClass('expanded')) {
            $expander
                .removeClass('closed')
                .addClass('open')
                .val($expander.data('text-expanded'))
                .attr('aria-expanded', 'true');

            $expandable.attr('aria-hidden', 'false');
        } else {
            $expander
                .removeClass('open')
                .addClass('closed')
                .val($expander.data('text-collapsed'))
                .attr('aria-expanded', 'false');

            $expandable.attr('aria-hidden', 'true');
        }
    }

    //
    // Rivets.js configuration
    //

    rivets.configure({
        prefix:             'data-rv',
        preloadData:        true,
        rootInterface:      '.',
        templateDelimiters: ['{', '}']
    });

    rivets.formatters.onoff = function (value, onText, offText) {
        return (value) ? onText || 'On' : offText || 'Off';
    };

    rivets.formatters.fileName = function (value, defaultText) {
        return (value) ? value.split('\\').pop() : defaultText || '';
    };

    //
    // Init
    //

    $(document).ready(function () {
        //
        // Get DOM elements
        //

        $controlImgUpload = $('#control-img-upload');
        $setImgUploadMode = $('#set-img-upload-mode');
        $inputImgLink     = $('#input-img-link');
        $setImgLink       = $('#set-img-link');
        $setHoisting      = $('#set-hoisting');
        $setTopEdge       = $('#set-top-edge');
        $openImgFile      = $('#open-img-file');
        $infoImgFile      = $('#info-img-file');
        $windToggle       = $('#wind-toggle');

        //
        // Init
        //

        // Init flagWaver and append renderer to DOM
        app = initFlagWaverApp();
        window.FW_App = app;
        $('.js-flag-canvas').append(app.renderer.domElement);
        window.dispatchEvent(new window.Event('resize'));

        // Load settings from hash vars on page load
        fromHash();

        //
        // Bind event handlers
        //

        // UI controls

        // Expander control
        $('input[type="button"].expander')
            .on('click', function () {
                var $this = $(this);
                $($this.data('target')).toggleClass('expanded');
                updateExpander($this);
            })
            .each(function () {
                updateExpander($(this));
            });

        // Select file loading mode
        rivets.bind($setImgUploadMode, flagWaverModel);
        $setImgUploadMode.trigger('change');

        // Load flag image

        // Load flag image from hash on user entered hash
        if (isHistorySupported) {
            $(window).on('popstate', fromHash);
        }

        // Load flag image from url
        rivets.bind($inputImgLink, flagWaverModel);
        rivets.bind($setImgLink,   flagWaverModel);

        // Load flag image from file
        $openImgFile
            .on('focus', function () {
                $openImgFile.parent().addClass('active');
            })
            .on('blur', function () {
                $openImgFile.parent().removeClass('active');
            });

        rivets.bind($openImgFile, flagWaverModel);
        rivets.bind($infoImgFile, flagWaverModel);

        // Settings
        rivets.bind($windToggle,  flagWaverModel);
        rivets.bind($setHoisting, flagWaverModel);
        rivets.bind($setTopEdge,  flagWaverModel);
    });
})(window, document, jQuery, rivets);
