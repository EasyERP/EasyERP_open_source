define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Departments/EditTemplate.html',
    'views/selectView/selectView',
    'collections/Departments/DepartmentsCollection',
    'collections/Customers/AccountsDdCollection',
    'common',
    'custom',
    'populate',
    'constants',
    'helpers/ga',
    'constants/googleAnalytics'
], function (Backbone, $, _, EditTemplate, SelectView, DepartmentsCollection, AccountsDdCollection, common, Custom, populate, CONSTANTS, ga, GA) {
    'use strict';

    var EditView = Backbone.View.extend({
        el         : '#content-holder',
        contentType: 'Departments',
        template   : _.template(EditTemplate),
        initialize : function (options) {
            _.bindAll(this, 'render', 'saveItem');
            this.departmentsCollection = new DepartmentsCollection();
            _.bindAll(this, 'render', 'deleteItem');

            if (options.myModel) {
                this.currentModel = options.myModel;
            } else {
                this.currentModel = options.model || options.collection.getElement();
            }
            this.currentModel.urlRoot = '/Departments';
            this.responseObj = {};

            this.render();
        },

        events: {
            'click .dialog-tabs a'                             : 'changeTab',
            'click #sourceUsers li'                            : 'addUsers',
            'click #targetUsers li'                            : 'removeUsers',
            'click .current-selected'                          : 'showNewSelect',
            click                                              : 'hideNewSelect',
            'click .prevUserList'                              : 'prevUserList',
            'click .nextUserList'                              : 'nextUserList',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
        },

        nextUserList: function (e) {
            $(e.target).closest('.leftItem').find('ul').attr('data-page', parseInt($(e.target).closest('.leftItem').find('ul').attr('data-page'), 10) + 1);
            this.updateAssigneesPagination($(e.target).closest('.leftItem'));

        },

        prevUserList: function (e) {
            $(e.target).closest('.leftItem').find('ul').attr('data-page', parseInt($(e.target).closest('.leftItem').find('ul').attr('data-page'), 10) - 1);
            this.updateAssigneesPagination($(e.target).closest('.leftItem'));
        },

        chooseUser: function (e) {
            $(e.target).toggleClass('choosen');
        },

        updateAssigneesPagination: function (el) {
            var pag = el.find('.userPagination .text');
            var list = el.find('ul');
            var count = list.find('li').length;
            var s = '';
            var i;
            var page = parseInt(list.attr('data-page'), 10);

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
                if ((page) * 20 - 1 < count) {
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

        changeTab: function (e) {
            var n;

            $(e.target).closest('.dialog-tabs').find('a.active').removeClass('active');
            $(e.target).addClass('active');
            n = $(e.target).parents('.dialog-tabs').find('li').index($(e.target).parent());
            $('.dialog-tabs-items').find('.dialog-tabs-item.active').removeClass('active');
            $('.dialog-tabs-items').find('.dialog-tabs-item').eq(n).addClass('active');
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

            this.selectView = new SelectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

            return false;
        },

        chooseOption: function (e) {
            $(e.target).parents('ul').closest('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id')).attr('data-level', $(e.target).data('level'));
        },

        saveItem: function () {
            var self = this;
            var mid = 39;
            var isDevelopment = this.$el.find('#isDevelopment').prop('checked');
            var departmentName = $.trim($('#departmentName').val());
            var parentDepartment = this.$('#parentDepartment').data('id') ? this.$('#parentDepartment').data('id') : null;
            var departmentManager = this.$('#departmentManager').data('id');
            var nestingLevel = parseInt(this.$('#parentDepartment').data('level'), 10) + 1;
            var users = this.$el.find('#targetUsers li');
            var res = _.filter(this.responseObj['#parentDepartment'], function (item) {
                return item.parentDepartment === parentDepartment;
            });
            users = _.map(users, function (elm) {
                return $(elm).attr('id');
            });

            if (parentDepartment === '') {
                parentDepartment = null;
            }

            if (departmentManager === '') {
                departmentManager = null;
            }

            if (!nestingLevel) {
                nestingLevel = 0;
            }

            ga && ga.trackingEditConfirm(departmentName);

            this.currentModel.set({
                name             : departmentName,
                parentDepartment : parentDepartment,
                departmentManager: departmentManager,
                nestingLevel     : nestingLevel,
                isDevelopment    : isDevelopment,
                users            : users,
                isAllUpdate      : nestingLevel !== this.currentModel.toJSON().nestingLevel,
                sequence         : res.length
            });

            this.currentModel.save({}, {
                headers: {
                    mid: mid
                },
                wait   : true,
                success: function () {
                    Backbone.history.navigate('#easyErp/Departments', {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.create-dialog').remove();
        },

        deleteItem: function (event) {
            var mid = 39;
            var self = this;
            var answer = confirm('Really DELETE items ?!');
            var departmentName = this.currentModel.get('name');

            event.preventDefault();

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.REMOVE_BTN + ' "' + departmentName + '"'
            });

            if (answer) {
                this.currentModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        $('.edit-dialog').remove();
                        Backbone.history.navigate('easyErp/' + self.contentType, {trigger: true});
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            }
        },

        render: function () {
            var formString = this.template({
                model: this.currentModel.toJSON()
            });
            var b;
            var self = this;
            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                width      : '800px',
                title      : 'Edit Department',
                buttons    : [{
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
                            $(this).remove();
                        }
                    },
                    {
                        text : 'Delete',
                        class: 'btn',
                        click: self.deleteItem
                    }]
            });
            populate.get2name('#departmentManager', CONSTANTS.URLS.EMPLOYEES_PERSONSFORDD, {}, this, false, true);
            populate.getParrentDepartment('#parentDepartment', CONSTANTS.URLS.DEPARTMENTS_FOREDITDD, {id: this.currentModel.toJSON()._id}, this, false, true);
            b = $.map(this.currentModel.toJSON().users, function (item) {
                return $('<li/>').text(item.login).attr('id', item._id);
            });
            $('#targetUsers').append(b);
            common.populateUsersForGroups('#sourceUsers', '#targetUsers', this.currentModel.toJSON(), 1, function () {
                self.updateAssigneesPagination($('#targetUsers').parent());
                self.updateAssigneesPagination($('#sourceUsers').parent());
            });
            return this;
        }
    });
    return EditView;
});
