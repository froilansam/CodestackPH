var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var methodOverride = require('method-override');
var session = require('express-session');

module.exports = app => {
    app.set('port', process.argv[2] || process.env.PORT || 3000);


    /** Setting the view (templating) engine as Pug
    * You can set this this to EJS
    **/
    app.set('view engine', 'pug');

    // Setting the directory file where pug files are located.
    app.set('views', path.join(path.dirname(__dirname), 'modules'));

    // Below this are the middlewares.
    app.use(morgan('dev'));

    // This directory is where all the asstes are located.
    app.use(serveStatic(path.join(path.dirname(path.dirname(__dirname)), 'public')));

    // Instantiating session
    app.use(session({
        resave: false,
        saveUninitialized: true,
        secret: 'WQcptX3p4W',
    }));

    app.use(methodOverride('X-HTTP-Method-Override'));
    app.use(methodOverride('_method'));

    // Body Parser parse data coming from forms or ajax request.
    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({
        extended: true,
    }))


}