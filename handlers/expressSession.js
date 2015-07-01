/**
 * Created by Roman on 16.06.2015.
 */

function kill(req, res, next) {
    if (req.session) {
        req.session.destroy();
    }
    res.status(200).send({success: "Logout successful"});
};

function authenticatedUser(req, res, next) {
    var err;

    if (req.session && req.session.loggedIn && req.session.lastDb && req.session.uId) {
        next();
    } else {
        err = new Error('UnAuthorized');
        err.status = 401;
        next(err);
    }
};

exports.kill = kill;
exports.authenticatedUser = authenticatedUser;