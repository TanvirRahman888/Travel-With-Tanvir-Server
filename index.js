const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const corsConfig = {
    origin: ["http://localhost:5173", "https://travel-with-tanvir.web.app"],
    credentials: true,
  };
 app.use(cors(corsConfig));
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
        // await client.connect();

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
            const cursor = spotCollection.find(query);
            const myList = await cursor.toArray();
            res.send(myList);
        })

        // Show Country Spot
        app.get('/allSpot/:country', async (req, res) => {
            const country = req.params.country;
            const query = { countryName: country };
            const cursor = spotCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })


        // Add a Spot
        app.post('/TouristSpot', async (req, res) => {
            const newSpot = req.body;
            console.log(newSpot);
            const result = await spotCollection.insertOne(newSpot);
            res.send(result);
        })
        // Delete a Spot
        app.delete('/TouristSpot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await spotCollection.deleteOne(query);
            res.send(result);
        })

        // Update a Spot
        app.get('/TouristSpot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await spotCollection.findOne(query);
            res.send(result)
        })

        app.put('/TouristSpot/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedSpot = req.body;
            const spot = {
                $set: {
                    spotName: updatedSpot.spotName,
                    countryName: updatedSpot.countryName,
                    location: updatedSpot.location,
                    cost: updatedSpot.cost,
                    image: updatedSpot.image,
                    seasonality: updatedSpot.seasonality,
                    description: updatedSpot.description,
                    duration: updatedSpot.duration,
                    yearlyVisitors: updatedSpot.yearlyVisitors,
                    authorName: updatedSpot.authorName,
                    authorEmail: updatedSpot.authorEmail,

                }
            }
            const result = await spotCollection.updateOne(filter, spot, options);
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
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
