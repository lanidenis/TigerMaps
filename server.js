//pre-made Node.js modules
var express = require('express');
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var path = require('path');
var ObjectID = mongodb.ObjectID;
var CAS = require('cas')
var session = require('cookie-session')

//our own Node.js modules
var scheduler = require('./scheduler');
var parser = require('./public/js/parser');
var dbFuncs = require('./public/js/dbFuncs');

//the app
var app = express();
app.use(bodyParser.json());

//database variable to use outside of callback
var db;

//uri for connections
var uri = 'mongodb://heroku_745dvgs9:7pfvvi77khfh3qfor2qt0rf090@ds159330.mlab.com:59330/heroku_745dvgs9'

// Bind port to process.env.PORT or, if none available, port 8080
var port = process.env.PORT || 8080;

mongodb.MongoClient.connect(uri, function(err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    db = database;
    console.log("Connected successfully to database");

    app.listen(port, function() {
        console.log('app listening on port ' + port);
    });

});

app.use(
    function(req, res, next) {
        scheduler.onConnection();
        next();
    },
    express.static(__dirname + '/public')
);



// Configure the app to save a cookie with two attributes (for netid and status)
app.use(session({ keys: ['key1', 'key2'] }))

var serviceURL = "https://tigermaps.herokuapp.com/verify";

// Turn debug to true when developing, false when in production (on Heroku).
var debug = true;
if (debug) {
    serviceURL = 'http://localhost:8080/verify';
}
// Configure CAS authentication
var casURL = 'https://fed.princeton.edu/cas/'
var cas = new CAS({
    base_url: casURL,
    service: serviceURL
})


// https://fed.princeton.edu/cas/login?service=http://localhost:8080/verify
app.get('/login', function(req, res) {
    console.log("logging in");
    // Redirect the user to the CAS server
    res.redirect(casURL + 'login?service=' + serviceURL);
});

app.get('/verify', function(req, res) {
    var ticket = req.query.ticket;
    // console.log("request is: ", req);
    // console.log("request.query is: ", req.query);
    // console.log("ticket is: ", ticket);

    console.log("verifying");

    // If the user already has a valid CAS session then send them to their destination
    if (req.session.cas) {
        console.log("user already logged in, redirecting to /map");
        res.redirect('/map');
        return;
    }

    console.log('validating ticket');
    // Check if ticket-granting-ticket is valid
    if (ticket) {
        cas.validate(ticket, function(err, status, username) {
            if (err) {
                console.log('invalid ticket!');
                // Handle the error
                res.send({ error: err });
            } else {
                // Log the user in
                console.log("ticket valid\nstatus:", status, "username:", username);
                // Save the user's session data
                req.session.cas = {
                    status: status,
                    netID: username
                };
                console.log("redirecting to /map");
                res.redirect('/map');
            }
        });
    } else {
        console.log('no ticket found!');
        res.end('no ticket!');
        //res.redirect('/');
    }
});

// Log the user out
app.get('/logout', function(req, res) {

    // For now, I'm just clearing the session cookie, which should be fine.
    req.session = null;
    res.redirect('/map');

    // But perhaps we should just logout of CAS entirely? nah just clear cookie like above
    //res.redirect('https://fed.princeton.edu/cas/logout');
})


// Serve the main landing page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/pages/index.html'));
})


// Configure the EJS templating system (http://www.embeddedjs.com)
app.set('view engine', 'ejs')

// Serve the map page
app.get('/map', function(req, res) {

    // If user already logged in
    if (typeof(req.session.cas) !== 'undefined') {
        console.log("user already logged in. Serving map.html with loggedIn = true");

        // Render map page with netID
        res.render('pages/map', {
            loggedIn: true,
            netID: req.session.cas.netID
        });
    } else {
        console.log("user not logged in! Serving map.html with loggedIn = false");

        // Render not-logged-in version of map page
        res.render('pages/map', {
            loggedIn: false,
            netID: null
        });
    }


    // res.sendFile(path.join(__dirname + '/views/pages/map.html'));
})

//HTTP REQUEST FUNCTIONS
//require('./public/js/http.js');

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}

app.get("/fetch/dining", function(req, res) {
    db.collection("diningPU").find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get dining information.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.get("/fetch/dining", function(req, res) {
    db.collection("diningPU").find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get dining information.");
        } else {
            res.status(200).json(docs);
        }
    });
});