const express = require('express');
const mongoose = require('mongoose');

const app = express();
mongoose.set('strictQuery', false);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const PORT = process.env.PORT || 3000;
const CONN = process.env.CONNECTION;

const json = [
    {
        "name": "Caleb",
        "industry": "music"
    }, 
    {
        "name": "John",
        "industry": "networking"
    },
    {
        "name": "Sal",
        "industry": "sports medicine"
    }
];

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.get('/api/customers', (req, res) => {
    res.send({ "customers": json });
});

app.post('/', (req, res) => {
    res.send('This is a post request');
});

app.post('/api/customers', (req, res) => {
    reqData = req.body;
    console.log(reqData);
    res.send(req.body);
});

const start = async() => {
    try {
        await mongoose.connect(CONN);

        app.listen(PORT, () => {
            console.log(`App listeting on ${PORT}`);
        });
    } catch(err) {
        console.log(err);
    }
};

start();