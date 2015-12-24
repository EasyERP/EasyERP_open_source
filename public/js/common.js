define([
        "dataService"
    ],
    function (dataService) {
        var checkBackboneFragment = function (url) {
            if (Backbone.history.fragment == url) {
                Backbone.history.fragment = "";
            }
            Backbone.history.navigate(url, {trigger: true});
        };

        var utcDateToLocaleDate = function (utcDateString) {
            utcDateString = (utcDateString) ? dateFormat(utcDateString, "d mmm, yyyy", false) : null;
            return utcDateString;

        }

        var utcDateToLocaleFullDateTime = function (utcDateString) {
            utcDateString = (utcDateString) ? dateFormat(utcDateString, "dddd, d mm yyyy HH:MM:s TT", false) : null;
            return utcDateString;
        }

        var utcDateToLocaleDateTime = function (utcDateString, notHours) {
            if (!notHours) {
                utcDateString = (utcDateString) ? dateFormat(utcDateString, "d/m/yyyy HH:MM", false) : null;
            } else {
                utcDateString = (utcDateString) ? dateFormat(utcDateString, "d/m/yyyy", false) : null;
            }
            return utcDateString;
        }

        var ISODateToDate = function (ISODate) {
            var date = ISODate.split('T')[0];
            return date;
        };

        var hexToRgb = function (hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };

        var deleteEvent = function (e, that) {
            e.preventDefault();
            var answer = confirm("Really DELETE item ?!");
            if (answer == true) {
                that.trigger('deleteEvent');
            }
        };

        var canvasDrawing = function (options, context) {
            var canvas = (options.canvas) ? options.canvas : context.$('#avatar')[0];
            var model = (options.model) ? options.model : {
                model: {
                    imageSrc: "data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
                }
            };
            var img = new Image();
            img.onload = function () {
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, 140, 140);
            };
            img.src = model.imageSrc;
            context.imageSrc = model.imageSrc;
        };

        var canvasDraw = function (options, _context) {
            var model = (options && options.model) ? options.model : null;
            var context = (_context) ? _context : this;
            var canvas = context.$('#avatar')[0];
            var inputFile = context.$('#inputImg');
            inputFile.prop('accept', "image/*");
            inputFile.on('change', function (e) {
                e.preventDefault();

                var file = inputFile[0].files[0];//fix type file
                var filesExt = ['jpg', 'gif', 'png', 'jpe', 'jfif', 'jpeg', 'bmp', 'JPEG', 'JPG', 'GIF', 'PNG', 'BMP'];//fix type file
                var parts = $(inputFile).val().split('.');//fix type file
                if (filesExt.join().search(parts[parts.length - 1]) != -1) {//fix type file
                    var fr = new FileReader();
                    fr.onload = function () {
                        var src = /*"data:image/jpeg;base64," +*/fr.result;
                        /*btoa(fr.result);*/
                        $('.image_input').html(['<img src="', src, '"/>'].join(''));
                        $('.image_input img').Jcrop({
                            bgColor    : 'white',
                            bgOpacity  : .6,
                            setSelect  : [0, 0, 100, 100],
                            aspectRatio: 1,
                            onSelect   : imgSelect,
                            onChange   : imgSelect,
                            boxWidth   : 650,
                            boxHeight  : 650,
                            minSize    : [10, 10]
                            //maxSize: [140, 140]
                        });

                        function imgSelect(sellictions) {
                            if (parseInt(sellictions.w) > 0) {
                                var img = $('.image_input img')[0];
                                var canvasCrop = document.createElement('canvas');
                                canvasCrop.height = 140;
                                canvasCrop.width = 140;
                                var ctx = canvasCrop.getContext('2d');
                                ctx.drawImage(img, sellictions.x, sellictions.y, sellictions.w, sellictions.h, 0, 0, canvasCrop.width, canvasCrop.height);
                                $('.image_output').attr('src', canvasCrop.toDataURL('image/jpeg'));
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                            }
                        }

                        $(".cropImages").dialog({
                            dialogClass  : "crop-images-dialog",
                            closeOnEscape: false,
                            autoOpen     : true,
                            resizable    : true,
                            title        : "Crop Images",
                            width        : "900px",
                            buttons      : {
                                save  : {
                                    text : "Crop",
                                    class: "btn",

                                    click: function () {
                                        if (model) {
                                            imageSrcCrop = $('.image_output').attr('src');
                                            model.imageSrc = imageSrcCrop;
                                        } else {
                                            model = {
                                                imageSrc: imageSrcCrop
                                            }
                                        }
                                        canvasDrawing({model: model, canvas: canvas}, context);
                                        $(this).dialog("close");
                                    }

                                },
                                cancel: {
                                    text : "Cancel",
                                    class: "btn",
                                    click: function () {
                                        $(this).dialog("close");
                                    }
                                }
                            }

                        });

                    };
                    inputFile.val('');

                    //fr.readAsBinaryString(file);
                    // fixed for IE
                    fr.readAsDataURL(file);

                } else {
                    App.render({
                        type: 'error',
                        message: "Invalid file type!"
                    });
                }
            });
            canvasDrawing({model: model}, context);

        };
        var displayControlBtnsByActionType = function (actionType, viewType) {
            $("#saveDiscardHolder").hide();
            $("#top-bar-createBtn").hide();
            $("#top-bar-deleteBtn").hide();
            $("#top-bar-editBtn").hide();
            $("#top-bar-renameBtn").hide();
            $("#top-bar-nextBtn").hide();
            $("#top-bar-discardBtn").hide();
            $('#top-bar-saveBtn').hide();
            $('#formBtn').closest('li').hide();
            $("ul.changeContentIndex").hide();
            if (!actionType || actionType === "Content") {
                $("#top-bar-createBtn").show();
                if (viewType == "form") {
                    $('#formBtn').closest('li').show();
                    $("#top-bar-createBtn").hide();
                    $('#top-bar-editBtn').show();
                    $("ul.changeContentIndex").hide();
                    $('#top-bar-deleteBtn').show();
                }
                if (viewType == "thumbnails" || viewType == "list") {
                    $('#top-bar-editBtn').hide();
                }
            } else if (actionType === "View") {
                $('#top-bar-createBtn').show();
                $('#top-bar-editBtn').show();
                $('#top-bar-deleteBtn').show();
            } else if (actionType === "Edit") {
                // $('#top-bar-saveBtn').show();
                // $('#top-bar-discardBtn').show();
                //$("#saveDiscardHolder").show();
                $("#saveDiscardHolder").hide();
                $("#top-bar-createBtn").show();
            } else if (actionType === "Create") {
                $('#top-bar-saveBtn').show();
                $('#top-bar-nextBtn').show();
                $('#top-bar-discardBtn').show();
                $('#top-bar-saveBtn').show();
                $("#saveDiscardHolder").show();
            }
        };

        var getFromLocalStorage = function (key) {
            if (window.localStorage) {
                return window.localStorage.getItem(key);
            } else {
                throw new Error('Failed to save security token to LocalStorage. It is not supported by browser.');
            }
        };
        var deleteFromLocalStorage = function (key) {
            if (window.localStorage) {
                window.localStorage.removeItem(key);
            }
        };
        var saveToLocalStorage = function (key, value) {
            if (window.localStorage) {
                window.localStorage.setItem(key, value);
            } else {
                throw new Error('Failed to save security token to LocalStorage. It is not supported by browser.');
            }
        };

        var populateProjectsDd = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, {mid: 39}, function (response) {
                var options = [];
                if (model && model.project) {
                    options = $.map(response.data, function (item) {
                        return (model.project._id == item._id) ?
                            $('<option/>').val(item._id).text(item.projectName).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.projectName);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.projectName);
                    });
                }
                selectList.append(options);
                if (callback) {
                    callback();
                }

            });
        };

        var populateProfilesDd = function (selectId, url, model) {
            var selectList = $(selectId);
            var self = this;
            dataService.getData(url, {mid: 39}, function (response) {
                var options = [];
                if (model && model.profile) {
                    options = $.map(response.data, function (item) {
                        return (model.profile._id == item._id) ?
                            $('<option/>').val(item._id).text(item.profileName).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.profileName);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.profileName);
                    });
                }
                selectList.append(options);

            });
        };

        var populateEmployeesDd = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
            //selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, {mid: 39}, function (response) {
                var options = [];
                if (model && (model.manager || model.projectmanager || (model.salesPurchases && model.salesPurchases.salesPerson) || model.salesPerson || model.departmentManager || model.assignedTo)) {
                    options = $.map(response.data, function (item) {
                        return ((model.manager && model.manager._id === item._id) ||
                        (model.projectmanager && model.projectmanager._id === item._id) ||
                        (model.salesPurchases && model.salesPurchases.salesPerson && model.salesPurchases.salesPerson._id === item._id) ||
                        (model.salesPerson && model.salesPerson._id === item._id) ||
                        (model.assignedTo && model.assignedTo._id === item._id) ||
                            //(model.salesTeam._id === item._id) ||
                        (model.departmentManager && model.departmentManager._id === item._id)) ?
                            $('<option/>').val(item._id).text(item.name.first + " " + item.name.last).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name.first + " " + item.name.last);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name.first + " " + item.name.last);
                    });
                }
                selectList.append(options);
                if (callback) {
                    callback();
                }
            });
        }

        var populateCoachDd = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, {mid: 39}, function (response) {
                var options = [];
                if (model && model.coach) {
                    options = $.map(response.data, function (item) {
                        return (model.coach && model.coach._id === item._id) ?
                            $('<option/>').val(item._id).text(item.name.first + " " + item.name.last).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name.first + " " + item.name.last);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name.first + " " + item.name.last);
                    });
                }
                selectList.append(options);
                if (callback) {
                    callback();
                }
            });
        };

        var populateCompanies = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, {mid: 39}, function (response) {
                var options = [];
                if (model && model.company) {
                    options = $.map(response.data, function (item) {
                        return model.company._id === item._id ?
                            $('<option/>').val(item._id).text(item.name.first).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name.first);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return model && model._id === item._id ?
                            $('<option/>').val(item._id).text(item.name.first).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name.first);
                    });
                }
                selectList.append(options);
                if (callback) {
                    callback();
                }
            });
        };

        var populateTitle = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, {mid: 39}, function (response) {
                var options = [];
                if (model && model.company) {
                    options = $.map(response.data, function (item) {
                        return model.company._id === item._id ?
                            $('<option/>').val(item._id).text(item.name.first).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name.first);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name.first);
                    });
                }
                selectList.append(options);
                if (callback) {
                    callback();
                }
            });
        };

        var populateRelatedStatuses = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, {mid: 39}, function (response) {
                var options = [];
                if (model && model.status) {
                    options = $.map(response.data, function (item) {
                        return model.status._id === item._id ?
                            $('<option/>').val(item._id).text(item.name.first).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name.first);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.status);
                    });
                }
                selectList.append(options);
                if (callback) {
                    callback();
                }
            });
        };

        var populateDepartments = function (selectId, url, model, callback, removeSelect) {
            var selectList = $(selectId);
            var self = this;
            if (!removeSelect) {
                selectList.append($("<option/>").val('').text('Select...'));
            }
            var id = (model) ? (model._id) : null;
            dataService.getData(url, {mid: 39, id: id}, function (response) {
                var options = [];
                if (model && (model.department || (model.salesPurchases && model.salesPurchases.salesTeam) || model.salesTeam || model.parentDepartment)) {
                    options = $.map(response.data, function (item) {
                        return ((model.department === item._id) || (model.department && model.department._id === item._id) || (model.salesPurchases && model.salesPurchases.salesTeam && model.salesPurchases.salesTeam === item._id) || (model.salesPurchases && model.salesPurchases.salesTeam && model.salesPurchases.salesTeam._id === item._id) || (model.salesTeam && (model.salesTeam._id === item._id)) || (model.salesTeam === item._id) || (model.parentDepartment && model.parentDepartment === item._id)) ?
                            $('<option/>').val(item._id).text(item.departmentName).attr('selected', 'selected').attr('data-level', item.nestingLevel) :
                            $('<option/>').val(item._id).text(item.departmentName).attr('data-level', item.nestingLevel);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.departmentName).attr('data-level', item.nestingLevel);
                    });
                }
                selectList.append(options);
                if (callback) {
                    callback();
                }
            });
        };
        var getLeadsForChart = function (source, dataRange, dataItem, callback) {
            dataService.getData("/LeadsForChart", {
                source   : source,
                dataRange: dataRange,
                dataItem : dataItem
            }, function (response) {
                callback(response.data);
            });
        }
        var populateDepartmentsList = function (selectId, targetId, url, model, page, callback) {
            var selectList = $(selectId);
            var targetList = $(targetId);
            var self = this;
            selectList.next(".userPagination").remove();
            dataService.getData(url, {mid: 39}, function (response) {
                var options = [];
                if (model && model.groups && model.groups.group) {
                    var ids = $.map(model.groups.group, function (item) {
                        return item._id
                    });
                    options = $.map(
                        _.filter(response.data, function (filteredItem) {
                            return (ids.indexOf(filteredItem._id) == -1);
                        }),
                        function (item) {
                            return $('<li/>').attr('id', item._id).text(item.departmentName);
                        }
                    );

                } else {
                    if (targetList.length) {
                        var ids = [];
                        targetList.find('li').each(function (item) {
                            ids.push($(this).attr("id"));
                        })
                        var tt = _.filter(response.data, function (filteredItem) {
                            return (ids.indexOf(filteredItem._id) == -1);
                        });
                        var k = 0;
                        options = $.map(tt, function (item) {
                            if (k < 20) {
                                k++;
                                return $('<li/>').attr("id", item._id).text(item.departmentName);
                            } else {
                                k++;
                                return $('<li/>').attr("id", item._id).text(item.departmentName).attr("style", "display:none");
                            }
                        });
                    }
                    else {
                        var k = 0;
                        options = $.map(response.data, function (item) {
                            if (k < 20) {
                                k++;
                                return $('<li/>').attr("id", item._id).text(item.departmentName);
                            } else {
                                k++;
                                return $('<li/>').attr("id", item._id).text(item.departmentName).attr("style", "display:none");
                            }
                        });
                    }
                }
                selectList.append(options);
                if (response.data.length >= 20) {
                    if (page == 1) {
                        selectList.after("<div class='userPagination'><span class='text'>" + ((20 * (page - 1)) + 1) + "-" + (20 * page) + " of " + (20 * (page - 1) + response.data.length) + "</span><a class='nextGroupList' href='javascript:;'>next »</a></div>");
                    } else {
                        selectList.after("<div class='userPagination'><a class='prevGroupList' href='javascript:;'>« prev</a><span class='text'>" + ((20 * (page - 1)) + 1) + "-" + (20 * page) + " of " + (20 * (page - 1) + response.data.length) + "</span><a class='nextGroupList' href='javascript:;'>next »</a></div>");
                    }
                } else {
                    if (page == 1) {
                        selectList.after("<div class='userPagination'><span class='text'>" + ((20 * (page - 1)) + 1) + "-" + (20 * (page - 1) + response.data.length) + " of " + (20 * (page - 1) + response.data.length) + "</span></div>");
                    } else {
                        selectList.after("<div class='userPagination'><a class='prevGroupList' href='javascript:;'>« prev</a><span class='text'>" + ((20 * (page - 1)) + 1) + "-" + (20 * (page - 1) + response.data.length) + " of " + (20 * (page - 1) + response.data.length) + "</span></div>");
                    }
                }
                selectList.attr("data-page", 1);
                targetList.attr("data-page", 1);
                $(targetId).after("<div class='userPagination targetPagination'><span class='text'>0-0 of 0</span></div>");
                if (callback) {
                    callback();
                }
            });
        };

        var populateParentDepartments = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, {mid: 39}, function (response) {
                var options = [];
                if (model && model.parentDepartment && (model.department || (model.salesPurchases && model.salesPurchases.salesTeam) || model.salesTeam || model.parentDepartment)) {
                    options = $.map(response.data, function (item) {
                        return ((model.department && model.department._id === item._id) || (model.salesPurchases && model.salesPurchases.salesTeam && model.salesPurchases.salesTeam._id === item._id) || (model.salesTeam === item._id) || (model.parentDepartment && model.parentDepartment._id === item._id)) ?
                            $('<option/>').val(item._id).text(item.departmentName).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.departmentName);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        if (!item.parentDepartment) {
                            return $('<option/>').val(item._id).text(item.departmentName);
                        }
                    });
                }
                selectList.append(options);
                if (callback) {
                    callback();
                }
            });
        };

        var populatePriority = function (selectId, url, model, callback) {
            var self = this;

            dataService.getData(url, {mid: 39}, function (response) {
                var options = [];
                if (model && model.priority) {
                    options = $.map(response.data, function (item) {
                        return (model.priority === item.priority) ?
                            $('<option/>').val(item.priority).text(item.priority).attr('selected', 'selected') :
                            $('<option/>').val(item.priority).text(item.priority);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return (item.priority == "P3") ?
                            $('<option/>').val(item.priority).text(item.priority).attr('selected', 'selected') :
                            $('<option/>').val(item.priority).text(item.priority);
                    });
                }
                var selectList = $(selectId);
                selectList.append(options);

                if (callback) {
                    callback();
                }
            });
        };

        var populateCustomers = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, {mid: 39}, function (response) {
                var options = [];
                if (model) {
                    options = $.map(response.data, function (item) {
                        return ((model.customer && (model.customer._id === item._id)) || (model._id === item._id)) ?
                            $('<option/>').val(item._id).text(item.name.first + ' ' + item.name.last).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name.first + ' ' + item.name.last);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name.first + ' ' + item.name.last);
                    });
                }
                selectList.append(options);
                if (callback) {
                    callback();
                }
            });
        };

        var populateDegrees = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, {mid: 39}, function (response) {
                var options = [];
                if (model && model.degree) {
                    options = $.map(response.data, function (item) {
                        return (model.customer._id === item._id) ?
                            $('<option/>').val(item._id).text(item.name.first + ' ' + item.name.last).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name.first + ' ' + item.name.last);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name.first + ' ' + item.name.last);
                    });
                }
                selectList.append(options);
            });
            if (callback) {
                callback();
            }
        };

        var populateWorkflows = function (workflowType, selectId, workflowNamesDd, url, model, callback) {
            var selectList = $(selectId);
            var workflowNamesDd = $(workflowNamesDd);
            var self = this;
            dataService.getData(url, {mid: 39, id: workflowType}, function (response) {
                var options = [];
                if (model && model.workflow) {
                    if (model.workflow._id == undefined) {
                        options = $.map(response.data, function (item) {
                            return model.workflow == item._id ?
                                $('<option/>').val(item._id).text(item.name).attr('data-id', item._id).attr('selected', 'selected') :
                                $('<option/>').val(item._id).text(item.name).attr('data-id', item._id);
                        });
                    } else {
                        options = $.map(response.data, function (item) {
                            return model.workflow._id === item._id ?
                                $('<option/>').val(item._id).text(item.name).attr('data-id', item._id).attr('selected', 'selected') :
                                $('<option/>').val(item._id).text(item.name).attr('data-id', item._id);
                        });

                    }
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name).attr('data-id', item._id);
                    });
                }
                var wNames = $.map(response.data, function (item) {
                    return item.wName;
                });
                wNames = _.uniq(wNames);
                var wfNamesOption = $.map(wNames, function (item) {
                    return $('<option/>').text(item);
                });
                workflowNamesDd.append(wfNamesOption);
                selectList.append(options);
                if (callback) {
                    callback(selectId);
                }
            });
        }
        var populateWorkflowsList = function (workflowType, selectId, workflowNamesDd, url, model, callback) {
            var selectList = $(selectId);
            var workflowNamesDd = $(workflowNamesDd);
            var self = this;
            var wNames;
            var wfNamesOption;

            dataService.getData(url, {mid: 39, id: workflowType}, function (response) {
                var options = [];
                if (model && model.workflow) {
                    if (model.workflow._id == undefined) {
                        options = $.map(response.data, function (item) {
                            return model.workflow == item._id ?
                                $('<li/>').val(item._id).text(item.name).attr('data-id', item._id).attr('selected', 'selected') :
                                $('<li/>').val(item._id).text(item.name).attr('data-id', item._id);
                        });
                    } else {
                        options = $.map(response.data, function (item) {
                            return model.workflow._id === item._id ?
                                $('<li/>').val(item._id).text(item.name).attr('data-id', item._id).attr('selected', 'selected') :
                                $('<li/>').val(item._id).text(item.name).attr('data-id', item._id);
                        });

                    }
                } else {
                    options = $.map(response.data, function (item) {
                        return "<li><input type='checkbox' checked='checked' value='" + item._id + "'" + "/><span>" + item.name + "</span></li>"

                    });
                }
                wNames = $.map(response.data, function (item) {
                    return item.wName;
                });
                wNames = _.uniq(wNames);
                wfNamesOption = $.map(wNames, function (item) {
                    return $('<option/>').text(item);
                });
                workflowNamesDd.append(wfNamesOption);

                if (selectList) {
                    selectList.append(options);
                }
                if (callback) {
                    callback(response.data);
                }
            });
        }

        var getWorkflowContractEnd = function (workflowType, selectId, workflowNamesDd, url, model, wfNmae, callback) {
            dataService.getData(url, {mid: 39, id: workflowType, name: wfNmae}, function (response) {
                if (callback) {
                    callback(response.data);
                }
            });
        }

        var populateUsers = function (selectId, url, model, callback, removeSelect) {
            var selectList = $(selectId);
            var self = this;
            if (!removeSelect) {
                selectList.append($("<option/>").val('').text('Select...'));
            }
            dataService.getData(url, {mid: 39}, function (response) {
                var options = [];
                if (model && (model.relatedUser || (model.groups && model.groups.owner))) {
                    if (model.relatedUser) {
                        options = $.map(response.data, function (item) {
                            return model.relatedUser._id === item._id ?
                                $('<option/>').val(item._id).text(item.login).attr('selected', 'selected') :
                                $('<option/>').val(item._id).text(item.login);
                        });
                    } else {
                        if (model.groups && model.groups.owner) {
                            options = $.map(response.data, function (item) {
                                return model.groups.owner === item._id ?
                                    $('<option/>').val(item._id).text(item.login).attr('selected', 'selected') :
                                    $('<option/>').val(item._id).text(item.login);
                            });

                        }
                    }
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.login);
                    });
                }
                selectList.append(options);
                if (callback) {
                    callback();
                }
            });
        }
        var populateUsersForGroups = function (selectId, targetId, model, page, callback) {
            var selectList = $(selectId);
            var targetList = $(targetId);
            selectList.empty();
            selectList.next(".userPagination").remove();
            targetList.next(".targetPagination").remove();
            var self = this;
            dataService.getData('/UsersForDd', {mid: 39}, function (response) {
                var options = [];
                if (model) {
                    var users = [];
                    if (model.users) {
                        users = model.users;
                    }
                    if (model.groups && model.groups.users) {
                        users = model.groups.users;
                    }

                    var ids = $.map(users, function (item) {
                        return item._id;
                    });
                    options = $.map(
                        _.filter(response.data, function (filteredItem) {
                            return (ids.indexOf(filteredItem._id) == -1);
                        }),
                        function (item) {
                            return $('<li/>').attr('id', item._id).text(item.login);
                        });
                } else {
                    if (targetList.length) {
                        var ids = [];
                        targetList.find('li').each(function (item) {
                            ids.push($(this).attr("id"));
                        });
                        var tt = _.filter(response.data, function (filteredItem) {
                            return (ids.indexOf(filteredItem._id) == -1);
                        });

                        var k = 0;
                        options = $.map(tt, function (item) {
                            if (k < 20) {
                                k++;
                                return $('<li/>').text(item.login).attr('id', item._id);
                            } else {
                                k++;
                                return $('<li/>').text(item.login).attr('id', item._id).hide();
                            }
                        });
                    }
                    else {
                        var k = 0;
                        options = $.map(response.data, function (item) {
                            if (k < 20) {
                                k++;
                                return $('<li/>').text(item.login).attr('id', item._id);
                            } else {
                                k++;
                                return $('<li/>').text(item.login).attr('id', item._id).attr("style", "display:none");
                            }
                        });
                    }
                }
                selectList.append(options);
                if (response.data.length >= 20) {
                    selectList.after("<div class='userPagination'><span class='text'>1-20 of " + (response.data.length) + "</span><a class='nextUserList' href='javascript:;'>next »</a></div>");
                } else {
                    selectList.after("<div class='userPagination'><span class='text'> 1-" + response.data.length + " of " + response.data.length + "</span></div>");
                }
                selectList.attr("data-page", 1);
                targetList.attr("data-page", 1);
                $(targetId).after("<div class='userPagination targetPagination'><span class='text'>0-0 of 0</span></div>");

                if (callback) {
                    callback();
                }
            });
        }

        var populateJobPositions = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, {mid: 39}, function (response) {
                var options = [];
                if (model && model.jobPosition) {
                    options = $.map(response.data, function (item) {
                        return (model.jobPosition._id === item._id) ?
                            $('<option/>').val(item._id).text(item.name).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name);
                    });
                }
                selectList.append(options);
                if (callback) {
                    callback();
                }
            });
        };
        var populateOpportunitiesForMiniView = function (url, personId, companyId, page, count, onlyCount, callback) {
            var self = this;
            dataService.getData(url, {
                person   : personId,
                company  : companyId,
                page     : page,
                count    : count,
                onlyCount: onlyCount
            }, function (response) {
                options = $.map(response.data, function (item) {
                    item.nextAction.date = utcDateToLocaleDate(item.nextAction.date);
                });
                if (callback) {
                    callback(response);
                }
            });
        };

        var populateSourceApplicants = function (selectId, url, model) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, {mid: 39}, function (response) {
                var options = [];
                if (model && model.source) {
                    options = $.map(response.data, function (item) {
                        return model.source._id === item._id ?
                            $('<option/>').val(item._id).text(item.name).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name);
                    });
                }
                selectList.append(options);
            });
        }
        var populateSourceDd = function (selectId, url, listName, callback) {
            var selectList = $(selectId);
            var self = this;
            selectList.append($("<option/>").val('').text('Select...'));
            dataService.getData(url, {mid: 39}, function (response) {
                var options = [];
                if (listName) {
                    options = $.map(response.data, function (item) {
                        return (listName === item.name) ?
                            $('<option/>').val(item._id).text(item.name).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name);
                    });
                }
                selectList.append(options);
                if (callback) {
                    callback();
                }
            });

        }

        var populateJobTypeDd = function (selectId, url, model, callback) {
            var selectList = $(selectId);
            var self = this;
            dataService.getData(url, {mid: 39}, function (response) {
                var options = [];
                if (model && model.jobType) {
                    options = $.map(response.data, function (item) {
                        return (model.jobType === item.name) ?
                            $('<option/>').val(item._id).text(item.name).attr('selected', 'selected') :
                            $('<option/>').val(item._id).text(item.name);
                    });
                } else {
                    options = $.map(response.data, function (item) {
                        return $('<option/>').val(item._id).text(item.name);
                    });
                }
                selectList.append(options);
                if (callback) {
                    callback();
                }
            });

        };
        var buildAphabeticArray = function (collection, callback) {
            if (collection) {
                collection.getAlphabet(function (arr) {
                    var b = true;
                    var filtered = $.map(arr, function (item) {
                        if (b && $.isNumeric(item._id.toUpperCase())) {
                            b = false;
                            return "0-9"
                        }
                        return item._id.toUpperCase();
                    });
                    if (filtered.length) {
                        filtered.push("All");
                    }
                    var letterArr = _.sortBy(_.uniq(filtered), function (a) {
                        return a
                    });
                    if (callback) {
                        callback(letterArr);
                    }
                });
            }
            return [];
        };
        var buildPagination = function (collection, callback) {
            collection.getListLength(function (listLength) {
                callback(listLength);
            });
            return [];
        };

        var getListLength = function (workflowType, filterLetter, filterArray, url, isConverted, callback) {
            dataService.getData(url, {
                mid        : 39,
                type       : workflowType,
                letter     : filterLetter,
                status     : filterArray,
                isConverted: isConverted
            }, function (response) {
                if (callback) {
                    callback(response);
                }
            });
        }

        var buildAllAphabeticArray = function () {
            var associateArray = ["All", "0-9"];
            for (var i = 65; i <= 90; i++) {
                associateArray.push(String.fromCharCode(i).toUpperCase());
            }
            return associateArray;
        }

        var getImages = function (ids, url, callback) {
            dataService.getData(url, {ids: ids}, function (response) {
                if (response.data !== undefined) {
                    response.data.forEach(function (item) {
                        if (ids['task_id']) {
                            $("#" + ids['task_id'] + " img").attr("src", item.imageSrc);
                        }
                        $("#" + item._id + " img").attr("src", item.imageSrc);
                        $("#monthList #" + item._id + " img").attr("src", item.imageSrc);
                        $(".avatar.right[data-id='" + item._id + "'] img").attr("src", item.imageSrc);
                        $(".avatar.left[data-id='" + item._id + "'] img").attr("src", item.imageSrc);
                        $(".avatar-small.right[data-id='" + item._id + "'] img").attr("src", item.imageSrc);
                        if (item.imageSrc == "") {
                            $(".avatar-small.right[data-id='" + item._id + "'] img").hide();
                        }
                    });
                }
                if (callback) {
                    callback(response);
                }
            });
        };
        var getImagesPM = function (id, url, thumbID, callback) {
            dataService.getData(url, {ids: [id]}, function (response) {
                if (response.data !== undefined) {
                    $(thumbID).find(".avatar").attr("data-id", response.data[0]._id).find("img").attr("src", response.data[0].imageSrc);
                }
                if (callback) {
                    callback(response);
                }
            });
        };

        return {
            deleteFromLocalStorage          : deleteFromLocalStorage,
            populateProfilesDd              : populateProfilesDd,
            buildAllAphabeticArray          : buildAllAphabeticArray,
            buildAphabeticArray             : buildAphabeticArray,
            buildPagination                 : buildPagination,
            getListLength                   : getListLength,
            populateDegrees                 : populateDegrees,
            populateSourceApplicants        : populateSourceApplicants,
            populateSourceDd                : populateSourceDd,
            populateJobTypeDd               : populateJobTypeDd,
            populateJobPositions            : populateJobPositions,
            populateUsers                   : populateUsers,
            utcDateToLocaleFullDateTime     : utcDateToLocaleFullDateTime,
            utcDateToLocaleDateTime         : utcDateToLocaleDateTime,
            utcDateToLocaleDate             : utcDateToLocaleDate,
            populateProjectsDd              : populateProjectsDd,
            populatePriority                : populatePriority,
            populateDepartments             : populateDepartments,
            populateCompanies               : populateCompanies,
            populateWorkflows               : populateWorkflows,
            populateWorkflowsList           : populateWorkflowsList,
            getWorkflowContractEnd          : getWorkflowContractEnd,
            populateCustomers               : populateCustomers,
            populateEmployeesDd             : populateEmployeesDd,
            populateCoachDd                 : populateCoachDd,
            populateRelatedStatuses         : populateRelatedStatuses,
            checkBackboneFragment           : checkBackboneFragment,
            displayControlBtnsByActionType  : displayControlBtnsByActionType,
            ISODateToDate                   : ISODateToDate,
            hexToRgb                        : hexToRgb,
            deleteEvent                     : deleteEvent,
            canvasDraw                      : canvasDraw,
            saveToLocalStorage              : saveToLocalStorage,
            getFromLocalStorage             : getFromLocalStorage,
            populateUsersForGroups          : populateUsersForGroups,
            populateParentDepartments       : populateParentDepartments,
            populateDepartmentsList         : populateDepartmentsList,
            getLeadsForChart                : getLeadsForChart,
            getImages                       : getImages,
            getImagesPM                     : getImagesPM,
            populateOpportunitiesForMiniView: populateOpportunitiesForMiniView
        }
    });
