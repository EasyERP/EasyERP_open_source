/**
 * Created by liliya on 17.09.15.
 */
define([
    'text!templates/Projects/projectInfo/wTrackTemplate.html'

], function (wTrackTemplate) {
    var wTrackView = Backbone.View.extend({

        el: '#weTracks',

        initialize: function (options) {
            this.models = options.model;

            this.render();
        },

        template: _.template(wTrackTemplate),

        events: {
            "click .checkbox": "checked",
            "change .listCB": "setAllTotalVals"
        },

        checked: function (e) {
            if (this.models.length > 0) {
                var checkLength = $("input.checkbox:checked").length;

                if ($("input.checkbox:checked").length > 0) {
                    // $("#top-bar-deleteBtn").show();
                    $('#check_all').prop('checked', false);

                    if (checkLength == this.models.length) {
                        $('#check_all').prop('checked', true);
                    }
                }
                else {
                    // $("#top-bar-deleteBtn").hide();
                    $('#check_all').prop('checked', false);
                }
            }
        },

        setAllTotalVals: function () {
            this.getAutoCalcField('hours', 'worked');
            this.getAutoCalcField('monHours', '1');
            this.getAutoCalcField('tueHours', '2');
            this.getAutoCalcField('wedHours', '3');
            this.getAutoCalcField('thuHours', '4');
            this.getAutoCalcField('friHours', '5');
            this.getAutoCalcField('satHours', '6');
            this.getAutoCalcField('sunHours', '7');
            this.getAutoCalcField('revenue', 'revenue', true);
            this.getAutoCalcField('cost', 'cost', true);
            this.getAutoCalcField('profit', 'profit', true);
            this.getAutoCalcField('amount', 'amount', true);
        },

        getAutoCalcField: function (idTotal, dataRow, money) {
            var footerRow = this.$el.find('#listFooter');

            var checkboxes = this.$el.find('.listCB:checked');

            var totalTd = $(footerRow).find('#' + idTotal);
            var rowTdVal = 0;
            var row;
            var rowTd;

            $(checkboxes).each(function (index, element) {
                row = $(element).closest('tr');
                rowTd = row.find('[data-content="' + dataRow + '"]');

                rowTdVal += parseFloat(rowTd.html()) * 100;
            });

            if (money) {
                totalTd.text((rowTdVal / 100).toFixed(2));
            } else {
                totalTd.text(rowTdVal / 100);
            }
        },

        render: function () {
            var self = this;
            var wTracks = this.models;
            var allInputs;
            var checkedInputs;

            self.$el.html(this.template({
                wTracks: wTracks,
                startNumber: 0
            }));

            $('#check_all').click(function () {
                var checkLength;

                allInputs = $('.listCB');
                allInputs.prop('checked', this.checked);
                checkedInputs = $("input.listCB:checked");

                if (wTracks.length > 0) {
                    checkLength = checkedInputs.length;

                    if (checkLength === wTracks.length) {
                        $('#check_all').prop('checked', true);
                    } else {
                        $('#check_all').prop('checked', false);
                    }
                }

                self.setAllTotalVals();
            });

            return this;
        }
    });

    return wTrackView;
});