define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/wTrack/createJob.html'
], function (Backbone, $, _, generateTemplate) {
    'use strict';

    var CreateView = Backbone.View.extend({
        template   : _.template(generateTemplate),
        responseObj: {},
        events     : {},

        initialize: function (options) {
            this.model = options.model;

            this.createJob = options.createJob; // ? options.createJob : true;
            this.wTrackView = options.wTrackView;

            this.modelJSON = this.model.id ? this.model.toJSON() : this.model;

            _.bindAll(this, 'generateItems');

            this.render();
        },

        stopDefaultEvents: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },

        hideDialog: function () {
            $('.wTrackDialog').remove();
        },

        generateItems: function (e) {
            var self = this;
            var jobName = $('#jobName').val();
            var nameRegExp = /^[a-zA-Z0-9\s][a-zA-Z0-9-,\s\.\/\s]+$/;
            var data = {};

            data.project = self.modelJSON._id || self.modelJSON;
            data.name = jobName;

            this.stopDefaultEvents(e);

            if (nameRegExp.test(jobName)) {
                $.ajax({
                    type       : 'Post',
                    url        : '/jobs/',
                    contentType: 'application/json',
                    data       : JSON.stringify(data),

                    success: function () {
                        self.hideDialog();

                        if (self.wTrackView) {
                            return self.wTrackView.generatedWtracks();
                        }
                    },

                    error: function () {
                        App.render({
                            type   : 'error',
                            message: 'Error'
                        });
                    }
                });
            } else {
                App.render({
                    type   : 'error',
                    message: 'Please, enter correct Job name!'
                });
            }
        },

        render: function () {
            var self = this;
            var project = this.model.id ? this.model.toJSON() : this.model;
            var dialog = this.template({
                project  : project,
                createJob: self.createJob
            });

            if (!project) {
                return;
            }

            this.$el = $(dialog).dialog({
                dialogClass: 'wTrackDialog',
                width      : 300,
                title      : 'Create Sprint',
                buttons    : {
                    save: {
                        text : 'Create',
                        class: 'btn',
                        id   : 'generateBtn',
                        click: self.generateItems
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        id   : 'cancelBtn',

                        click: function () {
                            self.hideDialog();
                        }
                    }
                }
            });

            return this;
        }
    });

    return CreateView;
});
