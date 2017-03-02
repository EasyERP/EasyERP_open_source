define(['jQuery', 'Underscore'], function ($, _) {
    var basicOptions = {
        autoHideScrollbar: true,
        /*scrollButtons    : {
         enable: true
         }*/
    };

    function scrollExecuter($el, options) {
        options = options || {};
        options = _.extend(basicOptions, options);
        $el = $el || $({});

        if (typeof $el.mCustomScrollbar !== 'function') {
            $el.mCustomScrollbar = function () {
            };
        }

        $el.mCustomScrollbar(options);
    }

    function applyTo(el, options) {
        var $el;

        if (typeof el === 'string') {
            $el = $(el);
        }

        $el = $el || $(el);

        return scrollExecuter.call(this, $el, options);
    }

    return {
        applyTo: applyTo
    };
});

