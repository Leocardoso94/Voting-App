const Poll = require('./models/poll');
const User = require('./models/user');

module.exports = function (app, passport) {

    // normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function (req, res) {
        if (req.user) res.redirect('/dashboard');
        res.render('index', { title: 'Voting App', user: req.user });
    });



    // dashboard =========================
    app.get('/dashboard', isLoggedIn, function (req, res) {
        Poll.find({ userId: req.user.id }, (err, polls) => {
            res.render('dashboard', {
                user: req.user,
                title: 'Dashboard',
                polls
            });
        });

    });

    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function (req, res) {
        res.render('login', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/dashboard', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function (req, res) {
        res.render('signup', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    // google ---------------------------------

    // send to google to do the authentication
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/dashboard',
            failureRedirect: '/login'
        }));

    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================

    // locally --------------------------------
    app.get('/connect/local', function (req, res) {
        res.render('connect-local.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/dashboard', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));



    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email'] }));

    // the callback after google has authorized the user
    app.get('/connect/google/callback',
        passport.authorize('google', {
            successRedirect: '/dashboard',
            failureRedirect: '/'
        }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/dashboard');
        });
    });


    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function (req, res) {
        var user = req.user;
        user.google.token = undefined;
        user.save(function (err) {
            res.redirect('/dashboard');
        });
    });


    // Polls

    app.post('/poll', isLoggedIn, (req, res) => {
        const poll = new Poll();

        const filteredOptions = req.body.option.filter(option => option.trim() != '');


        const options = filteredOptions.map(option => {
            const optionObj = {
                name: option,
                votes: 0
            }

            return optionObj;
        });

        poll.name = req.body.name;
        poll.options = options;
        poll.userId = req.user._id;

        poll.save((err) => {
            if (err)
                return console.log(err);


            res.redirect('/poll/' + poll.id);
        });

    });

    app.get('/poll/:id', (req, res) => {
        Poll.findById(req.params.id, (err, poll) => {
            User.findById(poll.userId, (err, user) => {
                res.render('poll', { poll, title: "Poll", username: user.name });
            });

        });
    });


    app.post('/poll/vote', (req, res) => {
        Poll.findById(req.body.poll_id, (err, poll) => {
            poll.options.forEach(opt => {
                if (opt.id == req.body.vote) opt.votes++;
            });

            poll.save((err) => {
                if (err)
                    return console.log(err);


                res.redirect('/poll/result/' + poll.id);
            });
        });
    });


    app.get('/poll/result/:id', (req, res) => {
        Poll.findById(req.params.id, (err, poll) => {
            User.findById(poll.userId, (err, user) => {
                res.render('result', { poll, title: "Result", username: user.name });
            });
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}
