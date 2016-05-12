define([], function () {
    'use strict';

    return function ($targetEl) {
        var isDay = $targetEl.hasClass('autoCalc');
        var content = $targetEl.attr('data-content');
        var insertedInput = $targetEl.find('input');
        var $tr = $targetEl.closest('tr');
        var isMonth = content === 'month';
        var isOvertime = $tr.hasClass('overtime');
        var maxlength;
        var maxValue;

        if (isMonth || isDay) {
            maxlength = 2;

            if (isMonth) {
                maxValue = 12;
            } else {
                if (isOvertime) {
                    maxValue = 24;
                } else {
                    maxValue = 8;
                    maxlength = 1;
                }

            }
            insertedInput.attr('maxLength', maxlength);
        }

        insertedInput.keyup(function (e) {
            if (insertedInput.val() > maxValue) {
                if (isDay && !isOvertime) {
                    App.render({
                        type   : 'error',
                        message: 'Сreate Overtime tCard for input more than 8 hours'
                    });
                }
                e.preventDefault();
                insertedInput.val('' + maxValue);
            }
        });
    };
});
