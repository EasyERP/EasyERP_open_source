/**
 * Created by Roman on 13.05.2015.
 */
var mongoose = require('mongoose');
var Categories = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var CategorySchema = mongoose.Schemas['ProductCategory'];

    this.getForDd = function (req, res, next) {
        var ProductCategory = models.get(req.session.lastDb, 'ProductCategory', CategorySchema);

        ProductCategory
            .find()
            .sort({name: 1, nestingLevel: 1, sequence: 1})
            .exec(function (err, categories) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: categories});
            });
    };

    this.create = function (req, res, next) {
        var ProductCategory = models.get(req.session.lastDb, 'ProductCategory', CategorySchema);
        var body = req.body;
        var category;

        body.createdBy = {
            user: req.session.uId
        };
        body.editedBy = {
            user: req.session.uId
        };

        category = new ProductCategory(body);

        category.save(function(err, category){
            if(err){
                return next(err);
            }

            res.status(200).send(category);
        });
    };

};

module.exports = Categories;