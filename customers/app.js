const express = require('express');
const Customer = require('./models/customer');
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

app.get('/', (req, res) => {
    res.send(customer);
});

app.get('/api/customers', async (req, res) => {
    try {
        const result = await Customer.find();
        res.send({ "customers": result });
    } catch(e){
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/customers/:id', async(req, res) => {
    console.log({ 
        requestParams: req.params,
        requestQuery: req.query
    });
    try{
        const customerId = req.params.id;
        console.log(customerId);
        const customer = await Customer.findById(customerId);
        console.log(customer);
        if(!customer){
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json({customer});
        }        
    } catch(e){
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.post('/', (req, res) => {
    res.send('This is a post request');
});

app.post('/api/customers', async (req, res) => {
    console.log(req.body);
    const customer = new Customer(req.body);
    try{
        await customer.save();
        res.status(201).json({customer});
    } catch(e){
        res.status(400).json({ error: e.message });
    }
});

app.put('/api/customers/:id', async (req, res) => {
    try{
        const customerId = req.params.id;
        const result = await Customer.replaceOne({ _id: customerId }, req.body);
        console.log(result);
        res.json({ updatedCount: result.modifiedCount });
    } catch(e){
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.delete('/api/customers/:id', async (req, res) => {
    try{
        const customerId = req.params.id;
        const result = await Customer.deleteOne({ _id: customerId });
        res.json({ deletedCount: result.deletedCount });
    } catch(e){
        res.status(500).json({ error: 'Something went wrong' });
    }
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