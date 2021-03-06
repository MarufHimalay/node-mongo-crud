const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;

const MongoClient = require('mongodb').MongoClient;

const password = "903sCuUnvpl626IB";

const uri = "mongodb+srv://organicUser:Ddxv5dea3E9R2GiG@cluster0.vo54x.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})



// const uri = "mongodb+srv://organicUser:<password>@cluster0.vo54x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");
    app.get('/products', (req, res) => {
        productCollection.find({})
        .toArray( (err, documents) =>{
          res.send(documents);
        })
      })

    app.get('/product/:id', (req, res) => {
        productCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err, documents) => {
            res.send(documents[0]);
    })
    
    })

    app.post("/addProduct", (req, res) => {
       const product = req.body;
       productCollection.insertOne(product)
       .then(result => {
           console.log('data added successfully');
           res.redirect('/');
       })
    })

    app.patch('/update/:id', (req, res) => {
        productCollection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set: {price:req.body.price, quantity:req.body.quantity}
        })
        .then(result => {
            res.send(result.modifiedCount>0)
        })
    })


    app.delete('/delete/:id', (req, res) => {
        productCollection.deleteOne({_id:ObjectId(req.params.id)})
        .then( result => { 
            console.log(result);
            res.send(result.deletedCount>0)
        })
        
    })

    console.log("database connected");

});


app.listen(3000);