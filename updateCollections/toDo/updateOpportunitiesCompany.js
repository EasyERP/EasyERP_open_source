var mongoose = require('mongoose');
var isoWeekYearComposer = require('../../helpers/isoWeekYearComposer');
require('../../models/index.js');
var connectOptions = {
    user: 'easyErp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

//var dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, connectOptions);
var dbObject = mongoose.createConnection('localhost', 'production', 27017, connectOptions);

dbObject.on('error', console.error.bind(console, 'connection error:'));

dbObject.once('open', function callback() {
    var query;
    var opportunitySchema;
    var Opportunitie;

    console.log("Connection to weTrack is success");

    opportunitySchema = mongoose.Schemas.Opportunitie;
    Opportunitie = dbObject.model('wTrack', opportunitySchema);

    query = Opportunitie.aggregate({
        $lookup: {
            from        : 'Customers',
            localField  : 'customer',
            foreignField: '_id',
            as          : 'customer'
        }
    }, {
        $project: {
            customer        : {$arrayElemAt: ['$customer', 0]}
        }
    },{
        $match : {
            'customer.type' : 'Company',
            company         : null
        }
    },function (error, res) {
        if (error) {
            return console.dir(error);
        }

        res.forEach(function (wt) {

            Opportunitie.findByIdAndUpdate(wt._id, {company : wt.customer._id, customer : null}, function (err, response) {
                if (err) {
                    console.log(err);
                }

                console.log(response);
            });
        });
    });

});

