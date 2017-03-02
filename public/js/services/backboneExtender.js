define(['Backbone'], function (Backbone) {
    function extend() {
        Backbone.Collection.prototype.getElement = function (id) {
            if (id) {
                return this.get(id);
            }

            return (this.currentElement) ? this.currentElement : this.at(0);
        };

        Backbone.Collection.prototype.setElement = function (id, model) {
            if (arguments.length === 0) {
                this.currentElement = this.at(0);
            } else if (arguments.length === 2) {
                if (model) {
                    this.currentElement = model;
                } else if (id) {
                    this.currentElement = this.get(id);
                }
            } else {
                if ((typeof (id) === 'string') && id.length === 24) {
                    this.currentElement = this.get(id);
                } else if (typeof (id) === 'object') {
                    this.currentElement = id;
                }
            }

        };

        Backbone.View.prototype.errorNotification = function (xhr) {
            if (xhr) {
                if (xhr.status === 401 || xhr.status === 403) {
                    if (xhr.status === 401) {
                        Backbone.history.navigate('login', {trigger: true});
                    } else {
                        App.render({
                            type   : 'error',
                            message: 'You do not have permission to perform this action.'
                        });
                    }
                } else {
                    if (xhr.responseJSON) {
                        // alert(xhr.responseJSON.error);
                        App.render({
                            type   : 'error',
                            message: xhr.responseJSON.error
                        });
                    } else {
                        Backbone.history.navigate('home', {trigger: true});
                    }
                }
            }
        };
    }

    return {
        apply: extend
    };
});
