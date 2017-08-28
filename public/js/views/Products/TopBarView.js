define([
    'Underscore',
    'views/topBarViewBase',
    'text!templates/Products/TopBarTemplate.html',
    'text!templates/Notes/importTemplate.html',
    'views/Notes/AttachView',
    'custom',
    'common',
    'constants',
    'helpers/ga',
    'constants/googleAnalytics'
], function (_, BaseView, ContentTopBarTemplate, importTemplate, attachView, Custom, Common, CONSTANTS, ga, GA) {
    var TopBarView = BaseView.extend({
        el            : '#top-bar',
        contentType   : CONSTANTS.PRODUCTS,
        actionType    : null, // Content, Edit, Create
        template      : _.template(ContentTopBarTemplate),
        importTemplate: _.template(importTemplate),
        events        : {
            'click #top-bar-publishBtn'    : 'publishToChannel',
            'click #top-bar-unpublishBtn'  : 'unpublishFromChannel',
            'click #top-bar-unlinkBtn'     : 'unlinkFromChannel',
            'click #top-bar-toPublishBtn'  : 'publish',
            'click #top-bar-toUnpublishBtn': 'unpublish',
            'click #top-bar-toUnlinkBtn'   : 'unlink',
            'click #top-bar-back'          : 'goBack'
        },

        initialize: function (options) {
            this.actionType = options.actionType || 'Content';
            this.dashboardName = options.name || '';
            this.dashboardDescription = options.description || '';
            this.hideNavigate = options.hideNavigate;

            this.render();
        },

        publishToChannel: function (event) {
            event.preventDefault();

            this.trigger('configureChannel', 'publish');

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventAction  : this.contentType || 'No Content Type',
                eventLabel   : GA.EVENT_LABEL.CONFIGURE_PUBLISHING,
                eventValue   : GA.EVENTS_VALUES[45],
                fieldsObject : {}
            });
        },

        unpublishFromChannel: function (event) {
            event.preventDefault();

            this.trigger('configureChannel', 'unpublish');

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventAction  : this.contentType || 'No Content Type',
                eventLabel   : GA.EVENT_LABEL.CONFIGURE_UNPUBLISHING,
                eventValue   : GA.EVENTS_VALUES[44],
                fieldsObject : {}
            });
        },

        unlinkFromChannel: function (event) {
            event.preventDefault();

            this.trigger('configureChannel', 'unlink');
        },

        publish: function (event) {
            event.preventDefault();

            this.trigger('publish');
        },

        unpublish: function (event) {
            event.preventDefault();

            this.trigger('unpublish');
        },

        unlink: function (event) {
            event.preventDefault();

            this.trigger('unlink');
        },

        goBack: function (event) {
            event.preventDefault();

            this.trigger('goBack');
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
                    viewType            : viewType,
                    contentType         : this.contentType,
                    headerType          : this.headerType,
                    contentHeader       : this.contentHeader,
                    dashboardName       : this.dashboardName,
                    dashboardDescription: this.dashboardDescription,
                    hideNavigate        : this.hideNavigate
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
