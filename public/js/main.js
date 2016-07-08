var App = App || {
        File: {
            MAXSIZE           : 10485760, // size in kilobytes  = 3 MB
            MaxFileSizeDisplay: '10 MB'
        },

        requestedURL: null,
        savedFilters: {}
    };

require.config({
    // baseUrl: '../public',
    
    paths: {
        async        : './libs/async/lib/async',
        jQuery       : './libs/jquery-2.1.0.min.map',
        ajaxForm     : './libs/jquery.form',
        imageCrop    : './libs/jquery.Jcrop.min',
        jqueryui     : './libs/jquery-ui.min',
        spinJs       : './libs/spin.js/spin',
        ladda        : './libs/spin.min',
        Underscore   : './libs/underscore-min.map.1.6.0',
        Backbone     : './libs/backbone-min.map.1.1.2',
        less         : './libs/less.min',
        templates    : '../templates',
        text         : './libs/text',
        common       : 'common',
        helpers      : 'helpers',
        constants    : 'constants',
        constantsDir : './constants',
        dateFormat   : './libs/date.format',
        d3           : './libs/d3.v3.min',
        jqueryBarcode: './libs/jquery-barcode.min',
        moment       : './libs/moment/moment',
        socketio     : '/socket.io/socket.io.js',
        backstratch  : './libs/jquery-backstretch/jquery.backstretch.min'
    },

    shim: {
        Underscore: {
            exports: '_'
        },

        jQuery: {
            exports: '$'
        },

        jqueryui   : ['jQuery'],
        ajaxForm   : ['jQuery'],
        imageCrop  : ['jQuery'],
        spinJs     : ['jQuery'],
        backstratch: ['jQuery'],
        Backbone   : ['Underscore', 'jQuery'],
        app        : ['Backbone', 'less', 'jqueryui', 'ajaxForm', 'imageCrop', 'd3', 'backstratch'],
        d3         : {
            exports: 'd3'
        },

        dateFormat: {
            exports: 'dateFormat'
        }
    }
});

require(['Backbone', 'jQuery', 'app'], function (Backbone, $, app) {

    App.render = function (data) {
        var container = this.errorContainer || $('#errorHandler');
        var messageClass = data.type || 'error';
        var text = data.message || 'Something went wrong';
        var renderEl = '<div class="animate ' + messageClass + '">' + text + '</div>';

        container.append(renderEl);

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

    Backbone.Collection.prototype.getElement = function (id) {
        return id ? this.get(id) : ((this.currentElement) ? this.currentElement : this.at(0));
    };

    Backbone.Collection.prototype.setElement = function (id, model) {
        if (arguments.length === 0) {
            this.currentElement = this.at(0);
        } else if (arguments.length === 2) {
            if (model) {
                this.currentElement = model;
            } else if (id) {
                this.currentElement = this.get(id);
            }
        } else {
            if ((typeof (id) === 'string') && id.length === 24) {
                this.currentElement = this.get(id);
            } else if (typeof (id) === 'object') {
                this.currentElement = id;
            }
        }

    };

    Backbone.View.prototype.errorNotification = function (xhr) {
        if (xhr) {
            if (xhr.status === 401 || xhr.status === 403) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('login', {trigger: true});
                } else {
                    App.render({
                        type   : 'error',
                        message: 'You do not have permission to perform this action.'
                    });
                }
            } else {
                if (xhr.responseJSON) {
                    alert(xhr.responseJSON.error);
                } else {
                    Backbone.history.navigate('home', {trigger: true});
                }
            }
        }
    };

    Date.prototype.getWeek = function () {
        // Create a copy of this date object
        var target = new Date(this.valueOf());
        var firstThursday;
        // ISO week date weeks start on monday
        // so correct the day number
        var dayNr = (this.getDay() + 6) % 7;

        // ISO 8601 states that week 1 is the week
        // with the first thursday of that year.
        // Set the target date to the thursday in the target week
        target.setDate(target.getDate() - dayNr + 3);

        // Store the millisecond value of the target date
        firstThursday = target.valueOf();

        // Set the target to the first thursday of the year
        // First set the target to january first
        target.setMonth(0, 1);
        // Not a thursday? Correct the date to the next thursday
        if (target.getDay() !== 4) {
            target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        }

        // The weeknumber is the number of weeks between the
        // first thursday of the year and the thursday in the target week
        return 1 + Math.ceil((firstThursday - target) / 604800000); // 604800000 = 7 * 24 * 3600 * 1000
    };

    app.initialize();
    app.applyDefaults();
});
