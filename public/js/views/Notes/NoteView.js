define([
    'text!templates/Notes/NoteTemplate.html'

], function (NoteTemplate) {
    var NoteView = Backbone.View.extend({

        initialize: function() {
        },
        events: {
            "click #noteArea" : "expandNote",
            "click #cancelNote" : "cancelNote",
            "click #addNote" : "saveNote",
            "click .addTitle" : "showTitle",
            "click .editDelNote": "editDelNote"
        },
            editDelNote: function (e) {
                var id = e.target.id;
                var k = id.indexOf('_');
                var type = id.substr(0, k);
                var id_int = id.substr(k + 1);
                var currentModel = this.model;
                var notes = currentModel.get('notes');

                switch (type) {
                    case "edit":
                        {
							$(".title-wrapper").show();
							$("#noteArea").attr("placeholder","").parents(".addNote").addClass("active");

                            $('#noteArea').val($('#' + id_int).find('.noteText').text());
                            $('#noteTitleArea').val($('#' + id_int).find('.noteTitle').text());
                            $('#getNoteKey').attr("value", id_int);
                            break;
                        }
                    case "del":
                        {

                            var newNotes = _.filter(notes, function (note) {
                                if (note._id != id_int) {
                                    return note;
                                }
                            });
                            if (confirm("You realy want to remove note? ")) {
                                currentModel.save({ 'notes': newNotes },
                                    {
                                        headers: {
                                            mid: 39
                                        },
                                        patch: true,
                                        success: function () {
                                            $('#' + id_int).remove();
                                        }
                                    });
                            }
                            break;
                        }
                }
            },

		expandNote : function(e){
			if (!$(e.target).parents(".addNote").hasClass("active")){
				$(e.target).attr("placeholder","").parents(".addNote").addClass("active");
				$(".addTitle").show();
			}
		},
        
		cancelNote : function(e){
			$(e.target).parents(".addNote").find("#noteArea").attr("placeholder","Add a Note...").parents(".addNote").removeClass("active");
			$(e.target).parents(".addNote").find("#noteArea").val("");
			$('#getNoteKey').val('');// remove id from hidden field if note editing is cancel
			$(".title-wrapper").hide();
			$(".addTitle").hide();
			$('#noteArea').val('');
            $('#noteTitleArea').val('');
            $('#getNoteKey').attr("value", '');
        },

		saveNote : function(e){
			var self = this;
			if ($(e.target).parents(".addNote").find("#noteArea").val().replace(/ /g,'') || $(e.target).parents(".addNote").find("#noteTitleArea").val().replace(/ /g,'')){
				$(e.target).parents(".addNote").find("#noteArea").attr("placeholder","Add a Note...").parents(".addNote").removeClass("active");
				$(".title-wrapper").hide();
				$(".addTitle").hide();
			}
			else{
				$(e.target).parents(".addNote").find("#noteArea").focus();
			}

				var self = this;
                e.preventDefault();
                var val = $.trim($('#noteArea').val()).replace(/</g, "&#60;").replace(/>/g, "&#62;");
                var title = $.trim($('#noteTitleArea').val()).replace(/</g, "&#60;").replace(/>/g, "&#62;");
                if (!val&&!title) { //textarrea notes not be empty
                    alert("Note can not be empty");
                } else {
                    if (val.replace(/ /g, '') || title.replace(/ /g, '')) {
                        var formModel = this.model;
                        var notes = formModel.get('notes');
                        var arrKeyStr = $('#getNoteKey').attr("value");
                        var noteObj = {
                            note: '',
                            title: ''
                        };
                        if (arrKeyStr) {
                            var editNotes = _.map(notes, function(note) {
                                if (note._id == arrKeyStr) {
                                    note.note = val;
                                    note.title = title;
                                }
                                return note;
                            });
                            formModel.save({ 'notes': editNotes },
                                {
                                    headers: {
                                        mid: 39
                                    },
                                    patch: true,
                                    success: function() {
                                        $('#noteBody').val($('#' + arrKeyStr).find('.noteText').html(val));
                                        $('#noteBody').val($('#' + arrKeyStr).find('.noteTitle').html(title));
                                        $('#getNoteKey').attr("value", '');
                                    }
                                });
                        } else {
                            noteObj.note = val;
                            noteObj.title = title;
                            notes.push(noteObj);
                            formModel.save({ 'notes': notes },
                                {
                                    headers: {
                                        mid: 39
                                    },
                                    patch: true,
                                    wait: true,
                                    success: function(models, data) {
										var el = self.$el;

										el.find('.formLeftColumn').find(".noteWrapper").empty();
										el.find('.formLeftColumn').append(self.render());
                                    },
                                    error: function(models, xhr) {
										self.errorNotification(xhr);						

									}
                                });
                        }
                        $('#noteArea').val('');
                        $('#noteTitleArea').val('');
                    } else {
                        return false;
                    }
                }
        },

		 showTitle : function(e){
			$(e.target).hide().parents(".addNote").find(".title-wrapper").show().find("input").focus();
        },

        template: _.template(NoteTemplate),

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return NoteView;
});
