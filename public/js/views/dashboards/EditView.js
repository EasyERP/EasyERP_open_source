define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/dashboards/EditTemplate.html',
    'views/dialogViewBase',
    'models/CustomDashboardModel',
    'constants'
], function (Backbone, $, _, EditTemplate, ParentView, Model, CONSTANTS) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: CONSTANTS.DASHBOARDS,
        template   : _.template(EditTemplate),

        initialize: function (options) {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new Model(options.model);
            this.columnNumValue = options.model.columns;
            this.rowNumValue = options.model.rows;
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
            var self = this;
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

            function setActive() {
                var activeCol = self.$el.find('#colNumList li.active').attr('data-id');
                var activeRow = self.$el.find('#rowNumList li.active').attr('data-id');

                if (activeCol !== self.columnNumValue) {
                    self.$el.find('#colNumList li').removeClass('active');
                    self.$el.find('#colNumList li[data-id="' + self.columnNumValue + '"]').addClass('active');
                }

                if (activeRow !== self.rowNumValue) {
                    self.$el.find('#rowNumList li').removeClass('active');
                    self.$el.find('#rowNumList li[data-id="' + self.rowNumValue + '"]').addClass('active');
                }
            }
            
            generateGrid();
            setActive();

            $gridView.html(colElList);
        },

        saveItem: function () {
            var self = this;
            var $thisEl = this.$el;
            var name = $.trim($thisEl.find('#name').val()) || 'New Dashboard';
            var columns =  this.columnNumValue;
            var rows = this.rowNumValue;
            var description = $.trim($thisEl.find('#description').val());
            var access = $thisEl.find('#publicAccess').prop('checked');
            var data = {
                name        : name,
                rows        : rows,
                columns     : columns,
                description : description,
                publicAccess: access
            };

            this.model.set(data);

            this.model.save(this.model.changed, {
                patch: true,
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
            var formString = this.template({model: this.model.toJSON()});

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Company',
                width      : '820',
                buttons    : [
                    {
                        text : 'Save',
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
