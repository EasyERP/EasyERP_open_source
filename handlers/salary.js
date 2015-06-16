/**
 * Created by soundstorm on 15.06.15.
 */
var mongoose = require('mongoose');
var Salary = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var SalarySchema = mongoose.Schemas['Salary'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var objectId = mongoose.Types.ObjectId;
    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');


};

module.exports = Salary;