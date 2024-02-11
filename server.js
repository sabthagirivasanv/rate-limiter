const express = require('express');
let redis = require('redis');
const {createClient} = require("redis");
const utility = require("./utility")

const app = express();
app.use(express.json());
const PORT = 8080;
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();



const config = {
    count: 5,
    sec: 60
}


app.post("/redis", (req, res) => {
    console.log(req.body)
    const key = req.body.key
    const value = req.body.value

    client.set(key, value);
    res.status(200);
    res.send("successfully added...")
});

app.get("/business/:userId", async (req, res) => {
    const userId = req.params.userId;

    console.log("existence");
    let doesExist = await client.exists(userId, (err, reply) => {
        if(reply){
            console.log("exists "+userId);
        }else{
            console.log(err);
        }
    });
    if (doesExist === 0){
        console.log("not found");
        const obj = {
            count: config.count,
            lastUpdated: Date.now()
        }
        await client.hSet(userId, obj);
    }
    let counter = await client.hGetAll(userId);



    refillTime = utility.refillTime(counter.lastUpdated, config.sec);
    currentTime = Date.now();
    console.log(`last upd: ${counter.lastUpdated} refill ${refillTime} date now: ${currentTime}`);
    if(refillTime < currentTime){
        const obj = {
            count: config.count,
            lastUpdated: Date.now()
        }
        await client.hSet(userId, obj);
    }

    counter = await client.hGetAll(userId);
    console.log("obj: "+JSON.stringify(counter));
    if(Number(counter.count) > 0){
        counter.count = Number(counter.count) - 1;
        await client.hSet(userId, counter);
        res.status(200);
        res.send("success")
    }else{
        res.status(429);
        res.send("Rate Limited");
    }
});

app.post("/", (req, res) => {
    res.status(200);
    res.send("Welcome to root URL of Server");
});

app.listen(PORT, (error) => {
    if (!error)
        console.log(
            "Server is Successfully Running, and App is listening on port " + PORT
        );
    else console.log("Error occurred, server can't start", error);
});
