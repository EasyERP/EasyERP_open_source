define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/priceLists/CreateTemplate.html',
    'views/dialogViewBase',
    'models/PriceListsModel',
    'common',
    'custom',
    'populate',
    'dataService',
    'constants'
], function (Backbone, $, _, CreateTemplate, BaseView, Model, common, Custom, populate, dataService, CONSTANTS) {

    var CreateView = BaseView.extend({
        el         : '#content-holder',
        contentType: CONSTANTS.PRICELISTS,
        template   : _.template(CreateTemplate),
        events     : {
            'click .newSelectList li': 'chooseOption'
        },

        initialize: function (options) {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new Model();
            this.responseObj = {};
            this.render();
        },

        chooseOption: function (e) {
            var id;
            var data;
            var $target = $(e.target);
            var attrId = $target.parents('td').find('.current-selected').attr('id');

            $('.newSelectList').hide();

            if ($target.parents('dd').find('.current-selected').length) {
                $target.parents('dd').find('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
            } else {
                id = $target.parents('td').closest('tr').attr('data-id');

                if (attrId === 'workflow') {
                    data = {_id: id, workflowId: $target.attr('id')};
                } else if (attrId === 'type') {
                    data = {_id: id, type: $target.text()};
                }

                $target.parents('td').find('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

                dataService.postData('/jobs/update', data, function (err) {
                    if (err) {
                        return console.log(err);
                    }

                });
            }

            this.showSaveButton();
        },

        saveItem: function () {
            var thisEl = this.$el;
            var self = this;
            var mid = 39;
            var priceListName = $.trim(thisEl.find('#priceListName').val());
            var priceListCode = $.trim(thisEl.find('#priceListCode').val());
            var currency = thisEl.find('#currencyDd').data('id');
            var cost = thisEl.find('#yes').prop('checked') || false;

            this.model.save({
                name         : priceListName,
                priceListCode: priceListCode,
                currency     : currency,
                cost         : cost
            }, {
                headers: {
                    mid: mid
                },
                wait   : true,
                success: function (model) {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('easyErp/priceLists', {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        render: function () {
            var self = this;
            var formString = this.template({});

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'create-dialog',
                width      : '900px',
                buttons    : [
                    {
                        text : 'Create',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
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

            populate.get('#currencyDd', '/currency/getForDd', {}, 'name', this, true);
            this.delegateEvents(this.events);

            return this;
        }
    });

    return CreateView;
});
