var express = require('express');
var router = express.Router();
var logInRouter = express.Router();
var authMiddleware = require('../auth/middleware');
var db = require('../../lib/database')();
//Firebase
var firebase = require('firebase');
var config = {
  apiKey: 'AIzaSyDnf5a8rXG7T4YkYwFSuB9eWpwt6xKmAN0',
  authDomain: 'codestack-ph.firebaseapp.com',
  databaseURL: 'codestack-ph.firebaseio.com',
  projectId: 'codestack-ph',
  storageBucket: 'codestack-ph.appspot.com',
  messagingSenderId: '1689996503'
}
firebase.initializeApp(config);
var database = firebase.firestore();
let aboutus = database.collection('aboutus');
let contactus = database.collection('contactus');
let testimonial = database.collection('testimonial');
var socket = require('socket.io-client')(`http://localhost:3000`)
aboutus.onSnapshot(function(){ //ON SNAPSHOT FUNCTION IS A LISTENER TO CHANGES IN THE DATABASE
    aboutus.get().then(collection => {
        console.log('----Collection: About Us----')
        collection.forEach(doc => {
            console.log(doc.data());
            socket.emit('aboutusBackend', doc.data(), function(){
                console.log('Data Sent to Index.')
            });
        });

    });
});
contactus.onSnapshot(function(){ //ON SNAPSHOT FUNCTION IS A LISTENER TO CHANGES IN THE DATABASE
    contactus.get().then(collection => {
        console.log('----Collection: Contact Us ----')
        collection.forEach(doc => {
            console.log(doc.data());
            socket.emit('contactusBackend', doc.data(), function(){
                console.log('Data Sent to Index.')
            });
        });

    });
});
testimonial.onSnapshot(function(){ //ON SNAPSHOT FUNCTION IS A LISTENER TO CHANGES IN THE DATABASE
    testimonial.get().then(collection => {
        console.log('----Collection: Testimonial ----')
        collection.forEach(doc => {
            console.log(doc.data());
            socket.emit('testimonialBackend', doc.data(), function(){
                console.log('Data Sent to Index.')
            });
        });

    });
});


logInRouter.use(authMiddleware.noAuthed);

router.get('/', (req, res) => {
    console.log('--Index Router--');
    socket = require('socket.io-client')(`http://${req.hostname}:${req.port}`)
    console.log(`http://${req.hostname}:${req.port}`)
    // Getting all the data
    function getAboutUs(){
        return new Promise((resolve, reject)=>{
            let numberProcessed = 0;
            aboutus.get().then(collection => {
                let collectionLength = collection.size;
                collection.forEach(doc => {
                    numberProcessed++;
                    console.log(collectionLength)
                    if(numberProcessed === collectionLength){
                        resolve(doc.data());
                    }
                });
            });
        });
    }

    function getContactUs(){
        return new Promise((resolve, reject)=>{
            let numberProcessed = 0;
            contactus.get().then(collection => {
                let collectionLength = collection.size;
                collection.forEach(doc => {
                    numberProcessed++;
                    console.log(collectionLength)
                    if(numberProcessed === collectionLength){
                        resolve(doc.data());
                    }
                });
            });
        });
    }
    function getTestimonial(){
        return new Promise((resolve, reject)=>{
            let numberProcessed = 0;
            let testimonials = []
            testimonial.get().then(collection => {
                let collectionLength = collection.size;
                collection.forEach(doc => {
                    numberProcessed++;
                    console.log(collectionLength)
                    testimonials.push(doc.data())
                    if(numberProcessed === collectionLength){
                        resolve(testimonials);
                    }
                });
            });
        });
    }
    // Getting all the data
    

    getAboutUs().then(docData => {
        let docAbout = docData;
        getContactUs().then(docData => {
            let docContact = docData;
            getTestimonial().then(docData => {
                let docTestimonial = docData
                console.log(docTestimonial)
                res.render('main/views/index', {hostname: req.hostname, port: req.port, docAbout: docAbout, docContact: docContact, docTestimonial: docTestimonial});
            });            
        });        
    })
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
