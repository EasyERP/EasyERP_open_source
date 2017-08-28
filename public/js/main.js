var App = App || {
        File: {
            MAXSIZE           : 10485760, // size in kilobytes  = 3 MB
            MaxFileSizeDisplay: '10 MB'
        },

        requestedURL : null,
        savedFilters : {},
        filtersObject: {}
    };

require.config({
    // baseUrl: '../public',

    paths: {
        async          : './libs/async/lib/async',
        jQuery         : './libs/jquery-2.1.0.min.map',
        ajaxForm       : './libs/jquery.form',
        imageCrop      : './libs/jquery.Jcrop.min',
        jqueryui       : './libs/jquery-ui.min',
        spinJs         : './libs/spin.js/spin',
        ladda          : './libs/spin.min',
        Underscore     : './libs/underscore-min.map.1.6.0',
        Backbone       : './libs/backbone-min.map.1.1.2',
        templates      : '../templates',
        text           : './libs/text',
        common         : 'common',
        helpers        : 'helpers',
        constants      : 'constants',
        dateFormat     : './libs/date.format',
        d3             : './libs/d3.v3.min',
        topojson       : './libs/topojson.v0.min/index',
        jqueryBarcode  : './libs/jquery-barcode.min',
        malihuScrollBar: './libs/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar',
        moment         : './libs/moment/moment',
        socketio       : '/socket.io/socket.io.js',
        backstratch    : './libs/jquery-backstretch/jquery.backstretch.min',
        wickedpicker   : './libs/wickedpicker/dist/wickedpicker.min',
        bxSlider       : './libs/bxslider-4/dist/jquery.bxslider.min',
        dragtable      : './libs/dragtable/jquery.dragtable',
        gapi           : '//apis.google.com/js/platform'
        //inbound_rocket : './libs/inboundrocket-tracking.min'
    },

    shim: {
        Underscore: {
            exports: '_'
        },

        jQuery: {
            exports: '$'
        },

        Backbone: ['Underscore', 'jQuery'],

        jqueryui       : ['jQuery'],
        malihuScrollBar: ['jQuery'],
        ajaxForm       : ['jQuery'],
        imageCrop      : ['jQuery'],
        spinJs         : ['jQuery'],
        backstratch    : ['jQuery'],
        wickedpicker   : ['jQuery'],
        bxSlider       : ['jQuery'],
        gapi           : {
            exports: 'gapi'
        },

        dragtable: ['jQuery', 'jqueryui'],
        // inbound_rocket: ['jQuery'],

        d3: {
            exports: 'd3'
        },

        topojson: {
            deps   : ['d3'],
            exports: 'topojson'
        },

        dateFormat: {
            exports: 'dateFormat'
        },

        app: ['Backbone', 'jqueryui', 'ajaxForm', 'imageCrop', 'd3', 'backstratch', 'topojson', 'wickedpicker', 'malihuScrollBar', 'bxSlider', 'dragtable', 'gapi' /*'inbound_rocket'*/]
    }
});

require(['Backbone', 'jQuery', 'app'], function (Backbone, $, app) {

    App.render = function (data) {
        var container = this.errorContainer || $('#errorHandler');
        var messageClass = data.type || 'error';
        var text = data.message || 'Something went wrong';
        var renderEl = '<div class="animate ' + messageClass + '">' + text + '</div>';

        container.append(renderEl);

        if (messageClass === 'error') {
            // FlurryAgent.logError('Error', text);
        }

        container.find('div.animate').delay(10).animate({
            left   : '84%',
            opacity: 1
        }, 500, function () {
            var self = $(this);

            self.removeClass('animate').delay(5000).animate({
                left   : '100%',
                opacity: 0
            }, 1000, function () {
                self.remove();
            });
        });
    };

    gapi.load('auth', function () {
        /*auth2 = gapi.auth2.init({
         client_id: '34449104416-ks7ifq1re2kgoapmeklqvoc6s19tv8tn.apps.googleusercontent.com',
         scope    : 'profile'
         });*/
    });

    app.initialize();
});
