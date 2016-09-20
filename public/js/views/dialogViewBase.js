define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/Assignees/AssigneesView',
    'views/selectView/selectView',
    'helpers/exportToPdf'
], function (Backbone, $, _, AssigneesView, SelectView, exportToPdf) {
    'use strict';

    var View = Backbone.View.extend({

        events: {
            keydown                                                          : 'keyDownHandler',
            click                                                            : 'hideNewSelect',
            'click .dialog-tabs a'                                           : 'changeTab',
            'click .current-selected:not(.jobs)'                             : 'showNewSelect',
            'click #exportToPdf'                                             : 'exportToPdf',
            'click .newSelectList li:not(.miniStylePagination, .endContract)': 'chooseOption'
        },

        showEdit: function () {
            this.$el.find('.upload').animate({
                height : '20px',
                display: 'block'
            }, 250);

        },

        hideEdit: function () {
            this.$el.find('.upload').animate({
                height : '0px',
                display: 'block'
            }, 250);

        },

        exportToPdf : function(e){
            var template = this.$el.find('#templateDiv').html();
            exportToPdf({file : template, name : this.model.get('name')});
        },

        showDetailsBox: function (e) {
            $(e.target).parent().find('.details-box').toggle();
        },

        toggleDetails: function () {
            $('#details-dialog').toggle();
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

            this.selectView = new SelectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

            return false;
        },

        hideNewSelect: function () {
            var editingDates = this.$el.find('td.date');

            editingDates.each(function () {
                $(this).text($(this).find('input').val());
            });

            this.$el.find('.newSelectList').hide();

            if (typeof this.hideHealth === 'function') {
                this.hideHealth();
            }

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        keyDownHandler: function (e) {
            switch (e.which) {
                case 27:
                    this.hideDialog();
                    break;
                /* case 13:
                 this.validateForm(e);
                 break;*/
                default:
                    break;
            }
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
            $('.add-group-dialog').remove();
            $('.add-user-dialog').remove();
            $('.crop-images-dialog').remove();
            $('.edit-invoice-dialog').remove();
            $('.edit-companies-dialog').remove();
            $('.create-dialog').remove();
        },

        changeTab: function (e) {
            var $target = $(e.target);
            var n;
            var dialogHolder;
            var closestEl = $target.closest('.dialog-tabs');
            var dataClass = closestEl.data('class') ? '.' + closestEl.data('class') : '';
            var selector = '.dialog-tabs-items' + dataClass;
            var itemActiveSelector = '.dialog-tabs-item' + dataClass + '.active';
            var itemSelector = '.dialog-tabs-item' + dataClass;



            closestEl.find('a.active').removeClass('active');
            $target.addClass('active');

            n = $target.parents('.dialog-tabs').find('li').index($target.parent());
            dialogHolder = this.$el.find(selector);

            dialogHolder.find(itemActiveSelector).removeClass('active');
            dialogHolder.find(itemSelector).eq(n).addClass('active');
        },

        renderAssignees: function (model) {
            var $thisEl = this.$el;
            var notDiv = this.$el.find('.assignees-container');

            notDiv.append(
                new AssigneesView({
                    model: model
                }).render().el
            );

            if (model) {
                model = model.toJSON();

                if (model.groups && (model.groups.users.length > 0 || model.groups.group.length)) {
                    this.$el.find('.groupsAndUser').show();
                    model.groups.group.forEach(function (item) {
                        $thisEl.find('.groupsAndUser').append('<tr data-type="targetGroups" data-id="' + item._id + '"><td>' + item.name + '</td><td class="text-right"></td></tr>');
                        $thisEl.find('#targetGroups').append('<li id="' + item._id + '">' + item.name + '</li>');
                    });
                    model.groups.users.forEach(function (item) {
                        $thisEl.find('.groupsAndUser').append('<tr data-type="targetUsers" data-id="' + item._id + '"><td>' + item.login + '</td><td class="text-right"></td></tr>');
                        $thisEl.find('#targetUsers').append('<li id="' + item._id + '">' + item.login + '</li>');
                    });

                }
            }

        },

        deleteItem: function (event) {
            var self = this;
            var answer;

            event.preventDefault();

            answer = confirm('Really DELETE items ?!');

            if (answer === true) {
                this.currentModel.destroy({
                    success: function () {
                        $('.edit-dialog').remove();
                        Backbone.history.navigate('easyErp/' + self.contentType, {trigger: true});
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            }
        }
    });

    View.extend = function (childView) {
        var view = Backbone.View.extend.apply(this, arguments);

        view.prototype.events = _.extend({}, this.prototype.events, childView.events);

        return view;
    };

    return View;
});
