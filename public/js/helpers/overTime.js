define([
    'jQuery',
    'helpers/elementDataManipulator'
], function ($, elementDataManipulator) {
    'use strict';
    return function (type, $tr) {
        var _elementDataManipulator = elementDataManipulator($tr);
        var newRow;
        var $overTime;
        var $days;
        var id;

        this.changedModels = this.changedModels || {};
        newRow = $tr || this.$el.find('.false');
        id = newRow.attr('data-id');

        if (!this.changedModels[id]) {
            this.changedModels[id] = {};
        }

        if (type === 'OT') {
            _elementDataManipulator.set('overTime', 'OR', $tr.clone());
            $overTime = _elementDataManipulator.get('overTime', 'OT');

            if ($overTime && $overTime.length) {
                $tr.html($overTime.html());
                $tr.find('.newSelectList').remove();
            }
            this.changedModels[id]._type = 'overtime';
            newRow.addClass('overtime');
        } else {
            _elementDataManipulator.set('overTime', 'OT', $tr.clone());
            $overTime = _elementDataManipulator.get('overTime', 'OR');

            if ($overTime) {
                $days = $overTime.find('.autoCalc');
            } else {
                $days = $tr.find('.autoCalc');
            }
            
            $days.each(function () {
                var $el = $(this);
                var content = $el.attr('data-content');
                var value = $el.text();

                value = parseInt(value, 10);
                value = isFinite(value) ? value : 0;

                if (content !== '6' || content !== '7') {
                    if (value > 8) {
                        value = 8;
                    }
                } else {
                    value = 0;
                }

                $el.text(value);
            });

            if ($overTime && $overTime.length) {
                $tr.html($overTime.html());
                $tr.find('.newSelectList').remove();
            }
            this.changedModels[id]._type = 'ordinary';
            newRow.removeClass('overtime');
        }
    };
});
