/**
 * Created by liliya on 20.07.15.
 */
define([
    "common",
    "custom",
    "dataService",
    "populate",
    'constants'
], function (common, Custom, dataService, populate, CONSTANTS) {

    var EditView = Backbone.View.extend({
        contentType: CONSTANTS.CUSTOMERPAYMENTS,

        initialize: function (options) {
            if (options) {
                this.visible = options.visible;
            }

            _.bindAll(this, "render", "saveItem");

            this.currentModel = (options.model) ? options.model : options.collection.getElement();
            this.currentModel.urlRoot = "/customerPayments";
            this.responseObj = {};
            this.render(options);
        },

        events: {
            'keydown': 'keyDown',
            'click .dialog-tabs a': 'changeTab',
            "click .current-selected": "showNewSelect",
            "click": "hideNewSelect",
            "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
            "click .newSelectList li.miniStylePagination": "notHide",
            "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect"
        },

        saveItem: function () {
            var self = this;
            var mid = 60;
            var thisEl = this.$el;

            var date = thisEl.find('#date').val();

            this.model.save({
                date:date

            }, {
                headers: {
                    mid: mid
                },
                wait: true,
                success: function () {
                    self.hideDialog();
                    Backbone.history.navigate("easyErp/customerPayments/list", {trigger: true});
                },
                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }

            });
        },

        nextSelect: function (e) {
            this.showNewSelect(e, false, true);
        },

        notHide: function () {
            return false;
        },

        chooseOption: function (e) {
                var holder = $(e.target).parents("dd").find(".current-selected");
                holder.text($(e.target).text()).attr("data-id", $(e.target).attr("id"));
            },

        hideNewSelect: function () {
            $(".newSelectList").hide();
        },

        showNewSelect: function (e, prev, next) {
            populate.showSelect(e, prev, next, this);

            return false;
        },

        changeTab: function (e) {
            var holder = $(e.target);
            var dialog_holder;
            var closestEl = holder.closest('.dialog-tabs');
            var dataClass = closestEl.data('class');
            var selector = '.dialog-tabs-items.' + dataClass;
            var itemActiveSelector = '.dialog-tabs-item.' + dataClass + '.active';
            var itemSelector = '.dialog-tabs-item.' + dataClass;
            var n;

            closestEl.find("a.active").removeClass("active");
            holder.addClass("active");

            n = holder.parents(".dialog-tabs").find("li").index(holder.parent());
            dialog_holder = $(selector);

            dialog_holder.find(itemActiveSelector).removeClass("active");
            dialog_holder.find(itemSelector).eq(n).addClass("active");
        },


        keyDown: function (e) {
            switch (e.which) {
                case 27:
                    this.hideDialog();
                    break;
                default:
                    break;
            }
        },

        render: function () {
            var formString = this.template({
                model: this.currentModel.toJSON(),
                visible: this.visible
            });

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen: true,
                resizable: true,
                dialogClass: "edit-dialog",
                title: "Edit bonusType",
                width: "900px",
                buttons: [
                    {
                        text: "Save",
                        click: function () {
                            self.saveItem();
                        }
                    },
                    {
                        text: "Cancel",
                        click: function () {
                            self.hideDialog();
                        }
                    }
                ]

            });

            this.delegateEvents(this.events);
            model = this.currentModel.toJSON();

            return this;
        },

        hideDialog: function () {
            $(".edit-dialog").remove();
            $(".add-group-dialog").remove();
            $(".add-user-dialog").remove();
        }

    });

    return EditView;
});
