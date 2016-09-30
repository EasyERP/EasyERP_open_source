define([
    'jQuery',
    'Underscore',
    'Backbone',
    'models/EmployeeProfileSettings',
    'text!templates/employeeProfileSettings/index.html',
    'views/selectView/selectView',
    'services/select',
    'populate'
], function ($, _, Backbone, Model, template, SelectView, select, populate) {
    var WeeklySchedulerListView = Backbone.View.extend({
        el           : '#profileSettings',
        template     : _.template(template),
        contentType  : 'employeeProfileSettings',
        hideNewSelect: select.hideNewSelect,
        responseObj  : {},
        events       : {
            'click .current-selected:not(.jobs)'                             : 'showNewSelect',
            'click .newSelectList li:not(.miniStylePagination, .endContract)': 'chooseOption',
            click                                                            : 'hideNewSelect'
        },

        initialize: function () {
            var self = this;

            this.model = new Model();
            this.model.fetch({
                success: function () {
                    self.model.on('change:profileId', self.saveToDb, self);
                    self.render();
                },

                error: function (model, xhr) {
                    App.render({
                        type   : 'error',
                        message: 'Can\'t fetch "Profile" settings'
                    });
                }
            });
        },

        saveToDb: function (data) {
            this.model.url = 'employees/settings';
            this.model.save(null, {
                error: function (err) {
                    App.render({
                        type   : 'error',
                        message: err.statusText
                    });
                }
            });
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
            var $target = $(e.target);
            var $element = $target.closest('li');
            var id = $element.attr('id');
            var $container = $target.parents('a#profilesDd');

            this.model.set({profileId: id});

            $container.text($element.text()).attr('data-id', id);
        },

        render: function () {
            var $currentEl;
            var currentSetting = this.model.toJSON();

            $('.ui-dialog ').remove();

            $currentEl = this.$el;
            $currentEl.html(this.template(currentSetting));

            if (currentSetting._id) {
                populate.get('#profilesDd', 'profiles/forDd', {}, 'profileName', this);
            } else {
                populate.get('#profilesDd', 'profiles/forDd', {}, 'profileName', this, true);
            }

            return this;
        }

    });

    return WeeklySchedulerListView;
});
