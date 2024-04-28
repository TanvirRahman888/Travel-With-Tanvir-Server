const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

// Travel-With-Tanvir EAjKetBCtbcwcLxM

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ilfvfer.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        await client.connect();

        const spotCollection = client.db("spotDB").collection("spots");

        // Show All Spot
        app.get('/TouristSpot', async (req, res) => {
            const cursor = spotCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // Show Selected Spot
        app.get('/TouristSpot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const spot = await spotCollection.findOne(query);
            res.send(spot)
        })
        // Show My Listed Spot
        app.get('/MyList/:email', async (req, res) => {
            const email = req.params.email;
            const query = { authorEmail: email };
            const cursor = await spotCollection.find(query);
            const myList = await cursor.toArray();
            res.send(myList);
        })



        app.post('/TouristSpot', async (req, res) => {
            const newSpot = req.body;
            console.log(newSpot);
            const result = await spotCollection.insertOne(newSpot);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Travel Server is Running");
})

app.listen(port, () => {
    console.log(`Travel Server is running on port : ${port}`);
})
