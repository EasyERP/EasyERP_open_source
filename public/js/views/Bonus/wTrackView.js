/**
 * Created by liliya on 17.09.15.
 */
define([
    'text!templates/Pagination/PaginationTemplate.html',
    'text!templates/Bonus/wTrackTemplate.html',
    'text!templates/wTrack/list/ListHeader.html',
    'views/wTrack/list/ListView',
    'views/wTrack/list/ListItemView',
    'collections/wTrack/filterCollection'

], function (paginationTemplate, wTrackTemplate, listTemplate, ListView, listItemView, contentCollection) {
    var wTrackView = ListView.extend({

        el: '#weTracks',

        initialize: function (options) {
            this.collection = new contentCollection({
                viewType: 'list',
                page: 1,
                count: 100,
                contentType: 'wTrack',
                newCollection: false,
                models: options.model
            });

           // this.collection = this.collection.models[0].attributes.models;

            this.render();
        },

        template: _.template(wTrackTemplate),

        events: {
            "click .itemsNumber": "switchPageCounter",
            "click .showPage": "showPage",
            "change #currentShowPage": "showPage",
            "click #previousPage": "previousPage",
            "click #nextPage": "nextPage",
            "click .checkbox": "checked",
            "click .stageSelect": "showNewSelect",
            "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
            "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
            "click td.editable": "editRow",
            "mouseover .currentPageList": "itemsNumber",
            "click": "hideItemsNumber",
            "click #firstShowPage": "firstPage",
            "click #lastShowPage": "lastPage",
            "click .oe_sortable": "goSort",
            "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
            "change .autoCalc": "autoCalc",
            "change .editable ": "setEditable",
            "keydown input.editing ": "keyDown",
            "change .listCB": "setAllTotalVals"
        },

        //checked: function (e) {
        //    if (this.models.length > 0) {
        //        var checkLength = $("input.checkbox:checked").length;
        //
        //        if ($("input.checkbox:checked").length > 0) {
        //           // $("#top-bar-deleteBtn").show();
        //            $('#check_all').prop('checked', false);
        //
        //            if (checkLength == this.models.length) {
        //                $('#check_all').prop('checked', true);
        //            }
        //        }
        //        else {
        //           // $("#top-bar-deleteBtn").hide();
        //            $('#check_all').prop('checked', false);
        //        }
        //    }
        //},

        //setAllTotalVals: function () {
        //    this.getAutoCalcField('hours', 'worked');
        //    this.getAutoCalcField('monHours', '1');
        //    this.getAutoCalcField('tueHours', '2');
        //    this.getAutoCalcField('wedHours', '3');
        //    this.getAutoCalcField('thuHours', '4');
        //    this.getAutoCalcField('friHours', '5');
        //    this.getAutoCalcField('satHours', '6');
        //    this.getAutoCalcField('sunHours', '7');
        //    this.getAutoCalcField('revenue', 'revenue', true);
        //    this.getAutoCalcField('cost', 'cost', true);
        //    this.getAutoCalcField('profit', 'profit', true);
        //    this.getAutoCalcField('amount', 'amount', true);
        //},

        //getAutoCalcField: function (idTotal, dataRow, money) {
        //    var footerRow = this.$el.find('#listFooter');
        //
        //    var checkboxes = this.$el.find('.listCB:checked');
        //
        //    var totalTd = $(footerRow).find('#' + idTotal);
        //    var rowTdVal = 0;
        //    var row;
        //    var rowTd;
        //
        //    $(checkboxes).each(function (index, element) {
        //        row = $(element).closest('tr');
        //        rowTd = row.find('[data-content="' + dataRow + '"]');
        //
        //        rowTdVal += parseFloat(rowTd.html()) * 100;
        //    });
        //
        //    if (money) {
        //        totalTd.text((rowTdVal / 100).toFixed(2));
        //    } else {
        //        totalTd.text(rowTdVal / 100);
        //    }
        //},

        //render: function () {
        //    var self = this;
        //    var currentEl = this.$el;
        //    var pagenation;
        //    var checkedInputs;
        //    var allInputs;
        //
        //    currentEl.html('');
        //    currentEl.append(_.template(listTemplate));
        //    currentEl.append(new listItemView({
        //        collection: this.collection,
        //        page: this.page,
        //        itemsNumber: this.collection.namberToShow
        //    }).render());//added two parameters page and items number
        //
        //    $(document).on("click", function (e) {
        //        self.hideItemsNumber(e);
        //    });
        //
        //    currentEl.append(_.template(paginationTemplate));
        //
        //    pagenation = this.$el.find('.pagination');
        //
        //    if (this.collection.length === 0) {
        //        pagenation.hide();
        //    } else {
        //        pagenation.show();
        //    }
        //    currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
        //
        //    $('#check_all').click(function () {
        //        var checkLength;
        //
        //        allInputs = $('.listCB');
        //        allInputs.prop('checked', this.checked);
        //        checkedInputs = $("input.listCB:checked");
        //
        //        if (self.collection.length > 0) {
        //            checkLength = checkedInputs.length;
        //
        //            self.checkProjectId($('#check_all'), checkLength);
        //
        //            if (checkLength > 0) {
        //                $("#top-bar-deleteBtn").show();
        //
        //                if (checkLength === self.collection.length) {
        //                    $('#check_all').prop('checked', true);
        //                }
        //            } else {
        //                $("#top-bar-deleteBtn").hide();
        //                $('#check_all').prop('checked', false);
        //            }
        //        }
        //
        //        self.setAllTotalVals();
        //        self.copyEl.hide();
        //    });
        //
        //    //$('#check_all').click(function () {
        //    //    var checkLength;
        //    //
        //    //    allInputs = $('.listCB');
        //    //    allInputs.prop('checked', this.checked);
        //    //    checkedInputs = $("input.listCB:checked");
        //    //
        //    //    if (wTracks.length > 0) {
        //    //        checkLength = checkedInputs.length;
        //    //
        //    //            if (checkLength === wTracks.length) {
        //    //                $('#check_all').prop('checked', true);
        //    //            } else {
        //    //            $('#check_all').prop('checked', false);
        //    //        }
        //    //    }
        //    //
        //    //    self.setAllTotalVals();
        //    //});
        //    this.genInvoiceEl = $('#top-bar-generateBtn');
        //    this.copyEl = $('#top-bar-copyBtn');
        //
        //    return this;
        //}
    });

    return wTrackView;
});