define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/billOfMaterials/TopBarTemplate.html',
    'views/billOfMaterials/create/CreateView',
    'custom',
    'common',
    'constants',
    'helpers/ga',
    'constants/googleAnalytics'
], function (_, BaseView, ContentTopBarTemplate, CreateView, Custom, Common, CONSTANTS, ga, GA) {
    var TopBarView = BaseView.extend({
        el         : '#top-bar',
        contentType: CONSTANTS.BILLOFMATERIALS,
        actionType : null, // Content, Edit, Create
        template   : _.template(ContentTopBarTemplate),

        events: {
            'click #top-bar-createBtn': 'create',
            'click #top-bar-deleteBtn' : 'deleteEvent'
        },

        initialize: function () {

            this.render();
        },

        create: function () {
            var createView = new CreateView();
            createView.render();
            //TODO write
        },

        deleteEvent: function (event) {
            event.preventDefault();
            this.trigger('deleteEvent');
        },

        render: function (options) {
            var viewType = Custom.getCurrentVT();
            var title = this.contentHeader || this.contentType;

            $('title').text(title.toUpperCase());

            if (viewType && viewType === 'tform') {
                this.$el.addClass('position');
            } else {
                this.$el.removeClass('position');
            }

            if (!options || !options.hide) {
                this.$el.html(this.template({
                    viewType: viewType
                }));
            } else {
                this.$el.html('');
            }
            Common.displayControlBtnsByActionType(this.actionType, viewType);

            return this;
        }
    });

    return TopBarView;
});
