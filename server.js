const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + "/views/partials");
app.set('view engine', 'hbs');

// Middleware that I use so that I can access to the 
// file on the public directory statically
// for example: localhost:3000/help.html
app.use(express.static(__dirname + '/public'));

// Logger middleware, every request the logger will
// log the timestap, the method and the 
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) {
            console.log('Unable to apend to server.log');
        }
    });
    next();
});

// When we dont call next, nothing will execute except the
// maintenane page
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });

hbs.registerHelper("getYear", () => {
    return new Date().getFullYear();
})

app.get('/', (req, res) => {
    //res.send('<h1>hello express</h1>');
    // res.send({
    //     name: 'liron',
    //     likes: ['pizza', 'sushi']
    // });
    res.render('home.hbs', {
        pageName: 'Home', 
        welcomeMsg: 'Welcome To My 654654 basic website!'
    });
});

app.get('/about', (req, res) =>{
    // Render lets me render all the templates
    // I set up in the view engine
    res.render('about.hbs', {
        pageName: 'About'
    });
});

app.get('/bad', (req,res) => {
    res.send({
        errMessage: 'The route unable'
    });
})

app.listen(3000, () => {
    console.log('Server is listenning on port 3000');
});