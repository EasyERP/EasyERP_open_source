/**
 * Created by Roman on 01.04.2015.
 */
var subDomainParser = function (req, res, next) {
    var subdomains = req.subdomains;
    var mainSubDomain = subdomains[0];
    var companyName;
    var companyContainer;

    if (mainSubDomain) {
        companyContainer = subdomains.slice(1, subdomains.length);
        accountName = companyContainer.join('');
        //companyName = companyName.toLowerCase();
    }

    return {
        main: subdomains[0],
        accountName: accountName
    };
};


module.exports = subDomainParser;