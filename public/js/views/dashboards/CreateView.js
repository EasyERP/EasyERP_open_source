define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/dashboards/CreateTemplate.html',
    'views/dialogViewBase',
    'models/CustomDashboardModel',
    'constants'
], function (Backbone, $, _, CreateTemplate, ParentView, Model, CONSTANTS) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: CONSTANTS.DASHBOARDS,
        template   : _.template(CreateTemplate),

        initialize: function () {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new Model();
            this.columnNumValue = 4;
            this.rowNumValue = 4;

            this.render();
        },

        events: {
            'click #colNumList li': 'setColumnNumValue',
            'click #rowNumList li': 'setRowNumValue'
        },

        setColumnNumValue: function (e) {
            var $el = $(e.target);
            var $columnList = this.$el.find('#colNumList li');

            if (!$el.hasClass('active')) {
                $columnList.removeClass('active');
                $el.addClass('active');

                this.columnNumValue = $el.attr('data-id');
                this.writeGrid();
            }
        },

        setRowNumValue: function (e) {
            var $el = $(e.target);
            var $rowList = this.$el.find('#rowNumList li');

            if (!$el.hasClass('active')) {
                $rowList.removeClass('active');
                $el.addClass('active');

                this.rowNumValue = $el.attr('data-id');
                this.writeGrid();
            }
        },

        writeGrid: function () {
            var $gridView = this.$el.find('#gridView');

            var innerRowElements = '';
            var domEl = '<span></span>';
            var colElList = '';
            var rowElList;
            var colNumValue = this.columnNumValue;
            var rowNumValue = this.rowNumValue;

            function generateGrid() {
                for (var i = 0; i < colNumValue; i++) {
                    innerRowElements += domEl;
                }

                rowElList = '<li>' + innerRowElements +'</li>';

                for (var j = 0; j < rowNumValue; j++) {
                    colElList += rowElList;
                }
            }

            generateGrid();

            $gridView.html(colElList);
        },

        saveItem: function () {
            var self = this;
            var $thisEl = this.$el;
            var columns =  this.columnNumValue;
            var rows = this.rowNumValue;
            var name = $.trim($thisEl.find('#name').val()) || 'New Dashboard';
            var description = $.trim($thisEl.find('#description').val());
            var access = $thisEl.find('#publicAccess').prop('checked');

            this.model.save({
                name        : name,
                rows        : rows,
                columns     : columns,
                description : description,
                publicAccess: access
            }, {

                success: function () {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }

            });
        },

        render: function () {
            var self = this;
            var formString = this.template();

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Company',
                width      : '820',
                buttons    : [
                    {
                        text : 'Create',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                        }
                    },

                    {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                ]
            });

            this.writeGrid();

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
