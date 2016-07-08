define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Opportunities/kanban/KanbanItemTemplate.html',
    'views/selectView/selectView',
    'moment',
    'helpers',
    'populate',
    'constants',
    'dataService'
], function (Backbone, $, _, KanbanItemTemplate, selectView, moment, helpers, populate, CONSTANTS, dataService) {
    'use strict';

    var OpportunitiesItemView = Backbone.View.extend({
        className: 'item',
        template : _.template(KanbanItemTemplate),
        id       : function () {
            return this.model.get('_id');
        },

        initialize: function (options) {
            this.date = moment(new Date());

            this.responseObj = {};

            this.render(options);
        },

        events: {
            'click .current-selected:not(.disabled)'                          : 'showNewSelect',
            'click .newSelectList li:not(.miniStylePagination):not(.disabled)': 'chooseOption'
        },

        showNewSelect: function (e) {
            var $target = $(e.target);

            e.stopPropagation();

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            this.selectView = new selectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);
            

            return false;
        },

        chooseOption: function (e) {
            var id;
            var data;
            var $target = $(e.target);

            $('.newSelectList').hide();

            id = $target.parents('.item').attr('id');
            data = {projectType: $target.text()};

            $target.parents('td').find('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

            dataService.patchData('/opportunities/' + id, data, function (err) {
                if (err) {
                    return console.log(err);
                }

            });
        },

        render: function () {
            this.$el.html(this.template(
                {
                    model           : this.model.toJSON(),
                    currencySplitter: helpers.currencySplitter
                }));

            if ((this.model.toJSON().workflow.status !== 'Done') && (this.model.toJSON().workflow.status !== 'Cancelled')) {
                if (this.model.toJSON().nextAction.date && moment(new Date(this.model.toJSON().nextAction.date)).isBefore(this.date)) {
                    this.$el.addClass('errorContent');
                }
            }

            populate.get('#projectTypeDD', CONSTANTS.URLS.PROJECT_TYPE, {}, 'name', this, false, true);

            return this;
        }
    });

    return OpportunitiesItemView;
});
