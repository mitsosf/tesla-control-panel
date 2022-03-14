const express = require('express')
const utils = require('./utils')
const axios = require("axios");

const port = 8001
const app = express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Endpoints
app.get('/', (req, res) => {
    res.send('Tesla API server')
})

//Auth
const BASE_AUTH_API='https://auth.tesla.com/oauth2/v3/authorize'

app.post('/login', async (req, res)=> {
    await axios.get(BASE_AUTH_API, {
        params: {
            client_id: 'owner_api',
            code_challenge: utils.code_challenge,
            code_challenge_method: 'S256',
            redirect_uri: 'https://auth.tesla.com/void/callback',
            response_type: 'code',
            scope: 'openid email offline_access',
            state: '12361235bawfubyoikawbj125312acwawdawd3',
            login_hint: req.body.email,
        }
    })
})

app.listen(port, (req, res) => {
    console.log(`Example app listening on port ${port}`)
})