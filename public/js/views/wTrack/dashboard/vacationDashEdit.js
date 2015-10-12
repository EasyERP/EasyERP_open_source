define(["text!templates/wTrack/dashboard/vacationDashEdit.html",
        //todo load model and save changed values
        'async'
    ],
    function (template, async) {
        "use strict";
        var CreateView = Backbone.View.extend({
                template: _.template(template),
                responseObj: {},

                events: {
                    "click td.editable": "editRow",
                    "keydown input.editing ": "keyDown"
                },

                initialize: function (options) {
                    _.bindAll(this, "saveItem");

                    this.render(options);
                },

                keyDown: function (e) {
                    if (e.which === 13) {
                        this.autoCalc(e);
                    }
                },

                stopDefaultEvents: function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                },

                hideDialog: function () {
                    $(".edit-dialog").remove();
                },

                saveItem: function () {
                    var thisEl = this.$el;


                },

                hideNewSelect: function () {
                    $(".newSelectList:not('.generateTypeUl')").remove();
                    $(".generateTypeUl").hide();
                },

                autoCalc: function (e) {
                    var targetEl = $(e.target);
                    var isInput = targetEl.prop("tagName") === 'INPUT';
                    var tr = targetEl.closest('tr');
                    var edited = tr.find('input.edited');
                    var days = tr.find('.autoCalc');
                    var editedCol = edited.closest('td');
                    var worked = 0;
                    var value;
                    var calcEl;
                    var workedEl = tr.find('[data-content="worked"]');

                    function eplyDefaultValue(el) {
                        var value = el.text();
                        var children = el.children('input');

                        if (value === '' || undefined) {
                            if (children.length) {
                                value = children.val();
                            } else {
                                value = '0';
                            }
                        }

                        return value;
                    };

                    for (var i = days.length - 1; i >= 0; i--) {
                        calcEl = $(days[i]);

                        value = eplyDefaultValue(calcEl);

                        if (value === undefined && isInput) {
                            editedCol = targetEl.closest('td');
                            edited = targetEl;
                        }

                        worked += parseInt(value);
                    }

                    editedCol.text(edited.val());
                    edited.remove();

                    workedEl.text(worked);
                },

                editRow: function (e) {
                    $(".newSelectList").hide();

                    var el = $(e.target);
                    var tr = $(e.target).closest('tr');
                    var input = tr.find('input.editing');
                    var wTrackId = tr.data('id');
                    var content = el.data('content');
                    var tempContainer;
                    var width;
                    var value;
                    var insertedInput;

                    input.removeClass('editing');
                    input.addClass('edited');

                    tempContainer = el.text();
                    width = el.width() - 6;
                    el.html('<input class="editing" type="text" value="' + tempContainer + '"  maxLength="4" style="width:' + width + 'px">');

                    insertedInput = el.find('input');
                    insertedInput.focus();
                    insertedInput[0].setSelectionRange(0, insertedInput.val().length);

                    if (input.length) {
                        if (!input.val()) {
                            input.val(0);
                        }

                        this.autoCalc(e);
                    }

                    return false;
                },

                render: function (data) {
                    var formString = this.template(data);
                    var self = this;

                    this.$el = $(formString).dialog({
                        closeOnEscape: false,
                        autoOpen: true,
                        resizable: false,
                        title: "Edit Project",
                        dialogClass: "edit-dialog",
                        width: "900px",
                        buttons: {
                            save: {
                                text: "Save",
                                class: "btn",
                                click: self.saveItem
                            },
                            cancel: {
                                text: "Cancel",
                                class: "btn",
                                click: self.hideDialog
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