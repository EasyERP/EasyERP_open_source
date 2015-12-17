define([
    'text!templates/login/LoginTemplate.html',
    'custom',
    'communication'
], function (LoginTemplate, Custom, Communication) {

    var LoginView = Backbone.View.extend({
        el: '#wrapper',

        initialize   : function (options) {
            if (options && options.dbs) {
                this.render(options);
            } else {
                this.render();
            }
        },
        events       : {
            "submit #loginForm"  : "login",
            "click .login-button": "login",
            "focus #ulogin"      : "usernameFocus",
            "focus #upass"       : "passwordFocus",
            "focusout #ulogin"   : "usernameFocus",
            "focusout #upass"    : "passwordFocus",
            "click .remember-me" : "checkClick"
        },
        render       : function (options) {
            $('title').text('Login');
            if (options) {
                this.$el.html(_.template(LoginTemplate, {options: options.dbs}));
            } else {
                this.$el.html(LoginTemplate);
                $("#loginForm").addClass("notRegister");
            }
            return this;
        },
        usernameFocus: function (event) {
            this.$el.find(".icon-login").toggleClass("active");
        },
        passwordFocus: function (event) {
            this.$el.find(".icon-pass").toggleClass("active");

        },

        checkClick: function (event) {
            this.$el.find(".remember-me").toggleClass("active");
            if (this.$el.find("#urem").attr("checked")) {
                this.$el.find("#urem").removeAttr("checked");
            } else {
                this.$el.find("#urem").attr("checked", "checked");
            }
        },

        login: function (event) {
            event.preventDefault();

            var err = "";
            var currentDb = this.$el.find("#dbs :selected").data("id");

            App.currentDb = currentDb;

            if ((currentDb === "weTrack") || (currentDb === "production") || (currentDb === "development")) {
                App.weTrack = true;
            } else {
                App.weTrack = false;
            }

            $("#loginForm").removeClass("notRegister");
            $("#loginForm").removeClass("notRegister");

            var data = {
                login: this.$("#ulogin").val(),
                pass : this.$("#upass").val(),
                dbId : currentDb
            };

            if (data.login.length < 3) {
                err += "Login must be longer than 3 characters<br/>";
            }
            if (data.pass.length < 3) {
                err += "Password must be longer than 3 characters";
            }
            if (err) {
                $("#loginForm .error").html(err);
                $("#loginForm").addClass("notRegister");
                return;
            }
            if (data.login == "") {
                $("#loginForm").addClass("notRegister");
            }
            $.ajax({
                url    : "/login",
                type   : "POST",
                data   : data,
                success: function () {
                    Custom.runApplication(true);
                },
                error  : function () {
                    //Custom.runApplication(false, "Server is unavailable...");
                    $("#loginForm").addClass("notRegister");
                    $("#loginForm .error").text("Such user doesn't registered");
                }
            });
        }
    });

    return LoginView;

});