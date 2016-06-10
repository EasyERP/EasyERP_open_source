define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/Assignees/AssigneesView'
], function (Backbone, $, _, AssigneesView) {
    'use strict';

    var View = Backbone.View.extend({

        events: {
            keydown: 'keyDownHandler',
            click  : 'hideNewSelect'
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

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        keyDownHandler: function (e) {
            switch (e.which) {
                case 27:
                    this.hideDialog();
                    break;
                default:
                    break;
            }
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
            $('.add-group-dialog').remove();
            $('.add-user-dialog').remove();
            $('.crop-images-dialog').remove();
        },

        changeTab: function (e) {
            var n;
            var $dialogHolder;
            var $holder = $(e.target);

            $holder.closest('.dialog-tabs').find('a.active').removeClass('active');
            $holder.addClass('active');
            n = $holder.parents('.dialog-tabs').find('li').index($holder.parent());
            $dialogHolder = $holder.closest('.dialog-tabs').parent().find('.dialog-tabs-items');
            $dialogHolder.find('.dialog-tabs-item.active').removeClass('active');
            $dialogHolder.find('.dialog-tabs-item').eq(n).addClass('active');
        },

        renderAssignees: function (model) {
            var $thisEl = this.$el;
            var notDiv = this.$el.find('.assignees-container');

            notDiv.append(
                new AssigneesView({
                    model: model
                }).render().el
            );

            model = model.toJSON();

            if (model.groups) {
                if (model.groups.users.length > 0 || model.groups.group.length) {
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

    /*View.extend = function (childView) {
     var view = Backbone.View.extend.apply(this, arguments);

     view.prototype.events = _.extend({}, this.prototype.events, childView.events);

     return view;
     };*/

    return View;
});
