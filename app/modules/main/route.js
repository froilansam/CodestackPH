var express = require('express');
var router = express.Router();
var logInRouter = express.Router();
var authMiddleware = require('../auth/middleware');
var db = require('../../lib/database')();


logInRouter.use(authMiddleware.noAuthed);
logInRouter.get('/', (req, res) => {
    console.log('Log In Router');
    res.render('main/views/login', req.query);
})
.post('/', (req, res) => {


    // Change the database name, and the table where you get the user.
    var queryString = `SELECT * FROM users WHERE strEmail = ? AND strPassword = ?;`
    db.query(queryString, [req.body.email, req.body.password], (err, results, fields) => {
        if (err) throw err;
        if (results.length === 0) return res.redirect('/login?incorrect');

        var user = results[0];

        delete user.password;

        req.session.user = user;

        return res.redirect('/index');
    });
})

router.use(authMiddleware.hasAuth);
router.get('/', (req, res) => {
    console.log('/index directory');
    if (typeof process.env.ENABLE_DATABASE !== 'undefined' && process.env.ENABLE_DATABASE === 'false') {
        /**
         * If the database part is disabled, then pass a blank array to the
         * render function.
         */
        return render([]);
    }
    res.end();
});

exports.index = router;
exports.login = logInRouter;
