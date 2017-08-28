define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/journalEntry/jobsTemplate.html',
    'text!templates/journalEntry/PaymentTemplate.html',
    'text!templates/journalEntry/ProformaTemplate.html',
    'text!templates/journalEntry/InvoiceTemplate.html',
    'text!templates/journalEntry/EmployeesTemplate.html',
    'text!templates/journalEntry/OrderTemplate.html',
    'models/InvoiceModel',
    'models/jobsModel',
    'models/EmployeesModel',
    'models/PaymentModel',
    'models/orderModel',
    'helpers',
    'd3'
], function (Backbone, $, _, jobsTemplate, PaymentTemplate, ProformaTemplate, InvoiceTemplate, EmployeesTemplate, OrderTemplate, InvoiceModel, JobsModel, EmployeesModel, PaymentModel, OrderModel, helpers, d3) {
    'use strict';
    var View = Backbone.View.extend({
        el            : '#content-holder',
        JobsModel     : JobsModel,
        InvoiceModel  : InvoiceModel,
        PaymentModel  : PaymentModel,
        EmployeesModel: EmployeesModel,
        OrderModel    : OrderModel,

        initialize: function (options) {
            var self = this;

            this.type = options.type;
            this.employee = options.employee;
            this.dataId = options.dataId;

            this.Employees = _.template(EmployeesTemplate);
            this.Invoice = _.template(InvoiceTemplate);
            this.dividendInvoice = _.template(InvoiceTemplate);
            this.expensesInvoice = _.template(InvoiceTemplate);
            this.Proforma = _.template(ProformaTemplate);
            this.Payment = _.template(PaymentTemplate);
            this.jobs = _.template(jobsTemplate);
            this.wTrack = _.template(jobsTemplate);
            this.goodsInNote = _.template(OrderTemplate);
            this.goodsOutNote = _.template(OrderTemplate);

            this.getData(function () {
                self.render();
            });
        },

        getData: function (cb) {
            var self = this;
            var data;
            var type = this.type;
            var dataEmployee = this.employee;
            var dataId = this.dataId;
            var model;

            switch (type) {
                case 'wTrack':
                    model = new this.JobsModel();
                    data = {
                        employee: dataEmployee,
                        _id     : dataId
                    };

                    model.urlRoot = '/journalEntries/jobs';
                    break;
                case 'expensesInvoice':
                case 'dividendInvoice':
                case 'Invoice':
                    model = new this.InvoiceModel();
                    data = {
                        _id: dataId
                    };

                    model.urlRoot = '/journalEntries/invoices';

                    break;
                case 'Proforma':
                    model = new this.InvoiceModel();
                    data = {
                        _id     : dataId,
                        proforma: true
                    };

                    model.urlRoot = '/journalEntries/invoices';

                    break;
                case 'jobs':
                    model = new this.JobsModel();
                    data = {
                        _id: dataId
                    };

                    model.urlRoot = '/journalEntries/jobs';

                    break;
                case 'Payment':
                    model = new this.PaymentModel();
                    data = {
                        _id: dataId
                    };

                    model.urlRoot = '/journalEntries/payments';

                    break;
                case 'goodsOutNote':
                case 'goodsInNote':
                    model = new this.OrderModel();
                    data = {
                        goodsId: dataId,
                        type   : type
                    };

                    model.urlRoot = '/journalEntries/order';

                    break;
                case 'Employees':
                    model = new this.EmployeesModel();
                    data = {
                        _id: dataId
                    };

                    model.urlRoot = '/journalEntries/employees';

                    break;

                // skip default;
            }

            if (model) {
                model.fetch({
                    data   : data,
                    success: function (model) {
                       self.model = model;

                        App.stopPreload();

                        cb();
                    },

                    error: function () {
                        App.stopPreload();

                        App.render({
                            type   : 'error',
                            message: 'Please refresh browser'
                        });
                    }
                });
            } else {
                App.stopPreload();

                App.render({
                    type   : 'notify',
                    message: 'No Source Document is required'
                });
            }
        },

        renderCostCharts: function () {
            var differenceValue = parseFloat(this.model.attributes.differenceAmount);
            var payedValue = parseFloat(this.model.attributes.paidAmount);
            var invoiced = parseFloat(this.model.attributes.invoiced);
            var labelValue = (payedValue / invoiced * 100).toFixed(2);
            var width = parseInt($('.half-block').height());
            var radius = width / 2;
            var label = 'Paid';
            var height = width;
            var color = {
                value: '#587b41',
                text : '#000000',
                empty: '#c5c7c7'
            };
            var arc = d3.svg.arc()
                .outerRadius(radius * 0.85)
                .innerRadius(radius * 0.75);
            var pie = d3.layout.pie()
                .sort(null)
                .value(function (d) {
                    return d.count;
                });
            var arcGroup;
            var data;
            var svg;
            var g;

            data = [
                {label: 'value', count: payedValue},
                {label: 'empty', count: differenceValue}
            ];

            svg = d3.select('#chart')
                .append('svg')
                .attr({
                    width : width,
                    height: height
                });

            g = svg.append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

            arcGroup = g.selectAll('.arc')
                .data(pie(data))
                .enter()
                .append('g')
                .attr('class', 'arc');

            arcGroup.append('path')
                .attr({
                    'd': arc
                })
                .style({
                    'fill': function (d) {
                        return color[d.data.label];
                    }
                });

            svg.append('text')
                .text(label)
                .attr({
                    'class'    : '_label',
                    'fill'     : color.text,
                    'font-size': '14px',
                    'x'        : function () {
                        return width / 2 - d3.select(this).node().getBBox().width / 2;
                    },
                    'y'        : width / 2 - 5
                });

            svg.append('text')
                .text(labelValue + '%')
                .attr({
                    'class'      : '_valueLabel',
                    'fill'       : color.text,
                    'font-size'  : '18px',
                    'font-weight': 'bold',

                    'x': function () {
                        return width / 2 - d3.select(this).node().getBBox().width / 2;
                    },

                    'y': width / 2 + 15
                })
        },

        hideDialog: function () {
            $('.dialog').remove();
        },

        render: function () {
            var self = this;
            var temp = this[this.type];
            var width = '700px';
            var model = this.model;
            var template;

            if (model.toJSON()[0]) {
                model = model.get('0');
            } else {
                model = model.toJSON();
            }

            template = temp({
                currencySplitter: helpers.currencySplitter,
                currencyClass   : helpers.currencyClass,
                addressMaker    : helpers.addressMaker,
                model           : model,
                type            : this.type,
                employee        : this.employee
            });

            if (this.type === 'Payment') {
                width = '845px';
            }

            this.$el = $(template).dialog({
                autoOpen   : true,
                width      : width,
                dialogClass: 'dialog',
                title      : 'SourceDocument',
                buttons    : [
                    {
                        text : 'Close',
                        class: 'btn',
                        click: self.hideDialog
                    }]

            });

            if (this.$el.find('#chart').length) {
                this.renderCostCharts();
            }

            return this;
        }
    });

    return View;
});
