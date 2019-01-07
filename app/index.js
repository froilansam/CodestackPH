var fs = require('fs');
var path = require('path');

module.exports = app => {

    require('./core/boot')(app);

    /** This is a variable that identifies the directory where the application modules 
    * can be found.
    */
    var modulesDir = 'modules';

    fs.readdir(path.join(__dirname, modulesDir), (err, modules) => {
        if(err) throw err;

        //Variable modules is an array of folder inside the modulesDir directory

        modules.forEach(moduleInside => {
            var routes = require(`./${modulesDir}/${moduleInside}/route`);
            Object.keys(routes).forEach(route => {

                // route is the routers exported from each route.js files, to be used for /url
                app.use(`/${route}`, routes[route]);
            });
        });
    });
}