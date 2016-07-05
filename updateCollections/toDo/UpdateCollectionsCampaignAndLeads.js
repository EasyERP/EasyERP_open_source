var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
require('../../models/index.js');

var OpportunitieSchema = mongoose.Schemas.Opportunitie;
var CampaignSchema = mongoose.Schemas.Campaign;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

// var dbObject = mongoose.createConnection('144.76.56.111', 'lilyadb', 28017, connectOptions);
var dbObject = mongoose.createConnection('localhost', 'production');

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to lilyadb is success");
});

var Opportunitie = dbObject.model("Opportunities", OpportunitieSchema);
var Campaign = dbObject.model("campaign", CampaignSchema);

var campaigns = [
    {
        _id : 'ThinkMobiles',
        name: 'ThinkMobiles'
    },
    {
        _id : 'EasyERP',
        name: 'EasyERP'
    },
    {
        _id : 'Vike',
        name: 'Vike'
    }
];
Campaign.collection.drop();

Campaign.collection.insert(campaigns, function (err, success) {
    if (err) {
        return console.error(err);
    }
    console.log(success);

    Opportunitie.collection.update({}, {
        $set: {
            campaign: ''
        }
    }, function (err, success) {
        if (err) {
            return console.error(err);
        }

        console.log(success);
    });
});



