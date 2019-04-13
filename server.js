const express = require('express');
const fs      = require('fs');
const bodyParser = require('body-parser')
const crypto = require('crypto')

const app = express();
const port=3000;

app.use(express.static('public'));
app.use(bodyParser.json({
    limit: '1mb'
}));

app.post("/state/:id", (req,res)=>{
    const hashid = hash(req.params.id);
    fs.writeFileSync(`data/${hashid}`, JSON.stringify(req.body));
    res.sendStatus(200);
});

app.get("/state/:id", (req,res)=>{
    const hashid = hash(req.params.id);
    try {
        res.send(JSON.parse(fs.readFileSync(`data/${hashid}`)));
    }
    catch (e) {
        console.log(e);
        if(e.code==='ENOENT') {
            res.sendStatus(404);
        } else {
            res.sendStatus(500);
        }
    }
});

app.listen(port, ()=>console.log(`listening to ${port}`));

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function clone(val) {
    return Object.assign({}, val);
}

function hash(value) {
    const hash = crypto.createHash('md5')
    hash.update(value);
    return hash.digest('hex');
}