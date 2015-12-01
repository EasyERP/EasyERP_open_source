/**
 * Created by lilya on 01/12/15.
 */
define(["text!templates/wTrack/createJob.html"
    ],
    function (generateTemplate) {
        "use strict";
        var CreateView = Backbone.View.extend({
                template                 : _.template(generateTemplate),
                responseObj              : {},

                events: {},

                initialize: function (options) {
                    this.model = options.model;

                    this.createJob = options.createJob; //? options.createJob : true;
                    this.wTrackView = options.wTrackView;

                    this.modelJSON = this.model.id ? this.model.toJSON() : this.model;

                    _.bindAll(this, 'generateItems');

                    this.render();
                },

                keyDown: function (e) {
                    if (e.which === 13) {
                        this.setChangedValueToModel(e);
                    }
                },

                stopDefaultEvents: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                },

                hideDialog: function () {
                    $(".wTrackDialog").remove();
                },

                setChangedValueToModel: function (elem) {
                    var editedElement = elem || this.$listTable.find('.editing');
                    var editedCol;
                    var editedElementRowId;
                    var editedElementContent;
                    var editedElementValue;

                    if (editedElement.length) {

                        if (editedElement.length > 1) {
                            editedElement = $(editedElement[1]);
                        }

                        editedCol = editedElement.closest('td');
                        editedElementRowId = editedElement.closest('tr').data('id');
                        editedElementContent = editedCol.data('content');
                        editedElementValue = editedElement.val();

                        if (editedElementValue) {
                            editedCol.removeClass('errorContent');
                        }

                        this.resultArray[editedElementRowId][editedElementContent] = editedElementValue;

                        if (!elem) {
                            editedCol.not('.endDateTD').text(editedElementValue);
                            editedElement.not('.endDateInput').remove();
                        }
                    }
                },

                generateItems: function (e) {
                    var self = this;
                    var jobName = $("#jobName").val();
                    var nameRegExp = /^[a-zA-Z0-9\s][a-zA-Z0-9-,\s\.\/\s]+$/;

                    this.stopDefaultEvents(e);

                    if (nameRegExp.test(jobName)) {
                        $.ajax({
                            type       : 'Post',
                            url        : '/jobs/',
                            contentType: "application/json",

                            beforeSend: function (xhr) {
                                xhr.setRequestHeader("project", self.modelJSON._id);
                                xhr.setRequestHeader("jobname", jobName);
                            },

                            success: function () {
                                self.hideDialog();

                                if (self.wTrackView) {
                                    return self.wTrackView.generatedWtracks();
                                }
                            },
                            error  : function () {
                                alert('error');
                            }
                        });
                    } else {
                        alert("Please, enter correct Job name!");
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
                        dialogClass: "wTrackDialog",
                        width      : 300,
                        title      : "Create Sprint",
                        buttons    : {
                            save  : {
                                text : "Create",
                                class: "btn",
                                id   : "generateBtn",
                                click: self.generateItems
                            },
                            cancel: {
                                text : "Cancel",
                                class: "btn",
                                click: function () {
                                    self.hideDialog();
                                }
                            }
                        }
                    });

                    return this;
                }
            })
            ;
        return CreateView;
    })
;