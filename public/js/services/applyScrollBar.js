define(['jQuery', 'Underscore'], function ($, _) {
    var basicOptions = {

    };

    function scrollExecuter($el, options) {
        options = options || {};
        options = _.extend(basicOptions, options);
        $el = $el || $({});

        if (typeof $el.nanoScroller !== 'function') {
            $el.nanoScroller = function () {
            };
        }

        $el.nanoScroller(options);
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

