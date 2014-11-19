var LocalStrategy = require('passport-local').Strategy;
var Account = require('models/account');

module.exports = function (passport) {

    passport.serializeUser(function (account, done) {
        done(null, account._id)
    });

    passport.deserializeUser(function (id, done) {
        Account.findById(id, function (err, account) {
            done(err, account);
        });
    });

    passport.use('local-auth', new LocalStrategy(
        {
            usernameField: 'authenticator',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },

        //Note: We don't have / use the password field
        function (req, authenticator, password, done) {
            Account.findOneAsync({authenticator: authenticator})
                .then(function (account) {
                    if (!account) {
                        var new_account = new Account(
                            {authenticator: authenticator}
                        );

                        return new_account.saveAsync().return(new_account)
                    }

                    return account
                })
                .then(function(account){
                    done(null, account)
                })
                .catch(function(err){
                    done(err)
                })
        }
    ));
};