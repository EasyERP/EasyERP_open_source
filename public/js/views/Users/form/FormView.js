define([
    'text!templates/Users/form/FormTemplate.html',
    'views/Users/EditView'
],

    function (FormTemplate, EditView) {
        var FormView = Backbone.View.extend({
            el: '#content-holder',
            initialize: function (options) {
                this.formModel = options.model;
				this.formModel.urlRoot = "/Users";
            },

            render: function () {
                var formModel = this.formModel.toJSON();
                this.$el.html(_.template(FormTemplate, formModel));
                return this;
            },
            
            editItem: function () {
                new EditView({ model: this.formModel });
            },
            
            deleteItems: function () {
                var mid = 39;
                   
                this.formModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        Backbone.history.navigate("#easyErp/Users/list", { trigger: true });
                    },
                    error: function (model, res) {
						if (res.status===403){
							alert("You do not have permission to perform this action");
						}else{

							alert(JSON.parse(res.responseText).error);
						}
                    }
                });

            }
        });

        return FormView;
    });
