define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/resolveConflicts/contentTemplate.html',
    'dataService'
], function (Backbone, $, _, ListViewBase, contentTemplate, dataService) {
    'use strict';

    var resolveListView = ListViewBase.extend({
        el           : '#resolveConflicts',
        viewType     : 'list',
        responseObj  : {},
        changedModels: {},
        hasPagination: true,

        initialize: function (options) {
            $(document).off('click');

            _.bindAll(this, 'saveItem');

            this.startTime = options.startTime;
            this.filter = options.filter;

            this.render();
        },

        events: {
            'click .stageSelect'    : 'showNewSelect',
            'click td.editable'     : 'editRow',
            'click tbody .item'     : 'checkItem',
            'click .allTable'       : 'toggleOpen',
            'click .actionAll'      : 'actionAll',
            'click #resolve-saveBtn': 'saveItem'
        },

        toggleOpen: function (e) {
            $(e.target).closest('.changeTableCombobox').toggleClass('open');
        },

        checked: function (e) {
            e.stopPropagation();
        },

        checkItem: function (e) {
            var $target = $(e.target);
            var $parent = $target.closest('.changeTableCombobox');

            $parent.find('.item').removeClass('active');
            $target.addClass('active');
            $parent.toggleClass('open');
        },

        actionAll: function (e) {
            var $checkedItems = this.$el.find(':checked:not(#checkAll)');
            var action = $(e.target).attr('data-action');

            if (!$checkedItems.length) {
                $checkedItems = this.$el.find('.list tbody tr');
            }

            $checkedItems.each(function () {
                var $tr = $(this).closest('tr');
                $tr.find('.active').removeClass('active');
                $tr.find('[data-action="' + action + '"]').addClass('active');
            });
        },

        saveItem: function () {
            var $actions = this.$el.find('div[data-sku]');
            var url = 'integration/conflicts';
            var data = [];

            $actions.each(function () {
                data.push({
                    action : $(this).find('.active').attr('data-action'),
                    sku    : $(this).attr('data-sku'),
                    channel: $(this).attr('data-channel')
                });
            });

            dataService.postData(url, {conflicts: data}, function () {
                Backbone.history.fragment = '';
                Backbone.history.navigate('#easyErp/integrations', {trigger: true});
            });
        },

        goSort: function (e) {
            var $target = $(e.target);
            var $currentEl = this.$el;
            var sortBy = $target.data('sort');
            var sortObject = {field: [sortBy]};
            var query = {};
            var sortClass;
            var sortConst;
            var sortIcon;

            if ($target.hasClass('sortDn')) {
                sortClass = 'sortDn';
            } else {
                sortClass = 'sortUp';
            }

            switch (sortClass) {
                case 'sortDn':
                    sortIcon = 'sortUp';
                    sortConst = ['asc'];
                    break;
                case 'sortUp':
                    sortIcon = 'sortDn';
                    sortConst = ['desc'];
                    break;
                // skip default case
            }

            sortObject.value = sortConst;

            query.sortObject = sortObject;
            query.filter = this.filter;

            dataService.getData('/integration/conflicts', query, function (result) {
                $currentEl.html(_.template(contentTemplate, {
                    conflictItems: result,
                    sortClass    : sortIcon
                }));
            });
        },

        render: function () {
            var $currentEl = this.$el;
            var query = {
                filter: this.filter
            };

            dataService.getData('/integration/conflicts', query, function (result) {
                $currentEl.html(_.template(contentTemplate, {
                    conflictItems: result,
                    sortClass    : 'sortUp'
                }));
            });

            return this;
        }
    });

    return resolveListView;
});

