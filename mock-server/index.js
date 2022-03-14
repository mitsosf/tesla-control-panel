const express = require('express')

const app = express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const port = 8000

app.get('/', (req, res) => {
    res.send('Tesla API mock server')
})

app.post('/oauth/token', (req, res) => {
    if (req.body.email === 'test@test.com' && req.body.password === 'test') {
        res.send(
            {
                "access_token": "abc123123123",
                "token_type": "bearer",
                "expires_in": 3888000,
                "refresh_token": "123abcabcabc",
                "created_at": new Date().getTime()
            }
        )
    } else {
        res.send({ "response": "authorization_required_for_txid_``" })
    }

})

app.listen(port, (req, res) => {
    console.log(`Example app listening on port ${port}`)
})