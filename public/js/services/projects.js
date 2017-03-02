define([
    'jQuery',
    'Underscore',
    'text!templates/stages.html'
], function ($, _, stagesTamplate) {
    function chooseHealthDd(e) {
        var self = this;
        var target$ = $(e.target);
        var $target = target$.parents('.health-wrapper');
        var currTargetHealth = target$.attr('class').replace('health', '');
        var id;
        var health = parseInt(currTargetHealth, 10);
        var model;

        if (this.viewType === 'thumbnails') {
            id = $target.parents('.thumbnail').attr('id');
        } else {
            id = $target.attr('data-id');
        }

        model = this.collection.get(id);
        $target.find('.health-container a').attr('class', target$.attr('class')).attr('data-value', currTargetHealth);

        model.save({health: health}, {
            headers: {
                mid: 39
            },

            patch   : true,
            validate: false,
            success : function () {
                self.hideHealth();
            }
        });
    }

    function showHealthDd(e) {
        $(e.target).parents('.health-wrapper').find('ul').toggle();

        return false;
    }

    function showNewSelect(e) {
        if ($('.newSelectList').is(':visible')) {
            this.hideHealth();
            return false;
        }
        $(e.target).parent().append(_.template(stagesTamplate, {stagesCollection: this.stages}));

        return false;
    }

    function chooseOption(e) {
        var self = this;
        var $targetElement = $(e.target);
        var $idContainer;
        var id;
        var model;

        if (this.viewType === 'thumbnails') {
            $idContainer = $targetElement.parents('.thumbnail');
        } else {
            $idContainer = $targetElement.parents('td');
        }

        id = $idContainer.attr('id');
        model = this.collection.get(id);
        model.save({workflow: $targetElement.attr('id')}, {
            headers: {
                mid: 39
            },

            patch   : true,
            validate: false,
            success : function () {
                self.showFilteredPage(self.filter);
            }
        });

        this.hide(e);

        return false;
    }

    function hideHealth() {
        var $thisEl = this.$el;

        $thisEl.find('.health-wrapper').removeClass('open');
        $thisEl.find('.newSelectList').remove();
    }

    return {
        chooseHealthDd: chooseHealthDd,
        showHealthDd  : showHealthDd,
        chooseOption  : chooseOption,
        hideHealth    : hideHealth
    };
});
