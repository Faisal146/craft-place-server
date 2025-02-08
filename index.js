const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
require("dotenv").config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use environment variables for security
const uri = process.env.MONGODB_URI;

// Create a MongoDB client (DO NOT call .connect() in every route)
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

// Call connectDB() once when starting
connectDB();

const database = client.db("insertDB");
const items = database.collection("items");

// 🌟 Optimized API routes
app.post("/items", async (req, res) => {
  try {
    const dataToInsert = req.body;
    const result = await items.insertOne(dataToInsert);
    res.json(result);
    console.log("✅ Data inserted");
  } catch (error) {
    console.error("❌ Insert error:", error);
    res.status(500).json({ error: "Failed to insert data" });
  }
});

app.get("/items", async (req, res) => {
  try {
    const result = await items.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

app.get("/items/:id", async (req, res) => {
  try {
    const getId = req.params.id;
    const result = await items.findOne({ _id: new ObjectId(getId) });
    res.send(result);
  } catch (error) {
    console.error("❌ Get item error:", error);
    res.status(500).json({ error: "Failed to get item" });
  }
});

app.get("/allitems/:email", async (req, res) => {
  try {
    const getEmail = req.params.email;
    const result = await items.find({ user_email: getEmail }).toArray();
    res.send(result);
  } catch (error) {
    console.error("❌ Fetch by email error:", error);
    res.status(500).json({ error: "Failed to get items by email" });
  }
});

app.delete("/item/:id", async (req, res) => {
  try {
    const deleteId = req.params.id;
    const result = await items.deleteOne({ _id: new ObjectId(deleteId) });
    res.send(result);
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

app.put("/item/:id", async (req, res) => {
  try {
    const putId = req.params.id;
    const newitem = req.body;
    const updatedUser = {
      $set: {
        image: newitem.imagei,
        name: newitem.namei,
        subcategory: newitem.subcategoryi,
        short_description: newitem.short_descriptioni,
        customization: newitem.customizationi,
        stock_status: newitem.stock_statusi,
        price: newitem.pricei,
        rating: newitem.ratingi,
        Processing_time: newitem.Processing_timei,
      },
    };
    const result = await items.updateOne(
      { _id: new ObjectId(putId) },
      updatedUser,
      { upsert: true }
    );
    res.send(result);
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({ error: "Failed to update item" });
  }
});

// Basic test routes
app.get("/", (req, res) => {
  res.send("Craft place server is running");
});

app.get("/item", (req, res) => {
  res.send({ item1: "apple", item2: "banana" });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
