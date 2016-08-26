define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/followers/indexTemplate.html',
    'text!templates/followers/followersList.html',
    'views/selectView/selectView',
    'common',
    'populate',
    'constants',
    'dataService'
], function (Backbone, $, _, template, followersListTemplate, SelectView, common, populate, CONSTANTS, dataService) {
    'use strict';
    var View = Backbone.View.extend({
        template         : _.template(template),
        followersTemplate: _.template(followersListTemplate),

        initialize: function (options) {
            this.remove();
            this.model = options.model;

            this.responseObj = {};
        },

        events: {
            'click .current-selected'                          : 'showNewSelect',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click .remove'                                    : 'removeFollower',
            click                                              : 'hideNewSelect',
            'click .followers'                                 : 'renderFollowersList',
            'click #follow'                                    : 'follow'
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

        removeFollower: function (e) {
            var self = this;
            var $target = $(e.target);
            var id = $target.closest('li').attr('data-id');
            var userId = App.currentUser.relatedEmployee ? App.currentUser.relatedEmployee._id : null;
            var status;
            var unfollow = false;

            status = _.find(this.model.toJSON().followers, function (el) {
                return el._id === id;
            });

            if (status.followerId === userId){
                unfollow = true;
            }

            App.startPreload();

            dataService.deleteData('/followers/', {
                _id: id
            }, function (err, response) {

                App.stopPreload();
                self.hideNewSelect();

                self.model.set('followers', response.data);

                if (unfollow) {
                    self.model.set('followerStatus', false);
                    self.$el.find('#follow').text('Follow');
                    self.$el.find('#follow').removeClass('unfollow');
                    self.$el.find('#follow').removeClass('follow');
                }

                self.$el.find('.followersList').html('');
            });
        },

        chooseOption: function (e) {
            var self = this;
            var $target = $(e.target);
            var id = $target.attr('id');

            App.startPreload();

            dataService.postData('/followers/', {
                followerId    : id,
                contentId     : this.model.id,
                collectionName: 'leads'
            }, function (err, response) {
                App.stopPreload();
                self.hideNewSelect();

                if (response.data) {
                    self.model.set('followers', response.data);

                    self.$el.find('.followersList').html('');
                } else if (response.error) {
                    App.render({type: 'error', message: 'This employee is follower already'});
                }

            });
        },

        follow: function (e) {
            var self = this;
            var $target = $(e.target);
            var classEvent = $.trim($target.text());
            var _id;

            if (!App.currentUser.relatedEmployee) {
                return App.render({type: 'error', message: 'Please, choose related Employee to your user, please'});
            }

            if (classEvent === 'Follow') {
                App.startPreload();

                dataService.postData('/followers/', {
                    followerId    : App.currentUser.relatedEmployee._id,
                    contentId     : this.model.id,
                    collectionName: 'leads'
                }, function (err, response) {
                    App.stopPreload();
                    self.hideNewSelect();

                    if (response.data) {
                        self.model.set('followers', response.data);
                        self.model.set('followerStatus', true);

                        self.$el.find('.followersList').html('');

                        self.$el.find('#follow').text('Unfollow');
                        self.$el.find('#follow').removeClass('follow');
                        self.$el.find('#follow').addClass('unfollow');
                    } else if (response.error) {
                        App.render({type: 'error', message: 'This employee is follower already'});
                    }

                });
            } else if (classEvent === 'Unfollow') {
                App.startPreload();

                _id = _.find(this.model.toJSON().followers, function (el) {
                    return el.followerId === App.currentUser.relatedEmployee._id;
                });

                dataService.deleteData('/followers/', {
                    _id: _id._id
                }, function (err, response) {
                    App.stopPreload();
                    self.hideNewSelect();

                    self.model.set('followers', response.data);

                    self.$el.find('#follow').text('Follow');
                    self.$el.find('#follow').addClass('follow');
                    self.$el.find('#follow').removeClass('unfollow');

                    self.$el.find('.followersList').html('');
                });
            }

        },

        hideNewSelect: function () {
            if (this.selectView) {
                this.selectView.remove();
            }
        },

        renderFollowersList: function () {
            if (this.$el.find('.followersList').html() === '') {
                this.$el.find('.followersList').html(this.followersTemplate({followers: this.model.toJSON().followers}));
            } else {
                this.$el.find('.followersList').html('');
            }
        },

        render: function () {
            var self = this;
            var followers = this.model.toJSON().followers;
            var userId = App.currentUser.relatedEmployee ? App.currentUser.relatedEmployee._id : null;
            var status;

            status = _.find(followers, function (el) {
                return el.followerId === userId;
            });

            if (status) {
                this.model.set('followerStatus', true);
            } else {
                this.model.set('followerStatus', false);
            }

            this.$el.html(this.template({model: this.model.toJSON()}));

            dataService.getData('/employees/getForDD', {isEmployee: true}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee;
                });

                self.responseObj['#followersDd'] = employees;
            });

            return this;
        }
    });

    return View;
});
