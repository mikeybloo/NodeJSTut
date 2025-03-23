import express, {Request, Response} from 'express';
import Customer from './models/customer';
import {connect, set} from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
set('strictQuery', false);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if(process.env.NODE_ENV !== 'production'){
    dotenv.config();
}

const PORT = process.env.PORT || 3000;
const CONN = process.env.CONNECTION as string;

app.get('/', (req: Request, res: Response) => {
    res.send("Hello :)");
});

app.get('/api/customers', async (req: Request, res: Response) => {
    try {
        const result = await Customer.find();
        res.send({ "customers": result });
    } catch(e){
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/customers/:id', async(req: Request, res: Response) => {
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

app.get('/api/orders/:id', async(req: Request, res: Response) => {
    console.log({ 
        requestParams: req.params,
        requestQuery: req.query
    });
    try{
        const orderId = req.params.id;
        const result = await Customer.findOne({ 'orders._id': orderId });
        console.log(result);
        if(!result){
            res.status(404).json({ error: 'Order not found' });
        } else {
            res.json({result});
        }        
    } catch(e){
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.post('/', (req: Request, res: Response) => {
    res.send('This is a post request');
});

app.post('/api/customers', async (req: Request, res: Response) => {
    console.log(req.body);
    const customer = new Customer(req.body);
    try{
        await customer.save();
        res.status(201).json({customer});
    } catch(e){
        res.status(400).json({ error: e.message });
    }
});

app.put('/api/customers/:id', async (req: Request, res: Response) => {
    try{
        const customerId = req.params.id;
        const customer = await Customer.findOneAndReplace({ _id: customerId }, req.body, { new: true });
        res.json({ customer });
    } catch(e){
        console.log(e.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.patch('/api/customers/:id', async (req: Request, res: Response) => {
    try{
        const customerId = req.params.id;
        const customer = await Customer.findOneAndUpdate({ _id: customerId }, req.body, { new: true });
        res.json({ customer });
    } catch(e){
        console.log(e.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.patch('/api/orders/:id', async (req: Request, res: Response) => {
    console.log(req.params);
    const orderId = req.params.id;
    req.body._id = orderId;
    try{
        const result = await Customer.findOneAndUpdate(
            { 'orders._id': orderId },
            { $set: { 'orders.$': req.body }},
            { new: true }
        );
        console.log(result);

        if(result){
            res.json(result);
        } else {
            res.status(404).json({ error: 'Something went wrong' });
        }
    } catch(e){
        console.log(e.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.delete('/api/customers/:id', async (req: Request, res: Response) => {
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
        await connect(CONN);

        app.listen(PORT, () => {
            console.log(`App listeting on ${PORT}`);
        });
    } catch(err) {
        console.log(err);
    }
};

start();