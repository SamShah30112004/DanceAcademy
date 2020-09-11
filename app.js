const express = require("express");
const path = require("path");
const app = express();
const bodyparser = require("body-parser")
const mongoose = require('mongoose');
const User = require('./user-model');
const port = 80;
mongoose.connect('mongodb://localhost/DanceContact', { useNewUrlParser: true });

const contactSchema = new mongoose.Schema({
    name: String,
    phone: { type: Number, required: true },
    age: Number,
    email: { type: String, required: true }
});

const contact = mongoose.model('Contact', contactSchema);

app.use('/static', express.static('static'))
app.use(express.urlencoded())

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    const params = {}
    res.status(200).render('home.pug', params);
})

app.get('/home', (req, res) => {
    const params = {}
    res.status(200).render('home.pug', params);
})

app.get('/contact', (req, res) => {
    const params = {}
    res.status(200).render('contact.pug', params);
})

app.get('/services', (req, res) => {
    const params = {}
    res.status(200).render('services.pug', params);
})

app.post('/contact', (req, res) => {
    var myData = new contact(req.body);

    myData.save().then(() => {
        res.status(200).render('success.pug');
    }).catch(() => {
        res.status(400).render('failed.pug');
    });
})

app.post('/signUp', (req, res) => {
    var myData = new User(req.body);
    const pass = req.body['password'];
    const pass1 = req.body['confPassword'];
    User.exists({ "email": req.body['email'] }).then(exists => {
        if (exists) {
            res.status(400).render('failed.pug');
        }
        else {
            if (pass == pass1) {

                myData.save().then(() => {
                    res.status(200).render('success.pug');
                }).catch(() => {
                    res.status(400).render('failed.pug');
                });

            }
            else {
                res.status(400).render('failed.pug');
            }
        }
    });
});

app.post('/login', (req, res) => {
    User.findOne({ 'email': req.body['email'] }, function (err, user) {
        if (err) throw err;
        user.comparePassword(req.body['password'], function (err, isMatch) {
            if (err) throw err;
            let result = isMatch;
            if (result) {
                res.status(200).render('success.pug');
            }
            else {
                res.status(200).render('failed.pug');
            }
        });
    });
});

app.get('/login', (req, res) => {
    res.status(200).render('login.pug');
});


app.get('/video', (req, res) => {
    res.status(200).render('video.pug');
});

app.get('/video1', (req, res) => {
    res.status(200).render('video1.pug');
});

app.get('/video2', (req, res) => {
    res.status(200).render('video2.pug');
});

app.get('/video3', (req, res) => {
    res.status(200).render('video3.pug');
});

app.get('/signUp', (req, res) => {
    res.status(200).render('SignUp.pug');
});

app.get('/aboutUs', (req, res) => {
    res.status(200).render('aboutUs.pug');
});

app.get('/class', (req, res) => {
    res.status(200).render('class.pug');
});

app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});