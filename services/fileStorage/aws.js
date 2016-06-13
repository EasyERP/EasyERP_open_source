/**
 * Created by Roman on 06.01.2015.
 */
var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
aws['accessKeyId'] = process.env.AMAZON_ACCESS_KEY_ID;
aws['secretAccessKey'] = process.env.AMAZON_SECRET_ACCESS_KEY;
var s3 = new AWS.S3({ httpOptions: { timeout: 50000 } });
var s3policy = require('s3policy');

aws['awsRootUrl'] = 's3.amazonaws.com';
aws['bucketName'] = 'trill_images';
aws['avatarBucketName'] = 'trill_avatars';

var utc = Date.UTC(2030, 3, 1);
var now = new Date();
var delta = 24 * 60 * 60 * 1000;
aws['imageExpiry'] = new Date(now + delta);
aws['avatarExpiry'] = new Date(utc);
var INVALID_BASE64_STRING = process.env.INVALID_BASE64_STRING || "Invalid base64 string";

module.exports = function(protoObject) {
    "use strict";

    var Aws = function() {
        var self = this;
        var defaultOptions = {

        };

        function putObject(bucket, key, body, callback) {
            s3.putObject({ Bucket: bucket, Key: key, Body: body }, function (err, data) {
                if (callback && (typeof callback === 'function')) {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    } else {
                        callback(null, data);
                    }
                }
            });
        };

        this.getFileUrl = function ( folderName, fileName, options, callback ) {

        };

        this.postFile = function ( folderName, fileNameOrBase64String, options, callback ) {
            var validBase64;
            var data = options.data;
            var err;
            //check and if need change arguments of target method
            //==========================================================================
            self.validateIncomingParameters(arguments);
            //==========================================================================

            if(data) {
                validBase64 = self.checkBase64(data);
                if(validBase64) {
                    data = self.convertFromBase64( base64 );
                } else {
                    err = new Error(INVALID_BASE64_STRING);
                    err.status = 400;
                }
            }
            return putObject(folderName, fileNameOrBase64String, data, callback);
        };

        this.removeFile = function ( folderName, fileName, options, callback ) {

        };
    };
    return Aws;
};
