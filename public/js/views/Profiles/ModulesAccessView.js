define([
    "text!templates/Profiles/ModulesAccessListTemplate.html"
],
    function (ModulesAccessTemplate) {
        var ViewName = Backbone.View.extend({
            el: "#content-holder",
            template: _.template(ModulesAccessTemplate),
            initialize: function (options) {
                this.action = options.action;
                this.profilesCollection = options.profilesCollection;
                this.render();
            },
            filterCollection:function(){
                this.profile = this.profilesCollection.get('5264f88d22be433c0b000003');
                if(!this.profile)
                    throw new Error("No profile found after filter: ModulesTableView -> filterCollection");
            },
            render: function () {
                this.filterCollection();
                this.$el.html(
                    this.template({
                            profile:this.profile.toJSON()
                        }));
                this.$el.html(this.template({ profile: this.profile, action: this.action }));
                return this;
            }

    });

        return ViewName;
    });