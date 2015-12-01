/**
 * Created by lilya on 27/11/15.
 */
define([
        'text!templates/ChartOfAccount/list/ListHeader.html',
        'text!templates/ChartOfAccount/list/ListTemplate.html',
        'collections/ChartOfAccount/filterCollection',
        'collections/ChartOfAccount/editCollection',
        "populate"
    ],
    function (listHeaderTemplate, listTemplate, contentCollection, EditCollection, populate) {
        var ProjectsListView = Backbone.View.extend({
            el         : '#content-holder',
            contentType: "ChartOfAccount",
            changedModels: {},

            events: {
                "click .oe_sortable": "goSort",
                "click td.editable" : "editRow",
                "change .editable"  : "setEditable"
            },

            initialize: function (options) {

                this.collection = options.collection;

                this.render();
            },

            editRow: function (e, prev, next) {
                $(".newSelectList").hide();
                var el = $(e.target);
                var tr = $(e.target).closest('tr');
                var trId = tr.data('id');
                var colType = el.data('type');
                var isSelect = colType !== 'input' && el.prop("tagName") !== 'INPUT';
                var tempContainer;
                var width;

                if (trId && el.prop('tagName') !== 'INPUT') {
                    this.modelId = trId;
                    this.setChangedValueToModel();
                }

                if (isSelect) {
                    populate.showSelect(e, prev, next, this);
                } else {
                    tempContainer = el.text();
                    width = el.width() - 6;
                    el.html('<input class="editing" type="text" value="' + tempContainer + '"  style="width:' + width + 'px">');
                }

                return false;
            },

            setChangedValueToModel: function () {
                var editedElement = this.$listTable.find('.editing');
                var editedCol;
                var editedElementRowId;
                var editedElementContent;
                var editedElementValue;

                if (editedElement.length) {
                    editedCol = editedElement.closest('td');
                    editedElementRowId = editedElement.closest('tr').data('id');
                    editedElementContent = editedCol.data('content');
                    editedElementValue = editedElement.val();

                    if (!this.changedModels[editedElementRowId]) {
                        this.changedModels[editedElementRowId] = {};
                    }

                    this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;
                    editedCol.text(editedElementValue);
                    editedElement.remove();
                }
            },

            goSort: function (e) {
                var target$;
                var currentParrentSortClass;
                var sortClass;
                var sortConst;
                var sortBy;
                var sortObject;

                this.collection.unbind('reset');
                this.collection.unbind('showmore');

                target$ = $(e.target).closest('th');
                currentParrentSortClass = target$.attr('class');
                sortClass = currentParrentSortClass.split(' ')[1];
                sortConst = 1;
                sortBy = target$.data('sort');
                sortObject = {};

                if (!sortClass) {
                    target$.addClass('sortDn');
                    sortClass = "sortDn";
                }
                switch (sortClass) {
                    case "sortDn":
                    {
                        target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                        target$.removeClass('sortDn').addClass('sortUp');
                        sortConst = 1;
                    }
                        break;
                    case "sortUp":
                    {
                        target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                        target$.removeClass('sortUp').addClass('sortDn');
                        sortConst = -1;
                    }
                        break;
                }
                sortObject[sortBy] = sortConst;

                this.fetchSortCollection(sortObject);
            },

            fetchSortCollection: function (sortObject) {
                this.sort = sortObject;
                this.collection = new contentCollection({
                    viewType        : 'list',
                    sort            : sortObject,
                    page            : this.page,
                    count           : this.defaultItemsNumber,
                    filter          : this.filter,
                    parrentContentId: this.parrentContentId,
                    contentType     : this.contentType,
                    newCollection   : this.newCollection
                });
                this.collection.bind('reset', this.renderContent, this);
                this.collection.bind('showmore', this.showMoreContent, this);
            },

            renderContent: function () {
                var currentEl = this.$el;
                var template = _.template(listTemplate);
                var tBody = currentEl.find('#chartOfAccount');

                tBody.empty();

                if (this.collection.length > 0) {
                    this.$el.find('#chartOfAccount').html(template({
                        collection: this.collection.toJSON()
                    }));
                }
            },

            hideSaveCancelButtons: function () {
                var saveBtn = $("#top-bar-saveBtn");
                var cancelBtn = $("#top-bar-deleteBtn");

                saveBtn.hide();
                cancelBtn.hide();
            },

            render: function () {
                var self = this;
                var currentEl;
                var template = _.template(listTemplate);
                currentEl = this.$el;

                currentEl.html('');
                currentEl.html(_.template(listHeaderTemplate));
                currentEl.find('#chartOfAccount').html(template({
                    collection: this.collection.toJSON()
                }));


                this.hideSaveCancelButtons();

                $('#check_all').click(function () {
                    $(':checkbox').prop('checked', this.checked);
                    if ($("input.checkbox:checked").length > 0) {
                        $("#top-bar-deleteBtn").show();
                    } else {
                        $("#top-bar-deleteBtn").hide();
                    }
                });

                setTimeout(function () {
                    self.editCollection = new EditCollection(self.collection.toJSON());
                    self.editCollection.on('saved', self.savedNewModel, self);
                    self.editCollection.on('updated', self.updatedOptions, self);

                    self.$listTable =  currentEl.find('#chartOfAccount');
                }, 10);

                return this;
            }
        });

        return ProjectsListView;
    });
