// Filename: app.js
define([
	'router',
	'communication',
	'custom',
	'socket.io'
], function (Router, Communication, Custom, io) {
	var initialize = function () {
		var appRouter = new Router();

		appRouter.checkLogin = Communication.checkLogin;
		Communication.checkLogin(Custom.runApplication);
	};
	var applyDefaults = function () {
		$.datepicker.setDefaults({
			//dateFormat:"dd/mm/yy"
			firstDay: 1
		});
		//add ability to clear console by calling -> console.API.clear();
		if (typeof console._commandLineAPI !== 'undefined') {
			console.API = console._commandLineAPI;
		} else if (typeof console._inspectorCommandLineAPI !== 'undefined') {
			console.API = console._inspectorCommandLineAPI;
		} else if (typeof console.clear !== 'undefined') {
			console.API = console;
		}
		//add startsWith function to strings
		if (typeof String.prototype.startsWith != 'function') {
			String.prototype.startsWith = function (str) {
				if (str == "All") return true;
				if (str == "0-9") return !isNaN(parseInt(this[0]));
				return this.indexOf(str) == 0;
			};
		}
		$.extend($.ui.dialog.prototype.options, {
			modal    : true,
			resizable: false,
			draggable: true,
			autoOpen : true,
			width    : 700,
			create   : function (event, ui) {
				var win = $(window);
				var dialog = $(event.target).parent(".ui-dialog");
				//var top = $(document).scrollTop() + (win.height() - dialog.height() - 200) / 2;
				//var left = (win.width() - dialog.width()) / 2;
				dialog.css({
					position: "fixed"
				});
			}
		});
		$.datepicker.setDefaults({
			dateFormat: "d M, yy",

			onChangeMonthYear: function (year, month) {
				var mon;
				switch (month) {
					case 1:
						mon = 'Jan';
						break;
					case 2:
						mon = 'Feb';
						break;
					case 3:
						mon = 'Mar';
						break;
					case 4:
						mon = 'Apr';
						break;
					case 5:
						mon = 'May';
						break;
					case 6:
						mon = 'Jun';
						break;
					case 7:
						mon = 'Jul';
						break;
					case 8:
						mon = 'Aug';
						break;
					case 9:
						mon = 'Sep';
						break;
					case 10:
						mon = 'Oct';
						break;
					case 11:
						mon = 'Nov';
						break;
					case 12:
						mon = 'Dec';
						break;
				}
				;
				var target = $(this);
				var day = target.val().split(' ')[0] || '01';
				target.val(day + ' ' + mon + ', ' + year);
			}
		});
	};

	return {
		initialize   : initialize,
		applyDefaults: applyDefaults
	}
});
