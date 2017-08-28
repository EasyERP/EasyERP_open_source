define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Products/publishProduct.html',
    'views/selectView/selectView',
    'services/select',
    'dataService',
    'constants',
    'populate'
], function (Backbone,
             $,
             _,
             publishTemplate,
             selectView,
             select,
             dataService,
             CONSTANTS,
             populate) {
    'use strict';

    var Integrations = Backbone.View.extend({
        contentType    : CONSTANTS.PRODUCTS,
        publishTemplate: _.template(publishTemplate),
        events         : {
            'click .newSelectList li'               : 'chooseOption',
            'click .current-selected:not(.disabled)': 'showNewSelect',
            'click #reloadShipTemps'                : 'reloadTempShips',
            click                                   : 'hideNewSelect'
        },

        initialize: function (options) {
            _.bindAll(this,  'cancel',  'continue', 'publish');

            this.eventsChannel = options.eventsChannel;
            this.channel = options.channel;

            this.action = options.action;
            this.responseObj = {};

            this.render(options);
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
            var $thisEl = this.$el;
            var $target = $(e.target).closest('li');
            var id = $target.attr('id');
            var type = $target.attr('data-type');
            var $forShippingContent;
            var channelName;

            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id')).attr('data-type', type);
            this.hideNewSelect();

            if (type === 'etsy') {
                $forShippingContent = $thisEl.find('#forShipping');
                $forShippingContent.removeClass('hidden');

                channelName = $target.text().trim();
                populate.get('#shippingTemps', 'integration/etsy/shippingTemplate', {channel: id}, 'name', this, false);
            }

            return false;
        },

        reloadTempShips: function (e) {
            var $thisEl = this.$el;
            var channelName = $thisEl.find('#channel').text().trim();

            e.preventDefault();

            populate.get('#shippingTemps', 'integration/etsy/shippingTemplate', {channel: id}, 'name', this, false);

            return false;
        },

        hideNewSelect: select.hideNewSelect,

        cancel: function () {
            this.eventsChannel.trigger('closeDialog');
        },

        continue: function () {
            var $currentEl = this.$el;
            var priceList = $currentEl.find('#priceList').attr('data-id');
            var $channel = $currentEl.find('#channel');
            var channel = $channel.attr('data-id');
            var channelName = $channel.text();
            var action = this.action;
            var channelObj = this.responseObj['#channel'].find(function (el) {
                return el._id === channel;
            });
            var data = {
                channel    : channel,
                channelName: channelName,
                action     : action
            };
            var type = $currentEl.find('#channel').attr('data-type');
            var shippingTemplate;

            if (action === 'publish') {
                if (!priceList || !channel) {
                    return App.render({
                        message: 'Please choose Channel and Price list'
                    });
                }

                if (type === 'etsy') {
                    shippingTemplate = $currentEl.find('#shippingTemps').attr('data-id');

                    if (!shippingTemplate) {
                        return App.render({
                            message: 'Please choose Shipping Profile'
                        });
                    }

                    data.shippingTemplate = shippingTemplate;
                }

                data.priceList = priceList;

            } else if (action === 'unpublish' || action === 'unlinked') {
                if (!channel) {
                    return App.render({
                        message: 'Please choose Channel'
                    });
                }
            }

            data.channelType = channelObj.type;

            this.eventsChannel.trigger('filterPublishedOrUnpublished', data);
        },

        publish: function () {
            var $currentEl = this.$el;
            var priceList = $currentEl.find('#priceList').attr('data-id');
            var shippingTemplate;
            var data = {
                channel: this.channel._id
            };

            if (!priceList) {
                return App.render({
                    message: 'Please choose Price list'
                });
            }

            if (this.channel.type === 'etsy') {
                shippingTemplate = $currentEl.find('#shippingTemps').attr('data-id');

                if (!shippingTemplate) {
                    return App.render({
                        message: 'Please choose Shipping Profile'
                    });
                }

                data.shippingTemplate = shippingTemplate;
            }

            data.priceList = priceList;

            this.eventsChannel.trigger('singlePublish', data);
        },

        remove: function () {
            // var self = this;

            this.model.destroy({
                success: function () {
                    // self.eventsChannel.trigger('closeDialog');
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#easyErp/integrations', {replace: true, trigger: true});
                }
            });
        },

        render: function (options) {
            var self = this;
            var buttons = {
                save: {
                    text : 'Continue',
                    class: 'btn blue',
                    click: self.continue
                },
                cancel: {
                    text : 'Cancel',
                    class: 'btn',
                    click: self.cancel
                }
            };
            var dialogOptions;
            var dialogContent;
            var word = '';
            var action = this.action;
            var channel = this.channel;

            if (action === 'singlePublish') {
                buttons = {
                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: function (){
                            self.cancel();
                        }
                    },

                    save: {
                        text : 'Publish',
                        class: 'btn blue',
                        click: self.publish
                    }
                };
            }

            dialogOptions = {
                dialogClass: 'edit-dialog',
                width      : 450,
                buttons    : buttons
            };

            if (action === 'unpublish' || action === 'unlink') {
                word = 'published';
            } else if (action === 'publish') {
                word = 'unpublished';
            }

            dialogContent = this.publishTemplate({
                word   : word,
                channel: channel,
                action : action
            });

            this.$el = $(dialogContent).dialog(dialogOptions);

            if (channel && channel.type === 'etsy' && channel._id) {
                populate.get('#shippingTemps', 'integration/etsy/shippingTemplate', {channel: channel._id}, 'name', this, false);
            }

            populate.get('#channel', 'channels/getForDD', {connected: true}, 'channelName', this, false);
            dataService.getData('priceList/getForDd', {}, function (response) {
                if (response && !response.error) {
                    self.responseObj['#priceList'] = response.data;
                }
            });

            this.delegateEvents(this.events);

            return this;
        }
    });

    return Integrations;
});
