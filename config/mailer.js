/**
 * Created by Roman on 15.04.2015.
 */
module.exports.noReplay = {
    host: 'mail.thinkmobiles.com',
    port: 587,
    ignoreTLS: false,
    auth: {
        user: "no-replay@easyerp.com",
        pass: "111111"
    },
    tls: {rejectUnauthorized: false}
};