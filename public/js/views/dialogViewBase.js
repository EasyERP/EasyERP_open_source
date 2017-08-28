define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/Assignees/AssigneesView',
    'views/selectView/selectView',
    'views/tips/index',
    'helpers/exportToPdf',
    'services/select',
    'helpers/ga',
    'constants/googleAnalytics'
], function (Backbone, $, _, AssigneesView, SelectView, TipsView, exportToPdf, select, ga, GA) {
    'use strict';

    var View = Backbone.View.extend({
        hideNewSelect: select.hideNewSelect,

        events: {
            keydown                                                                   : 'keyDownHandler',
            click                                                                     : 'hideNewSelect',
            'click .dialog-tabs a'                                                    : 'changeTab',
            'focus .counterWrap'                                                      : 'checkCount',
            'click .current-selected:not(.jobs)'                                      : 'showNewSelect',
            'mouseover .tips'                                                         : 'showNewTip',
            'click #exportToPdf'                                                      : 'exportToPdf',
            'click .newSelectList li:not( .empty, .miniStylePagination, .endContract)': 'chooseOption'
        },

        clickInput: function (e) {
            e.stopPropagation();
            e.preventDefault();

            $('.input-file .inputAttach').first().click();
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

        checkCount: function (e) {
            var $elem = $(e.target);
            var $parent = $elem.closest('.counterWrap');
            e.stopPropagation();
            var $counterEl = $parent.find('#counterValue');

            this.calculateValue($elem, $counterEl);
        },

        calculateValue: function (elem, countEl) {
            var $elem = elem;
            var maxValue = parseInt($elem.attr('maxlength'));
            var $counterEl = countEl;

            $elem.on('keyup', function () {
                var numOfSymbols = maxValue - $elem.val().length;
                var resultVal = (numOfSymbols === maxValue) ? maxValue : numOfSymbols ? numOfSymbols : '0';

                $counterEl.text(resultVal);
            })
        },

        exportToPdf: function (e) {
            var template = this.$el.find('#templateDiv').html();

            exportToPdf.takeFile({
                file: template,
                name: this.model.get('name')
            });
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

        showNewTip: function (e) {
            var $target = $(e.target).closest('span');
            var id = $target.data('id');
            var tipsViewId = 'tipsView' + id;

            e.stopPropagation();

            if (!this[tipsViewId] || this[tipsViewId].id !== id) {
                this[tipsViewId] = new TipsView({
                    id         : id,
                    contentType: this.contentType
                });

                $target.append(this[tipsViewId].render().el);

                this.$el.find('.newTip').addClass('animateTip');
            }

            /* if (!this[tipsViewId]) {
             this[tipsViewId] = new TipsView({
             id         : id,
             contentType: this.contentType
             });

             if (!this[tipsViewId].isExist) {

             $target.append(this[tipsViewId].render().el);

             this[tipsViewId].isExist = id;
             }
             } else {
             if (this[tipsViewId].id !== id) {
             this[tipsViewId] = new TipsView({
             id         : id,
             contentType: this.contentType
             });
             if (!this[tipsViewId].isExist) {
             $target.append(this[tipsViewId].render().el);
             $target.addClass('animateTip');
             this[tipsViewId].isExist = id;
             }
             }
             }*/

            return false;
        },

        dialogCentering: function (elem) {
            elem.dialog({
                position: {
                    within: $('#wrapper')
                }
            });
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
            $('.open-view-dialog').remove();

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.CANCEL_DIALOG
            });
        },

        gaTrackingConfirmEvents: function () {
            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.CONFIRM_DIALOG
            });
        },

        gaTrackingEditConfirm: function () {
            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.CONFIRM_EDITING
            });
        },

        gaTrackingDelete: function () {
            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.DELETE_DIALOG
            });
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

                        Backbone.history.fragment = '';
                        Backbone.history.navigate('easyErp/' + self.contentType, {trigger: true});
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            }

            this.gaTrackingDelete();
        }
    });

    View.extend = function (childView) {
        var view = Backbone.View.extend.apply(this, arguments);

        view.prototype.events = _.extend({}, this.prototype.events, childView.events);

        return view;
    };

    return View;
});
