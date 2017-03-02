define([
    'Backbone',
    'jQuery',
    'Underscore',
    'spinJs',
    'services/stringExtender',
    'services/backboneExtender',
    'services/dateExtender'
], function (Backbone,
             $,
             _,
             Spinner,
             stringExtender,
             backboneExtender,
             dateExtender) {

    function spinerConfig() {
        var opts = {
            lines    : 17, // The number of lines to draw
            length   : 30, // The length of each line
            width    : 5, // The line thickness
            radius   : 30, // The radius of the inner circle
            scale    : 0.75, // Scales overall size of the spinner
            corners  : 1, // Corner roundness (0..1)
            color    : '#fff', // #rgb or #rrggbb or array of colors
            opacity  : 0.25, // Opacity of the lines
            rotate   : 68, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            speed    : 1.6, // Rounds per second
            trail    : 89, // Afterglow percentage
            fps      : 20, // Frames per second when using setTimeout() as a fallback for CSS
            zIndex   : 2000000000, // The z-index (defaults to 2000000000)
            className: 'spinner', // The CSS class to assign to the spinner
            top      : '50%', // Top position relative to parent
            left     : '50%', // Left position relative to parent
            shadow   : true, // Whether to render a shadow
            hwaccel  : false, // Whether to use hardware acceleration
            position : 'absolute' // Element positioning
        };
        var target = document.getElementById('loading');
        var spinner = new Spinner(opts).spin(target);

        $(document).ajaxStart(function () {
            $(target).fadeIn();
        });

        $(document).ajaxComplete(function () {
            if (!App.preloaderShowFlag) {
                $(target).fadeOut();
            }
        });
    }

    function dialogConfig() {
        $.extend($.ui.dialog.prototype.options, {
            modal    : true,
            resizable: false,
            draggable: true,
            autoOpen : true,
            width    : 700,
            appendTo : '#dialogContainer',

            create: function (event, ui) {
                var win = $(window);
                var dialog = $(event.target).parent('.ui-dialog');
                // var top = $(document).scrollTop() + (win.height() - dialog.height() - 200) / 2; //8.7.16(Pogorilyak)
                var top = (win.height() - dialog.height() ) / 2;
                var left = (win.width() - dialog.width()) / 2;

                dialog.css({
                    position: 'absolute',
                    top     : top,
                    left    : left
                });
            }
        });
    }

    function dataPickerConfig() {
        $.datepicker.setDefaults({
            dateFormat: 'd M, yy',

            onChangeMonthYear: function (year, month) {
                var mon;
                var target;
                var day;

                switch (month) {
                    case 1:
                        mon = 'Jan';
                        break;
                    case 2:
                        mon = 'Feb';
                        break;
                    case 3:
                        mon = 'Mar';
                        break;
                    case 4:
                        mon = 'Apr';
                        break;
                    case 5:
                        mon = 'May';
                        break;
                    case 6:
                        mon = 'Jun';
                        break;
                    case 7:
                        mon = 'Jul';
                        break;
                    case 8:
                        mon = 'Aug';
                        break;
                    case 9:
                        mon = 'Sep';
                        break;
                    case 10:
                        mon = 'Oct';
                        break;
                    case 11:
                        mon = 'Nov';
                        break;
                    case 12:
                        mon = 'Dec';
                        break;
                    // skip default;
                }

                target = $(this);
                day = target.val().split(' ')[0] || '01';
                target.val(day + ' ' + mon + ', ' + year);
            }
        });
    }

    function applyDefaults() {
        spinerConfig();
        dialogConfig();
        dataPickerConfig();
        dateExtender.apply();
        stringExtender.apply();
        backboneExtender.apply();
    }

    return {
        applyDefaults: applyDefaults
    };
});
