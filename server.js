const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// Heroku will choose automatically a port for the app
// or if we run localy, the port will be 3000
const port = process.env.PORT || 3000;

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

hbs.registerHelper('list', function(items, options) {
    var out = "<ul>";
  
    for(var i=0, l=items.length; i<l; i++) {
      out = out + "<li>" + options.fn(items[i]) + "</li>";
    }
  
    return out + "</ul>";
  });

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
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageName: 'Projects',
        listOfProjects: [
            {name: 'Proj 1', content: 'Shit 1'},
            {name: 'Proj 2', content: 'Shit 2'},
            {name: 'Proj 3', content: 'Shit 3'},            
        ]
    });
})

app.listen(port , () => {
    console.log(`Server is listening on port ${port}`);
});