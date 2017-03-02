var mongoose = require('mongoose');
var OAuth = require('oauth');

var Module = function (models) {
    var magentoConnectionsSchema = mongoose.Schemas.magentoConnections;

    this.getOAuthAccessToken = function (req, res, next) {
        console.log('callback');
    };

    function getOAuthAccessToken(oauth, token, token_secret, verifier, callback) {
        oauth.getOAuthAccessToken(
            token,
            token_secret,
            verifier,
            function (error, oauth_access_token, oauth_access_token_secret, results) {
                if (error) {
                    return callback(error);
                }
                else {
                    console.log('Your OAuth Access Token: ' + (oauth_access_token));
                    console.log('Your OAuth Token Secret: ' + (oauth_access_token_secret));
                    callback(null);
                }
            }
        );
    }

    function getRequestToken(oauth, oauthVerifier, callback) {
        oauth.getOAuthRequestToken(
            function (error, oauth_token, oauth_token_secret, results) {
                if (error) {
                    return callback(error);
                } else {
                    console.log('oauth_token ', oauth_token);
                    console.log('oauth_token_secret', oauth_token_secret);
                    console.log('oauthVerifier', oauthVerifier);

                    getOAuthAccessToken(oauth, oauth_token, oauth_token_secret, oauthVerifier, callback);
                }
            });
    }

    this.getConsumerKeyAndSecret = function (req, res, next) {
        var body = req.body;
        var oauthConsumerKey = body.oauth_consumer_key;
        var oauthConsumerSecret = body.oauth_consumer_secret;
        var oauthVerifier = body.oauth_verifier;
        var storeBaseUrl = body.store_base_url;
        var MagentoConnection = models.get('micheldb', 'magentoConnection', magentoConnectionsSchema);
        var data = {
            oauthConsumerKey   : oauthConsumerKey,
            oauthConsumerSecret: oauthConsumerSecret,
            oauthVerifier      : oauthVerifier,
            storeBaseUrl       : storeBaseUrl
        };
        var model;
        var oauth;

        oauth = new OAuth.OAuth(
            storeBaseUrl + '/oauth/token/request',
            storeBaseUrl + '/oauth/token/access',
            oauthConsumerKey,
            oauthConsumerSecret,
            "1.0",
            null,
            "HMAC-SHA1"
        );

        getRequestToken(oauth, oauthVerifier, function (err) {
            if (err) {
                console.log(err);

                res.status(400).send({error: err});
                return;
            }

            model = new MagentoConnection(data);
            model.save(function (err) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: 'Received success'});
            });
        });
    };
};

module.exports = Module;
