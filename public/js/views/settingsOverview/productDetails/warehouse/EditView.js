define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/settingsOverview/productDetails/warehouse/EditTemplate.html',
    'text!templates/warehouse/CreateZoneTemplate.html',
    'text!templates/warehouse/CreateLocationTemplate.html',
    'text!templates/warehouse/zonesAndLocationsTemplate.html',
    'views/settingsOverview/productDetails/warehouse/CreateView',
    'collections/warehouse/filterCollection',
    'models/warehouse',
    'models/zoneModel',
    'models/locationModel',
    'constants',
    'populate',
    'dataService'
], function (Backbone, $, _, ParentView, ItemTemplate, zoneTemplate, locationTemplate, zonesAndLocationsTemplate, CreateView, WarehouseCollection, Model, ZoneModel, LocationModel, CONSTANTS, populate, dataService) {
    'use strict';

    var ContentView = ParentView.extend({
        el              : '#content-holder',
        contentType     : CONSTANTS.WAREHOUSE,
        modulesView     : null,
        modelChanged    : {},
        changedLocations: {},
        changedZones    : {},
        responseObj     : {},

        initialize: function (options) {
            var eventChannel = {};
            var jsonModel;

            _.extend(eventChannel, Backbone.Events);

            this.eventChannel = eventChannel;
            this.startTime = options.startTime;
            this.model = options.model;
            this.collection = options.collection;

            jsonModel = this.model.toJSON();

            this.id = jsonModel._id;

            this.zones = jsonModel.zones;
            this.locations = jsonModel.locations;

            this.listenTo(eventChannel, 'renderZones renderLocations', this.renderZonesAndLocations);

            this.render();
        },

        events: {
            'click .items'         : 'showItem',
            'keyup input'          : 'setChangeValueToModel',
            'change #isOwn, #main' : 'setChangeValueToModel',
            'click .removeLocation': 'removeLocation',
            'click .removeZone'    : 'removeZone',
            'click td.editable'    : 'editRow',
            'click #createZone'    : 'createZone',
            'click #createLocation': 'createLocation',
            'keydown input.editing': 'onPressedEnter',
            click                  : 'setChangedValue',
            'change #main'         : 'toggleMessage'
        },

        toggleMessage: function () {
            this.$el.find('.checkText').toggleClass('hidden');
        },

        onPressedEnter: function (e) {
            if (e.which === 13) {
                this.setChangedValue();
            }
        },

        editRow: function (e) {
            var $target = $(e.target);
            var tempContainer = ($target.text()).trim();
            var tempContainerArray;
            var letters;
            var i;
            var resultString;
            var trId = $target.closest('tr').attr('data-id');
            var self = this;
            var array = [];
            var input;
            var locationName;

            e.stopPropagation();

            if ($target.prop('tagName') !== 'INPUT') {
                this.setChangedValue();
            }

            if ($target.hasClass('locationName')) {
                tempContainerArray = tempContainer.split('.');
                letters = ['A', 'B', 'C', 'D'];
                resultString = '';

                if (!this.changedLocations[trId]) {
                    this.changedLocations[trId] = {};
                }

                for (i = 0; i < 4; i++) {
                    if (tempContainerArray[i]) {
                        resultString += '<input id="' + letters[i] + '" class="editing" type="text" value="' + tempContainerArray[i] +
                            '"  maxLength="255" ' + 'placeholder="location ' + (i + 1) + '">';
                    } else {
                        if (i === tempContainerArray.length) {
                            resultString += '<input id="' + letters[i] + '" class="editing" type="text" maxLength="255" ' +
                                'placeholder="location ' + (i + 1) + '">';
                        } else {
                            resultString += '<input id="' + letters[i] + '" class="editing" type="text" disabled maxLength="255" ' +
                                'placeholder="location ' + (i + 1) + '">';
                        }
                    }
                }

                $target.html(resultString);

                input = this.$el.find('.locationName input');

                input.focusout(function (e) {
                    var target = e.target;
                    var text = target.value;

                    if (text) {
                        self.changedLocations[trId]['grouping' + $(target).attr('id')] = text;

                        for (i = 0; i < 4; i++) {
                            if (input.eq(i).val()) {
                                array.push(input.eq(i).val());
                            }
                        }

                        locationName = array.join('.');

                        self.changedLocations[trId]['name'] = locationName;
                        $(target).next().attr('disabled', false);
                        array = [];
                    } else {
                        $(target).nextAll().val('');
                        $(target).nextAll().attr('disabled', true);
                    }
                });
            } else if ($target.hasClass('zoneName')) {
                if (!this.changedZones[trId]) {
                    this.changedZones[trId] = {};
                }

                $target.html('<input id="" class="editing" type="text" maxLength="255" ' + 'value="' + $target.text() +
                    '" placeholder="Zone name">');

                input = this.$el.find('.zoneName input');

                input.focusout(function (e) {
                    var target = e.target;
                    var text = target.value;

                    if (text) {
                        self.changedZones[trId]['name'] = text;
                    }
                });
            }

            this.showButtons();
        },

        setChangedValue: function () {
            var editedElement = this.$el.find('.editing');
            var editedCol;
            var editedElementValue;
            var input;
            var array = [];
            var i;
            var locationName;

            this.hideNewSelect();

            if (editedElement.length) {
                editedCol = editedElement.closest('td');

                if (editedCol.hasClass('locationName')) {
                    input = $('.locationName input');

                    for (i = 0; i < 4; i++) {
                        if (input.eq(i).val()) {
                            array.push(input.eq(i).val());
                        }
                    }

                    locationName = array.join('.');
                    editedElementValue = locationName;
                } else {
                    editedElementValue = editedElement.val();
                }

                editedCol.text(editedElementValue);
                editedElement.remove();
            }
        },

        createZone: function () {
            return new CreateView({
                model       : ZoneModel,
                template    : zoneTemplate,
                title       : 'Zone',
                width       : '400px',
                action      : 'createZone',
                id          : this.id,
                event       : 'renderZones',
                eventChannel: this.eventChannel
            });
        },

        createLocation: function () {
            return new CreateView({
                model       : LocationModel,
                template    : locationTemplate,
                title       : 'Location',
                action      : 'createLocation',
                id          : this.id,
                event       : 'renderLocations',
                eventChannel: this.eventChannel
            });
        },

        renderZonesAndLocations: function (options) {
            var self = this;
            var templ = _.template(zonesAndLocationsTemplate);

            if (options && options.location) {
                this.locations.push(options.location.toJSON());
            } else if (options && options.zone) {
                this.zones.push(options.zone.toJSON());
            }

            this.model.set({zones: this.zones, locations: this.locations});

            //this.collection.set(this.model, {remove: false});
            //this.collection.add(this.model);

            dataService.getData(CONSTANTS.URLS.ZONES_FOR_DD, {warehouse: this.id}, function (resp) {
                self.responseObj['#zones'] = resp.data;

                self.$el.find('#zonesAndLocations').html(templ({zones: self.zones, locations: self.locations}));
                self.collection.trigger('change');
            });
        },

        setChangeValueToModel: function (e) {
            var $target = $(e.target);
            var property = $target.attr('id').replace('_', '.');
            var value = $target.val();
            var id = this.id;

            if (property == 'main' || property === 'isOwn') {
                value = $target.prop('checked');
            }

            $target.closest('.propertyFormList').addClass('active');

            if (!this.modelChanged[id]) {
                this.modelChanged[id] = {};
            }

            this.modelChanged[id][property] = value;
            this.showButtons();
        },

        showButtons: function () {
            $('#top-bar-saveBtn').show();
        },

        saveItem: function () {
            this.saveModel();
        },

        createItem: function () {
            new CreateView({});
        },

        removeLocation: function (e) {
            var self = this;
            var $target = $(e.target);
            var id = $target.closest('tr').attr('data-id');
            var answer = confirm('Really DELETE Location ?!');
            var location = new LocationModel({_id: id});

            if (answer === true) {
                location.destroy({
                    success: function (model) {
                        self.locations = self.locations.map(function (el) {
                            if (el._id === id) {
                                return el = {};
                            } else {
                                return el;
                            }
                        });
                        self.renderZonesAndLocations();
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            }
        },

        removeZone: function (e) {
            var self = this;
            var $target = $(e.target);
            var id = $target.closest('tr').attr('data-id');
            var answer = confirm('Really DELETE Zone ?!');
            var location = new ZoneModel({_id: id});

            if (answer === true) {
                location.destroy({
                    success: function (model) {
                        self.zones = self.zones.map(function (el) {
                            if (el && el._id === id) {
                                return el._id = {};
                            }
                            return el;
                        });

                        self.locations = self.locations.map(function (el) {
                            if (el && el.zone && el.zone._id === id) {
                                el.zone = {};
                                return el;
                            }
                            return el;
                        });
                        self.renderZonesAndLocations();
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            }
        },

        getNewModels: function () {
            var self = this;
            this.watehouseCollection = new WarehouseCollection();
            this.watehouseCollection.bind('reset', renderWarehouse, this);

            function renderWarehouse(models) {
                self.collection.reset(models.models, {remove: false});
            }
        },

        saveModel: function () {
            var self = this;
            var ids = Object.keys(this.modelChanged);
            var changedLocations = Object.keys(this.changedLocations);
            var changedZones = Object.keys(this.changedZones);
            var newModel;

            changedZones.forEach(function (id) {
                var zone = new ZoneModel({_id: id});

                zone.save(self.changedZones[id], {
                    patch  : true,
                    wait   : true,
                    success: function () {
                        delete self.changedZones[id];

                    },

                    error: function (model, response) {
                        if (response) {
                            App.render({
                                type   : 'error',
                                message: response.error
                            });
                        }
                    }
                });

            });

            changedLocations.forEach(function (id) {
                var location = new LocationModel({_id: id, zone: self.changedLocations[id].zone});

                location.save(self.changedLocations[id], {
                    patch  : true,
                    wait   : true,
                    success: function (model) {
                        delete self.changedLocations[id];

                    },

                    error: function (model, response) {
                        if (response) {
                            App.render({
                                type   : 'error',
                                message: response.error
                            });
                        }
                    }
                });
            });

            ids.forEach(function (id) {
                newModel = self.model;

                newModel.save(self.modelChanged[id], {
                    patch  : true,
                    wait   : true,
                    success: function (model) {
                        self.hideDialog();
                        
                        delete self.modelChanged[id];

                        if (self.modelChanged[id] && self.modelChanged[id].main) {
                            return self.getNewModels();
                        }

                        self.collection.set(model, {remove: false});

                    },

                    error: function (model, response) {
                        if (response) {
                            App.render({
                                type   : 'error',
                                message: response.error
                            });
                        }
                    }
                });
            });
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var id = $target.attr('id');
            var text = $.trim($target.text());
            var $ul = $target.closest('ul');
            var $element = $ul.closest('a');
            var type = $target.closest('a').attr('name').replace('_', '.');
            var trId = $element.closest('tr').attr('data-id');

            $element.attr('data-id', id);
            $element.text(text);

            $ul.remove();

            if ($element.data('content') === 'zones') {
                if (!this.changedLocations[trId]) {
                    this.changedLocations[trId] = {};
                }

                this.changedLocations[trId]['zone'] = id;
                this.showButtons();

                return false;
            }

            if (!this.modelChanged[this.id]) {
                this.modelChanged[this.id] = {};
            }

            this.modelChanged[this.id][type/*'address.country'*/] = id;
            this.showButtons();

            return false;
        },

        render: function () {
            var self = this;
            var formString = _.template(ItemTemplate, {
                model      : this.model.toJSON(),
                contentType: this.contentType
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                width      : '800px',
                buttons    : [{
                    text : 'Save',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem();
                        self.gaTrackingEditConfirm();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }]

            });

            this.delegateEvents(this.events);

            populate.get('#address_country', CONSTANTS.URLS.COUNTRIES, {}, 'name', this, true);
            populate.get('#account', '/chartOfAccount/getForDd', {category: 'ACCOUNTS_INVENTORY'}, 'name', this, true, true);
            populate.get('#zones', CONSTANTS.URLS.ZONES_FOR_DD, {}, 'name', this, false, true);

            return this;
        }
    });

    return ContentView;
});
