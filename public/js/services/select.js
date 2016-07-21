define([
    'jQuery',
    'Underscore',
    'text!templates/stages.html'
], function ($, _, stagesTamplate) {
    function showStageSelect(e) {
        var $targetEl = $(e.target);
        var $parentEl = $targetEl.parent();
        var $existingSelect = $parentEl.find('ul.newSelectList');

        e.stopPropagation();
        e.preventDefault();

        if ($('.newSelectList').is(':visible')) {
            if ('hideHealth' in this) {
                this.hideHealth();
            }

            return false;
        }
        $existingSelect.replaceWith(_.template(stagesTamplate, {stagesCollection: this.stages}));

        return false;
    }

    function removeNewSelect(e) {
        $('.newSelectList').remove();
    }

    return {
        showStageSelect: showStageSelect,
        removeNewSelect: removeNewSelect
    };
});
