/**
 * Created by Roman on 02.01.2015.
 */
var azure = require('azure-storage');

module.exports = function() {
    var Azure = function () {
        "use strict";
        var fileService = azure.createBlobService();

        this.createContainerIfNotExists = function (container, callback) {
            fileService.createContainerIfNotExists(container, { publicAccessLevel: 'blob' }, callback);
        };

        this.createBlockBlobFromLocalFile = function (container, blob, localFileName, options, callback) {
            fileService.createBlockBlobFromLocalFile(container, blob, localFileName, options, callback);
        };

        this.createBlockBlobFromStream = function (container, blob, Strem, streamLength, options, callback) {
            fileService.createBlockBlobFromStream(container, blob, Strem, streamLength, options, callback);
        };

        this.createWriteStreamToBlockBlob = function (container, blob, options, callback) {
            fileService.createWriteStreamToBlockBlob(container, blob, options, callback);
        };

        this.getBlobToFile = function (container, taskblob, taskfile, destfile, callback) {
            fileService.getBlobToFile(container, taskblob, taskfile, fs.createWriteStream(destfile), callback);
        };

        this.getBlobToStream = function (container, taskblob, taskfile, destfile, callback) {
            fileService.getBlobToStream(container, taskblob, taskfile, fs.createWriteStream(destfile), callback);
        };

        this.createReadStream = function (container, taskblob, taskfile, destfile, callback) {
            fileService.createReadStream(container, taskblob, taskfile, fs.createWriteStream(destfile), callback);
        };

        this.generateSharedAccessSignature = function(container, blob, sharedAccessPolicy, headers){

            var sasToken = fileService.generateSharedAccessSignature(container, blob, sharedAccessPolicy, headers);
            return sasToken;
        };

        this.getUrl = function (container, blob, primary, callback) {
            var startDate = new Date();
            var expiryDate = new Date(startDate);
            expiryDate.setMinutes(startDate.getMinutes() + 600);
            startDate.setMinutes(startDate.getMinutes() - 600);

            var sharedAccessPolicy = {
                AccessPolicy: {
                    Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
                    Start: startDate,
                    Expiry: expiryDate
                }
            };

            var sasToken = this.generateSharedAccessSignature(container, blob, sharedAccessPolicy);
            callback(fileService.getUrl(container, blob, sasToken, primary));
        }

    };
    var _azure = new Azure();
};
