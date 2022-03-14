const express = require('express')

const app = express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const port = 8000
const API_BASE_URL='/api/1/'
const ACCESS_TOKEN='abc123123123'
const REFRESH_TOKEN='123abcabcabc'
const VEHICLE_ID='abcdef123456'

//Endpoints
app.get('/', (req, res) => {
    res.send('Tesla API mock server')
})

app.post('/oauth/token', (req, res) => {
    if (req.body.email === 'test@test.com' && req.body.password === 'test') {
        res.send(
            {
                "access_token": ACCESS_TOKEN,
                "token_type": "bearer",
                "expires_in": 3888000,
                "refresh_token": REFRESH_TOKEN,
                "created_at": new Date().getTime()
            }
        )
    } else {
        res.send({ "response": "authorization_required_for_txid_``" })
    }

})

app.get(API_BASE_URL + 'vehicles', (req, res) => {
    if (req.header('Authorization') === 'Bearer ' + ACCESS_TOKEN) {
        res.send(
            {
                "response": [
                    {
                        "id": '1234',
                        "vehicle_id": '12345',
                        "vin": ":vin",
                        "display_name": ":name",
                        "option_codes": "AD15,AF02,AH00,APF0,APH2,APPA,AU00,BCMB,BP00,BR00,BS00,BTX4,CC02,CDM0,CH05,COUS,CW02,DRLH,DSH7,DV4W,FG02,FR01,GLFR,HC00,HP00,IDBO,INBPB,IX01,LP01,LT3B,MDLX,ME02,MI02,PF00,PI01,PK00,PMBL,QLPB,RCX0,RENA,RFPX,S02B,SP00,SR04,ST02,SU01,TIC4,TM00,TP03,TR01,TRA1,TW01,UM01,USSB,UTAB,WT20,X001,X003,X007,X011,X014,X021,X025,X026,X028,X031,X037,X040,X042,YFFC,SC05",
                        "color": null,
                        "tokens": [
                        ":token1",
                        ":token2"
                    ],
                        "state": "online",
                        "in_service": null,
                        "id_s": VEHICLE_ID,
                        "calendar_enabled": true,
                        "backseat_token": null,
                        "backseat_token_updated_at": null
                    }
                ],
                "count": 1
            }
        )
    } else {
        res.send({"response": null, "error": "not found", "error_description": ""})
    }
})

app.listen(port, (req, res) => {
    console.log(`Example app listening on port ${port}`)
})