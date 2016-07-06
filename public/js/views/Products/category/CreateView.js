define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/settingsProduct/CreateTemplate.html',
    'models/Category',
    'common',
    'custom',
    'populate'
], function (Backbone, $, _, CreateTemplate, Model, common, Custom, populate) {

    var CreateView = Backbone.View.extend({
        el         : '#content-holder',
        contentType: 'Departments',
        template   : _.template(CreateTemplate),
        events     : {
            // 'keydown': 'keydownHandler'
        },

        initialize: function (options) {
            _.bindAll(this, 'saveItem', 'render');

            this.parentId = options._id || null;
            this.model = new Model();
            this.responseObj = {};
            this.render();
        },

        close: function () {
            this._modelBinder.unbind();
        },

        saveItem: function () {
            var thisEl = this.$el;
            var self = this;
            var mid = 39;
            var categoryName = $.trim(thisEl.find('#categoryName').val());
            var parentCategory = thisEl.find('#parentCategory').data('id') || null;
            var nestingLevel = thisEl.find('#parentCategory').data('level') || null;
            var fullName = thisEl.find('#parentCategory').data('fullname');
            var res = _.filter(this.responseObj['#parentCategory'], function (item) {
                return item.parentCategory === parentCategory;
            });

            if (fullName) {
                fullName += ' / ' + categoryName;
            } else {
                fullName = categoryName;
            }

            this.model.save(
                {
                    name        : categoryName,
                    parent      : parentCategory,
                    nestingLevel: ++nestingLevel,
                    sequence    : res.length,
                    fullName    : fullName
                },
                {
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function (model) {
                        Backbone.history.fragment = '';
                        Backbone.history.navigate('easyErp/Products', {trigger: true});
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
        },

        hideDialog: function () {
            $('.create-dialog').remove();
        },

        render: function () {
            var categoryUrl = '/category/' + this.parentId;
            var self = this;
            var formString = this.template({});

            this.$el = $(formString).dialog({
                autoOpen   : true,
                resizable  : true,
                dialogClass: 'create-dialog',
                width      : '900px',
                buttons    : [
                    {
                        text : 'Create',
                        click: function () {
                            self.saveItem();
                        }
                    },
                    {
                        text : 'Cancel',
                        click: function () {
                            self.hideDialog();
                        }
                    }]

            });

            populate.getParrentCategoryById('#parentCategory', categoryUrl, {}, this, true);

            this.delegateEvents(this.events);

            return this;
        }
    });

    return CreateView;
});
