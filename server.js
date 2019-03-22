// const movies = require('./movies.json');
const imdb = require('./src/imdb');
const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const DENZEL_IMDB_ID = 'nm0000243';

const CONNECTION_URL = "mongodb+srv://fenohanta:lolxdlolxd@denzel-tjyxp.mongodb.net/test?retryWrites=true";

const DATABASE_NAME = "example";

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var database, collection;

app.listen(3000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("people");
        console.log("Connected to `" + DATABASE_NAME + "`!");


        app.get("/",async (request, response) => {
            const movies = await imdb(DENZEL_IMDB_ID);
             collection.insertMany(movies, (error, result) => {
                if(error) {
                    return response.status(500).send(error);
                }
                response.send(`Hello world`);
            });
        });


        //get populate
        app.get("/movies/populate",async (request, response) => {
            const movies = await imdb(DENZEL_IMDB_ID);
             collection.insertMany(movies, (error, result) => {
                if(error) {
                    return response.status(500).send(error);
                }
                response.send(`🍿 ${movies.length} movies found.`);
            });
        });


        //get movies
        app.get("/movies",async (request, response) => {
            const movies = await imdb(DENZEL_IMDB_ID);
             collection.insertMany(movies, (error, result) => {
                if(error) {
                    return response.status(500).send(error);
                }
                response.send(JSON.stringify(movies, null, 2));
            });
        });

        //get movies/:id
        app.get("/movies/:id",async (request, response) => {
            const movies = await imdb(DENZEL_IMDB_ID);
            collection.find({ "id": request.params.id }).toArray((error, resultat) => {
                if(error) {
                    return response.status(500).send(error);
                }
                response.send(resultat);
            });
        });

        app.post("/movies/:id", (request, response) => {
            collection.updateOne(
              { id: request.params.id },
              { $set: { date: request.body.date, review: request.body.review } },
              (error, result) => {
                if (error) {
                  return response.status(500).send(error);
                }
                response.send(result.result);
              }
            );
          });



        // app.get('/movies/search', (req, res, next) => {
        //     var my_limit = parseInt( req.param('limit'));
            
        //     var my_metascore = parseInt( req.param('metascore'));
        //     if (req.param('limit')==null)my_limit=5;
        //     if(req.param('metascore')== null) my_metascore=0;
        //     collection.aggregate([
        //       { $match: { metascore: { $gte: my_metascore } }},
        //       { $sample: { size: my_limit } } ]).toArray(function(err, docs) {
        //       assert.equal(err, null);
        //       console.log("Search");
        //       console.log(docs); res.json(docs);
              
        //     });
        
        //   });

        app.get("/movies/search", (request, response) => {
            console.log(request.query.limit);
            collection
              .aggregate([
                {
                  $match: { metascore: { $gte: Number(request.query.metascore) } }
                },
                { $sample: { size: Number(request.query.limit) } }
              ])
              .toArray((error, result) => {
                if (error) {
                  return response.status(500).send(error);
                }
                response.send(result);
              });
          });


    });
});