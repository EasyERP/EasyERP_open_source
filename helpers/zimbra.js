var jszimbra = require('js-zimbra');

module.exports = function () {
    var comm = new jszimbra.Communication({
        url: 'https://mail.thinkmobiles.com/service/soap'
    });

    comm.auth({
        "username"  : "roman.buchuk",
        "secret"    : "buchuk13121984",
        "isPassword": true
    }, function (err) {

        if (err) {

            return console.error(err);

        }

        comm.getRequest({}, function (err, req) {

            if (err) {

                return console.error(err);

            }

            req.addRequest({
                name     : "CreateAccountRequest",
                namespace: "zimbraAccount",
                params   : {
                    "name"    : "pupkintest",
                    "password": "secret",
                    "a"       : [
                        {
                            "n"       : "mail",
                            "_content": "pupkintest@thinkmobiles.com"
                        }
                    ]
                }
            }, function (err) {
                if (err) {
                    return console.error(err);
                }
                comm.send(req, function (err, response) {
                    if (err) {

                        return console.error(err);

                    }

                    console.log(response.get().GetAccountInfoResponse);

                });

            });
        });
    });
}
