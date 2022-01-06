var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('./privatekey.key', 'utf8');
var certificate = fs.readFileSync('./certificate.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
const express = require('express')
const app = express()

const config = require('./config.json');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
var server = https.createServer(credentials, app);
const ports = config.httpsport;
const db = require('quick.db');

app.post('/create', (req, res) => {
    fna()
    async function fna()
    {
        const fetch = require('node-fetch');
        let user = req.body.username;
        let password = req.body.password;
        console.log(req.body)
        const response = await fetch(`https://syden.xyz:2083/execute/Email/add_pop?email=${user}&password=${password}&domain=syden.xyz&quota=0&send_welcome_email=1`, {
        method: 'POST',
        headers: {
                'Authorization': config.cpanelauth
            }
        });
        const body = await response.json();
        if(body.status == 1)
        {
            db.set(`FULLNAME_${user}@syden.xyz`,req.body.fullname);
            await db.set(`USERNAME_${user}@syden.xyz`,req.body.username);
            await db.set(`ALTMAIL_${user}@syden.xyz`,req.body.altmail);
            await db.set(`DOB_ymd-format_${user}@syden.xyz`,req.body.dob);
            res.redirect('https://mail.syden.xyz/created')
        }
        else{
            res.redirect('https://mail.syden.xyz/error')
        }
    console.log(body);
    }
})

server.listen(ports, () => {
    console.log(`Example app listening at https://mail.syden.xyz:${ports}`)
  })
