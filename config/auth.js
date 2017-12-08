const { clientSecret, clientID, callbackURL } = process.env;

module.exports = {
    'googleAuth': {
        clientID,
        clientSecret,
        callbackURL
    }
};
