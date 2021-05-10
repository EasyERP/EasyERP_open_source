define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Departments/CreateTemplate.html',
    'views/dialogViewBase',
    'views/selectView/selectView',
    'collections/Departments/DepartmentsCollection',
    'collections/Customers/AccountsDdCollection',
    'models/DepartmentsModel',
    'common',
    'custom',
    'populate',
    'constants'
], function (Backbone, $, _, CreateTemplate, DialogViewBase, selectView, DepartmentsCollection, AccountsDdCollection, DepartmentsModel, common, Custom, populate, CONSTANTS) {
    'use strict';

    var CreateView = /*Backbone.View*/DialogViewBase.extend({
        el         : '#content-holder',
        contentType: 'Departments',
        template   : _.template(CreateTemplate),

        initialize: function () {
            _.bindAll(this, 'saveItem', 'render');
            this.departmentsCollection = new DepartmentsCollection();
            this.model = new DepartmentsModel();
            this.responseObj = {};

            this.render();
        },

        events: {
            keydown                                            : 'keyDownHandler',
            'click .dialog-tabs a'                             : 'changeTab',
            'click #sourceUsers li'                            : 'addUsers',
            'click #targetUsers li'                            : 'removeUsers',
            'click .current-selected'                          : 'showNewSelect',
            click                                              : 'hideNewSelect',
            'click .prevUserList'                              : 'prevUserList',
            'click .nextUserList'                              : 'nextUserList',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
        },

        keyDownHandler: function (e) {
            switch (e.which) {
                case 13:
                    this.saveItem();
                    e.stopPropagation();
                    e.preventDefault();
                    break;
                default:
                    break;
            }
        },

        updateAssigneesPagination: function (el) {
            var pag = el.find('.userPagination .text');
            var list = el.find('ul');
            var count = list.find('li').length;
            var s = '';
            var page = parseInt(list.attr('data-page'), 10);
            var i;

            el.find('.userPagination .nextUserList').remove();
            el.find('.userPagination .prevUserList').remove();
            el.find('.userPagination .nextGroupList').remove();
            el.find('.userPagination .prevGroupList').remove();

            if (page > 1) {
                el.find('.userPagination').prepend('<a class="prevUserList" href="javascript:;">« Prev</a>');
            }
            if (count === 0) {
                s += '0-0 of 0';
            } else {
                if (page * 20 - 1 < count) {
                    s += ((page - 1) * 20 + 1) + '-' + (page * 20) + ' of ' + count;
                } else {
                    s += ((page - 1) * 20 + 1) + '-' + count + ' of ' + count;
                }
            }

            if (page < count / 20) {
                el.find('.userPagination').append('<a class="nextUserList" href="javascript:;">Next »</a>');
            }
            el.find('ul li').hide();
            for (i = (page - 1) * 20; i < 20 * page; i++) {
                el.find('ul li').eq(i).show();
            }
            pag.text(s);
        },

        nextUserList: function (e, page) {
            $(e.target).closest('.leftItem').find('ul').attr('data-page', parseInt($(e.target).closest('.leftItem').find('ul').attr('data-page'), 10) + 1);
            this.updateAssigneesPagination($(e.target).closest('.leftItem'));
        },

        prevUserList: function (e, page) {
            $(e.target).closest('.leftItem').find('ul').attr('data-page', parseInt($(e.target).closest('.leftItem').find('ul').attr('data-page'), 10) - 1);
            this.updateAssigneesPagination($(e.target).closest('.leftItem'));
        },

        chooseUser: function (e) {
            $(e.target).toggleClass('choosen');
        },

        changeTab: function (e) {
            var n;

            $(e.target).closest('.dialog-tabs').find('a.active').removeClass('active');
            $(e.target).addClass('active');
            n = $(e.target).parents('.dialog-tabs').find('li').index($(e.target).parent());
            $('.dialog-tabs-items').find('.dialog-tabs-item.active').removeClass('active');
            $('.dialog-tabs-items').find('.dialog-tabs-item').eq(n).addClass('active');
        },

        close: function () {
            this._modelBinder.unbind();
        },

        addUsers: function (e) {
            var div;

            e.preventDefault();
            div = $(e.target).parents('.leftItem');
            $('#targetUsers').append($(e.target));
            this.updateAssigneesPagination(div);
            div = $(e.target).parents('.leftItem');
            this.updateAssigneesPagination(div);
        },

        removeUsers: function (e) {
            var div;

            e.preventDefault();
            div = $(e.target).parents('.leftItem');
            $('#sourceUsers').append($(e.target));
            this.updateAssigneesPagination(div);
            div = $(e.target).parents('.leftItem');
            this.updateAssigneesPagination(div);
        },

        saveItem: function () {
            var self = this;
            var mid = 39;
            var departmentName = $.trim($('#departmentName').val());
            var parentDepartment = this.$('#parentDepartment').data('id') ? this.$('#parentDepartment').data('id') : null;
            var nestingLevel = this.$('#parentDepartment').data('level');
            var departmentManager = this.$('#departmentManager').data('id') || null;
            var isDevelopment = this.$el.find('#isDevelopment').prop('checked');
            var users = this.$el.find('#targetUsers li');
            var res = _.filter(this.responseObj['#parentDepartment'], function (item) {
                return item.parentDepartment === parentDepartment;
            });
            users = _.map(users, function (elm) {
                return $(elm).attr('id');
            });

            this.model.save({
                name             : departmentName,
                parentDepartment : parentDepartment,
                departmentManager: departmentManager,
                nestingLevel     : ++nestingLevel,
                users            : users,
                isDevelopment    : isDevelopment,
                sequence         : res.length
            }, {
                headers: {
                    mid: mid
                },
                wait   : true,
                success: function () {
                    Backbone.history.navigate('tinyERP/Departments', {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.create-dialog').remove();
        },

        hideNewSelect: function (e) {
            $('.newSelectList').hide();

            if (this.selectView) {
                this.selectView.remove();
            }
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
            $(e.target).parents('ul').closest('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id')).attr('data-level', $(e.target).data('level'));
        },

        render: function () {
            var self = this;
            var formString = this.template({});

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'create-dialog',
                width      : '800px',
                buttons    : [
                    {
                        text : 'Create',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                            self.gaTrackingConfirmEvents();
                        }
                    },
                    {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }]
            });

            populate.get2name('#departmentManager', CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, this, true, true);
            populate.getParrentDepartment('#parentDepartment', CONSTANTS.URLS.DEPARTMENTS_FORDD, {}, this, true, true);
            common.populateUsersForGroups('#sourceUsers', '#targetUsers', null, 1);
            this.delegateEvents(this.events);
            return this;
        }
    });
    return CreateView;
});
