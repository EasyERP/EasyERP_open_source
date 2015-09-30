/**
 * Created by liliya on 30.09.15.
 */
define([
        "text!templates/Projects/projectInfo/generate.html"
    ],
    function (generateTemplate) {
        var CreateView = Backbone.View.extend({
            template: _.template(generateTemplate),

            initialize: function(options){
                this.model = options.model;
            },

            generateItems: function(){

            },

            hideDialog: function () {
                $(".edit-dialog").remove();
            },

            render: function(){
                var dialog = this.template();
                var self = this;

                this.$el = $(dialog).dialog({
                    dialogClass: "edit-dialog",
                    width: 800,
                    title: "Generate weTrack",
                    buttons:{
                        save:{
                            text: "Generate",
                            class: "btn",
                            id:"generateBtn",
                            click: self.generateItems()
                        },
                        cancel:{
                            text: "Cancel",
                            class: "btn",
                            click: function(){
                                self.hideDialog();
                            }
                        }
                    }
                });
        }
        });
        return CreateView;
    });