const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');
// const { json } = require('body-parser');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req,res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function(req, res) {
    console.log(req.body);
    console.log('post received');
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    // const jsonData = JSON.stringify(data);
    const url = 'https://us20.api.mailchimp.com/3.0/lists/be4206c27d';
    const options = {
        method: "POST",
        auth:'anystring:803fa21988b25f8e823db088006afb4f-us20'
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html'); 
        }
        else {
            res.sendFile(__dirname + '/failure.html');
        }

        response.on('data', function(data) {
            // Temp Disable
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

    // if (data.error_count === 0 && data.total_created ===1 ) {
        
    //     app.get('/success', function(req,res) {
    //         res.sendFile(__dirname + '/success.html');
    //     });
    // };

});

app.post('/failure', function(req, res) {
    res.redirect('/');
    console.log('this tests the fail button');
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Server started on port 3000');
});

//mailchimp api id
//803fa21988b25f8e823db088006afb4f-us20

//audience id
// be4206c27d