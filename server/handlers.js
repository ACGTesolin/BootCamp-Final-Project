"use-strict"

const { MongoClient } = require("mongodb");
const mongo = require("mongodb");
require("dotenv").config();
const fs = require("fs");
const { builtinModules } = require("module");
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const { v4: uuidv4 } = require("uuid");


//function that retrieves all breweries from the database

const getAllBreweries = async (request, response) => {

    const client = new MongoClient(MONGO_URI, options);

    try {

        await client.connect();
        
        const db = client.db("FPDB");

        const result = await db.collection("breweries").find().toArray();
        
         result

        ? response.status(200).json({status: 200, data: result, message: "All Breweries Retrieved"})

        : response.status(404).json({status: 404, message: "Breweries not found"});

        client.close();
    }
    catch(error){

        console.log(error.stack)
    }
};

//function that retrieves all beers from the database

const getAllBeers = async (request, response) => {

    const client = new MongoClient(MONGO_URI, options);

    try {

        await client.connect();
        
        const db = client.db("FPDB");

        const result = await db.collection("beers").find().toArray();
        
         result

        ? response.status(200).json({status: 200, data: result, message: "All Beers Retrieved"})

        : response.status(404).json({status: 404, message: "Beers not found"});

        client.close();
    }
    catch(error){

        console.log(error.stack)
    }
};



//function that retrieves single brewery information from the database based on it's _id

const getBrewery = async (request, response) => {

    const client = new MongoClient(MONGO_URI, options);

    const breweryId = request.params.id; 

    try {

        await client.connect();
      
        const db = client.db("FPDB");

        const result = await db.collection("breweries").find().toArray();

        const targetBrewery = result.filter(brewery => brewery.id == breweryId)

        targetBrewery

        ? response.status(200).json({status: 200, data: targetBrewery, message: "Brewery Retrieved"})

        : response.status(404).json({status: 404, message: "Brewery not found"});

        client.close();

    }
    catch(error){

        console.log(error.stack)
    }
};


// function that retrieves an array of all beers from a specific brewery

const getBeersByBrewery = async (request, response) => {

    const client = new MongoClient(MONGO_URI, options);

    const brewery = request.params.id; 

    try {

        await client.connect();

        const db = client.db("FPDB");

        const result = await db.collection("beers").find().toArray();

        const targetBeers = result.filter(beer => beer.breweryId == brewery)

        targetBeers

        ? response.status(200).json({status: 200, data: targetBeers, message: "Beers Retrieved"})

        : response.status(404).json({status: 404, message: "Beers not found"});

        client.close();

    }
    catch(error){

        console.log(error.stack)
    }
};


//function that retrieves single beer information from the database based on it's name

const getBeer = async (request, response) => {

    const client = new MongoClient(MONGO_URI, options);

    const beerId = request.params.id; 

    try {

        await client.connect();
    
        const db = client.db("FPDB");

        const result = await db.collection("beers").find().toArray();

        const targetBeer = result.filter(beer => beer._id == beerId)

        targetBeer

        ? response.status(200).json({status: 200, data: targetBeer, message: "Beer Retrieved"})

        : response.status(404).json({status: 404, message: "Beer not found"});

        client.close();

    }
    catch(error){

        console.log(error.stack)
    }
};

//this function adds a new favourite to the database

const addFavourite = async (request, response) =>{

    const client = new MongoClient(MONGO_URI, options);

    let favourite = {...request.body, _id: uuidv4()};

    try{

        await client.connect();

        const db = client.db("FPDB");

        //add favourite data to favourites collection
        const result = await db.collection("favourites").insertOne(favourite);

        result

        ? response.status(201).json({status: 201, data: result, message: "Favourite added successfully"})

        : response.status(500).json({status: 500, message: error.message});

        await client.close();
    
    }catch(error){
console.log(error.stack)
    }
}

//this function retireves all the favourited items of a specific user

const getFavourites = async (request, response) => {

    const client = new MongoClient(MONGO_URI, options);

    const userId = request.params.id; 

    try {

        await client.connect();

        const db = client.db("FPDB");

        const result = await db.collection("favourites").find().toArray();

        const targetFave = result.filter(fave => fave.id == userId)

        targetFave

        ? response.status(200).json({status: 200, data: targetFave, message: "Favourites Retrieved"})

        : response.status(404).json({status: 404, message: "Favourites not found"});

        client.close();

    }
    catch(error){

        console.log(error.stack)
    }
};

//this function deletes a specific favourite

const deleteFavourite = async (request, response) => {

    const client = new MongoClient(MONGO_URI, options);

    const deleteId = request.params.id; 

    try {

        await client.connect();

        const db = client.db("FPDB");

         const result = await db.collection("favourites").find().toArray();

         const targetFave = result.filter(fave => fave._id == deleteId)

        const deleteQuery = {"_id": deleteId}

        const deleteFave = await db.collection("favourites").deleteOne(deleteQuery)

        deleteFave

        ? response.status(200).json({status: 200, data: deleteId, message: "Favourites Deleted"})

        : response.status(404).json({status: 404, message: "Favourites not found"});

        await client.close();

    }
    catch(error){

        console.log(error.stack)
    }
};

//this function adds a new comment to the database

const addComment = async (request, response) =>{

    const client = new MongoClient(MONGO_URI, options);

    let comment = request.body;

    try{

        await client.connect();

        const db = client.db("FPDB");

        //add comments data to comments collection
        const result = await db.collection("comments").insertOne(comment);

        result

        ? response.status(201).json({status: 201, data:comment, message: "Comment added successfully"})

        : response.status(500).json({status: 500, message: error.message});

        await client.close();
    
    }catch(error){
console.log(error.stack)
    }
}

//this function retrtieves all the comments for a single beer

const getComments = async (request, response) => {

    const client = new MongoClient(MONGO_URI, options);

    const beerId = request.params.id; 

    try {

        await client.connect();

        const db = client.db("FPDB");

        const result = await db.collection("comments").find().toArray();

        const targetComment = result.filter(comment => comment.id == beerId)

        targetComment

        ? response.status(200).json({status: 200, data: targetComment, message: "Comments Retrieved"})

        : response.status(404).json({status: 404, message: "Comments not found"});

        client.close();

    }
    catch(error){

        console.log(error.stack)
    }
};

//this function retireves all the favourited items of a specific user

const getFavouritedBeer = async (request, response) => {

    const client = new MongoClient(MONGO_URI, options);

    const beerId = request.params.id; 

    try {

        await client.connect();

        const db = client.db("FPDB");

        const result = await db.collection("favourites").find().toArray();

        const targetFave = result.filter(fave => fave.beerId == beerId)

        targetFave

        ? response.status(200).json({status: 200, data: targetFave, message: "Favourites Retrieved"})

        : response.status(404).json({status: 404, message: "Favourites not found"});

        client.close();

    }
    catch(error){

        console.log(error.stack)
    }
};



module.exports = {
                    getAllBreweries, 
                    getAllBeers, 
                    getBrewery, 
                    getBeersByBrewery, 
                    getBeer, 
                    addFavourite,
                    getFavourites,
                    deleteFavourite,
                    addComment,
                    getComments,
                    getFavouritedBeer
                }