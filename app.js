// const movies = require('./movies.json');
const imdb = require('./src/imdb');
const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const DENZEL_IMDB_ID = 'nm0000243';

const CONNECTION_URL = "mongodb+srv://fenohanta:lolxdlolxd@denzel-tjyxp.mongodb.net/test?retryWrites=true";

const DATABASE_NAME = "denzel";
const graphqlHTTP = require("express-graphql");
const gql = require('graphql-tag');
const {
  buildASTSchema
} = require("graphql");

var app = Express();
//GraphQL schema
const schema = buildASTSchema(gql `
type Query {
  populate: Populate
  random: Movie
  getMovie(id: String) : Movie
  getMovies(metascore: Int, limit: Int): [Movie]
  postReview(id: String, review: Review): Movie
},
type Movie {
  link: String
  id: String
  metascore: Int
  poster: String
  rating: Float
  synopsis: String
  title: String
  votes: Float
  year: Int
  date: String
  review: String
},
type Populate{
  total: String
},
input Review{
  date: String
  review: String
}
`)

const root = {
populate: async (source, args) => {
  const movies = await populate(DENZEL_IMDB_ID);
  const insertion = await collection.insertMany(movies);
  return {
    total: insertion.movie.n
  };
},
random: async () => {
  let query = {
    "metascore": {
      $gte: 70
    }
  }
  let count = await collection.countDocuments(query);
  let random = Math.floor(Math.random() * count);
  let options = {
    "limit": 1,
    "skip": random
  }
  const movie = await collection.findOne(query, options);
  return movie;
},
getMovie: async (args) => {
  const movie = await collection.findOne({
    "id": args.id
  });
  return movie;
},
getMovies: async (args) => {
  let query = {
    "metascore": {
      $gte: args.metascore
    }
  };
  let options = {
    "limit": args.limit,
    "sort": [
      ['metascore', 'desc']
    ]
  };
  const movies = await collection.find(query, options).toArray();
  return movies;
},
postReview: async (args) => {
  let selector = {
    "id": args.id
  };
  let document = {
    $set: args.review
  };
  let options = {
    "upsert": true
  };
  const post = await collection.updateMany(selector, document, options)
  const modified = await collection.findOne(selector);
  return modified;
}
}

async function populate(actor) {
try {
  console.log(`📽️  fetching filmography of ${actor}...`);
  return await imdb(actor);
} catch (e) {
  console.error(e);
}
}



app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))


app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var database, collection;


app.listen(9292, () => {
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
                console.log("Connected to " + DATABASE_NAME + "!");
                console.log("goto browser");
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
        //post movies by id
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

        //search with metascore and can limit responses
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