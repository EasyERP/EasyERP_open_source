define([
    'Backbone',
    'Underscore',
    'text!templates/Opportunities/form/FormTemplate.html',
    'text!templates/Opportunities/workflowProgress.html',
    'views/Editor/NoteView',
    'views/Editor/AttachView',
    'views/Opportunities/EditView',
    'constants',
    'dataService',
    'populate',
    'constants',
    'views/selectView/selectView'
], function (Backbone, _, OpportunitiesFormTemplate, workflowProgress, NoteView, AttachView, EditView, constants, dataService, populate, CONSTANTS, SelectView) {
    var FormOpportunitiesView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.formModel = options.model;
            this.formModel.urlRoot = constants.URLS.OPPORTUNITIES;
            this.responseObj = {};
        },

        events: {
            click                                                        : 'hideNewSelect',
            'click #tabList a'                                           : 'switchTab',
            'mouseenter .editable:not(.quickEdit)'                       : 'quickEdit',
            'mouseleave .editable'                                       : 'removeEdit',
            'click #editSpan'                                            : 'editClick',
            'click #cancelSpan'                                          : 'cancelClick',
            'click #saveSpan'                                            : 'saveClick',
            'click .tabListItem'                                         : 'changeWorkflow',
            'click .current-selected:not(.jobs)'                         : 'showNewSelect',
            'click .newSelectList li:not(.miniStylePagination)'          : 'chooseOption'
        },

        hideNewSelect: function () {
            this.$el.find('.newSelectList').hide();

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        saveClick: function (e) {
            e.preventDefault();

            var parent = $(e.target).parent().parent();
            var field = parent.attr('data-id').replace('_', '.');
            var value = this.$el.find('#editInput').val();
            var newModel = {};
            newModel[field] = value;

            parent.text(value);
            parent.removeClass('quickEdit');

            this.saveDeal(newModel);
        },


        cancelClick: function (e) {
            e.preventDefault();

            var parent = $(e.target).closest('.editable');
            parent.removeClass('quickEdit');
            parent.text(this.text);
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

            this.selectView = new SelectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

            return false;
        },

        removeEdit: function () {
            $('#editSpan').remove();
            $('dd .no-long').css({width: 'auto'});
        },

        quickEdit: function (e) {
            var trId = $(e.target);

            if (trId.find('#editSpan').length === 0) {
                trId.append('<span id="editSpan" class=""><a href="javascript:;">e</a></span>');
            }
        },

        editClick: function (e) {
            var $target = $(e.target);
            var maxlength = $target.closest('.editable').find('.no-long').attr('data-maxlength') || 32;
            var parent;

            e.preventDefault();

            $('.quickEdit #editInput').remove();
            $('.quickEdit #cancelSpan').remove();
            $('.quickEdit #saveSpan').remove();
            $('.quickEdit').text(this.text).removeClass('quickEdit');

            parent = $target.closest('.editable');
            parent.addClass('quickEdit');
            this.$el.find('#editSpan').remove();
            this.text = parent.text();
            parent.text('');
            parent.append('<input id="editInput" maxlength="32" type="text" class="left"/>');
            this.$el.find('#editInput').val(this.text);
            parent.append('<span id="saveSpan"><a href="#">c</a></span>');
            parent.append('<span id="cancelSpan"><a href="#">x</a></span>');
            parent.find('#editInput').width(parent.find('#editInput').width() - 50);
        },

        changeWorkflow : function (e){
            var $target = $(e.target);
            if (!$target.hasClass('tabListItem')){
                $target = $target.closest('div');
            }
            var $thisEl = this.$el;
            var wId = $target.find('span').attr('data-id');
            var $tabs = $thisEl.find('#workflowProgress .tabListItem');
            $tabs.removeClass('passed');
            $target.prevAll().addClass('passed');
            $target.addClass('passed');
            $thisEl.find('#statusDd').text($target.text());
            this.saveDeal({workflow : wId});
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var holder = $target.parents('dd').find('.current-selected');
            var type = $target.closest('a').attr('data-id');
            var id = $target.attr('id');
            var changedObject ={};

            holder.text($target.text());
            changedObject[type] = id;


            if (holder.attr('id') === 'customerDd') {
                this.selectCustomer(id);
            } else {
                this.saveDeal(changedObject);
            }
        },

        selectCustomer: function (id) {
            var self = this;
            var $thisEl = this.$el;
            dataService.getData(CONSTANTS.URLS.CUSTOMERS, {
                id: id
            }, function (response) {
                var customer = response;
                self.formModel.set({customer : customer});

                $thisEl.find('[data-id="email"]').text(customer.email);
                $thisEl.find('[data-id="phones_phone"]').text(customer.phones.phone);
                $thisEl.find('[data-id="phones_mobile"]').text(customer.phones.mobile);
                $thisEl.find('[data-id="address_street"]').text(customer.address.street);
                $thisEl.find('[data-id="address_city"]').text(customer.address.city);
                $thisEl.find('[data-id="address_state"]').text(customer.address.state);
                $thisEl.find('[data-id="address_zip"]').text(customer.address.zip);
                $thisEl.find('[data-id="address_country"]').text(customer.address.country);

                self.saveDeal({
                    customer : customer._id,
                    email :customer.email,
                "phones.phone" : customer.phones.phone,
                "phones.mobile" : customer.phones.mobile,
                "address.street" : customer.address.street,
                "address.city" : customer.address.city,
                "address.state" : customer.address.state,
                "address.zip" : customer.address.zip,
                "address.country" : customer.address.country
                });
            }, this);

        },

        saveDeal : function (changedAttrs){
            var self = this;
            this.formModel.save(changedAttrs, {
                patch  : true,
                success : function (){
                    self.noteView.renderTimeline();
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
        },

        editItem: function () {
            // create editView in dialog here
            return new EditView({model: this.formModel});
        },

        deleteItems: function () {
            var mid = 39;

            this.formModel.destroy({
                headers: {
                    mid: mid
                },
                success: function () {
                    Backbone.history.navigate('#easyErp/Opportunities/kanban', {trigger: true});
                }
            });

        },
        render: function () {
            var formModel = this.formModel.toJSON();
            var self = this;

            this.$el.html(_.template(OpportunitiesFormTemplate, formModel));

            dataService.getData('/workflows/', {id: 'Opportunities'}, function (response){
                self.responseObj = {workflows : response.data};
                self.$el.find('#workflowProgress').append(_.template(workflowProgress, {workflows : self.responseObj.workflows, workflow : formModel.workflow}));

            });
            populate.get2name('#customerDd', CONSTANTS.URLS.CUSTOMERS, {type : 'Company'}, this, false, true);
            dataService.getData('/employees/getForDD', {isEmployee: true}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee;
                });

                self.responseObj['#salesPersonDd'] = employees;
            });
            this.noteView = new NoteView({
                model: this.formModel,
                contentType: 'opportunities'
            });
            this.$el.find('.notes').append(
                this.noteView.render().el
            );

            this.$el.find('.attachments').append(
                new AttachView({
                    model: this.formModel,
                    contentType: 'opportunities',
                    saveNewNote : this.noteView.saveNewNote
                }).render().el
            );

            return this;
        }
    });

    return FormOpportunitiesView;
});
