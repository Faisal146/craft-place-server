const express = require('express');
const cors = require("cors")
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');


const app = express()
const port = process.env.PORT || 5000

// siam204
// DhbeLrL59a7s5cq4

app.use(cors())
app.use(express.json())


// new database
// siam
// siam204204



const uri = "mongodb+srv://siam:siam204204@cluster0.hzomr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const database = client.db("insertDB");
    const items = database.collection("items");
    await client.connect();

    app.post('/items', async (req, res) => {
      // Access data from the POST request body
      const dataToInsert = req.body;

      await client.connect();

      console.log(req.body)
      // Insert data into MongoDB collection
         items.insertOne(dataToInsert)
          .then(result => {
            res.json(result);
            console.log('data inserted')
          })
          .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Failed to insert data'   
       });
       });
    });

    app.get('/items', async (req, res) => {

      //  await items.find();
      await client.connect();


        const cursor = items.find();
        const result = await cursor.toArray();
        res.send(result);

    })

    app.get('/items/:id' , async (req, res) => {

      await client.connect();
      const getId = req.params.id;
       let query = {_id : new ObjectId(getId)}

      const result = await items.findOne(query);
      res.send(result); 
 
    })
    app.get('/allitems/:email' , async (req, res) => {

      await client.connect();
      const getEmail = req.params.email;
      console.log(getEmail)
    //   let query = {_id : new ObjectId(getId)}

      
      const cursor = items.find({user_email : getEmail});
      const result = await cursor.toArray()
      console.log(result)
      res.send(result); 
 
    })

    app.delete('/item/:id' , async (req, res) => {   
      await client.connect();
      const deleteId = req.params.id;
      console.log('please delete form database' , deleteId);
       let query = {_id : new ObjectId(deleteId)}

       const result = await items.deleteOne(query);
       res.send(result);

    })

    
    app.put('/item/:id' , async (req, res) => {
     //  await client.connect();
      const putId = req.params.id;
       const newitem = req.body
        let query = {_id : new ObjectId(putId)}
        let options = { upsert : true  }
        let updatedUser = {
         $set : {
          image: newitem.imagei,
          name: newitem.namei,
          subcategory: newitem.subcategoryi,
          short_description: newitem.short_descriptioni,
          customization: newitem.customizationi,
          stock_status: newitem.stock_statusi,
          price: newitem.pricei,
          rating: newitem.ratingi,
          Processing_time: newitem.Processing_timei
        }
       }

       const result = await items.updateOne(query, updatedUser, options)
       res.send(result)

     // const result = await haiku.delete One(query);
     // res.send(result);
     console.log(newitem)

    })







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



app.get("/" , (req, res) =>{
    res.send("Craft place server is running")
})

app.get("/item" , (req, res) =>{
    res.send({item1 : 'apple', item2 : 'banana'})
})

app.listen(port, ()=>{ 
    console.log(`simple crud is runnig in port, ${port}`)
})