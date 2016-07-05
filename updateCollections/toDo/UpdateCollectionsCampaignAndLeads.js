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

var dbObject = mongoose.createConnection('144.76.56.111', 'lilyadb', 28017, connectOptions);

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to lilyadb is success");
});

var Opportunitie = dbObject.model("Opportunities", OpportunitieSchema);
var Campaign = dbObject.model("campaign", CampaignSchema);

var campaigns = [
    {
        _id : ObjectId('572340e28ba4fd133006271e'),
        name: 'ThinkMobiles'
    },
    {
        _id : ObjectId('572340e28ba4fd133006271a'),
        name: 'EasyERP'
    },
    {
        _id : ObjectId('572340e28ba4fd133006271b'),
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



