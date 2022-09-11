const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require("cors")
require('dotenv').config()
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bbiqawj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect();
    const collection = client.db("fashion").collection("uniform");
    const orderCollection = client.db("fashion").collection("order");
    app.get("/fashion" , async(req , res) =>{
      const result = await collection.find().toArray()
      res.send(result)
    })
    app.post("/fashion/order" , async (req , res) =>{
      const order = req.body     
     
      const result = await  orderCollection.insertOne(order )
      res.send(result)
    })
    app.get("/fashion/order" , async(req , res) =>{
      const result = await orderCollection.find().toArray()
      res.send(result)
    })
    app.put("/fashion/update/:id" , async(req , res) =>{
    const id = req.params.id
    const filter = {_id : ObjectId(id)}
    const options = { upsert: true };
    const updatedData = req.body    
    const updateDoc = {
      $set: updatedData
    };
    const result = await orderCollection.updateOne(filter, updateDoc, options)
    res.send(result)
    })
    app.delete("/fashion/order/delete/:id" , async(req , res) =>{
      const id = req.params.id
    const filter = {_id : ObjectId(id)}
    const result = await orderCollection.deleteOne(filter)
    res.send(result)
    })
  }finally{}
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Toothsho company backend')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})