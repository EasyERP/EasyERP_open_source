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

        if ($existingSelect.is(':visible')) { // add in case of click to same select
            if ('hideHealth' in this) {
                this.hideHealth();
            }

            return false;
        }

        if ($('.newSelectList').is(':visible')) { // add in case of click to another select
            if ('hideHealth' in this) {
                this.hideHealth();
            }

            // return false;
        }

        $targetEl.append(_.template(stagesTamplate, {stagesCollection: this.stages}));

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
