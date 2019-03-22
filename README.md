# DENZEL

## Run the program
> To run the program, tap the folowing command on the folder:
> ```
> node app.js
> ``` 

and go to :  http://localhost:9292

<!--
![denzel](https://m.media-amazon.com/images/M/MV5BMjE5NDU2Mzc3MV5BMl5BanBnXkFtZTcwNjAwNTE5OQ@@._V1_SY1000_SX750_AL_.jpg)
-->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [DENZEL](#denzel)
  - [Run the program](#run-the-program)
  - [Definition and Configuration](#definition-and-configuration)
    - [REST endpoints to implement](#rest-endpoints-to-implement)
      - [`GET /movies/populate`](#get-moviespopulate)
      - [`GET /movies`](#get-movies)
      - [`GET /movies/:id`](#get-moviesid)
      - [`GET /movies/search`](#get-moviessearch)
      - [POST /movies/:id](#post-moviesid)
    - [GraphQL endpoints to implement](#graphql-endpoints-to-implement)
      - [Schema](#schema)
  - [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Definition and Configuration

### REST endpoints to implement

#### `GET /movies/populate`

Populate the database with all the [Denzel's movies from IMDb](https://www.imdb.com/name/nm0000243).

You could use the [src/imdb.js](./src/imdb.js) ready-to-use exported function.

```sh
❯ curl -H "Accept: application/json" http://localhost:9292/movies/populate
{
  "total": 56
}
```

Start [node sandbox.js](./sandbox.js) for an usage example.

```sh
❯ node sandbox.js
📽️  fetching filmography of nm0000243...
🍿 56 movies found.
[
  {
    "link": "https://www.imdb.com/title/tt3766354/?ref_=nm_flmg_act_1",
    "id": "tt3766354",
    "metascore": 50,
    "poster": "https://m.media-amazon.com/images/M/MV5BMTU2OTYzODQyMF5BMl5BanBnXkFtZTgwNjU3Njk5NTM@._V1_UX182_CR0,0,182,268_AL_.jpg",
    "rating": 6.7,
    "synopsis": "Robert McCall serves an unflinching justice for the exploited and oppressed, but how far will he go when that is someone he loves?",
    "title": "Equalizer 2 (2018)",
    "votes": 85.815,
    "year": 2018
  },
  {
    "link": "https://www.imdb.com/title/tt6000478/?ref_=nm_flmg_act_2",
    "id": "tt6000478",
    "metascore": 58,
    "poster": "https://m.media-amazon.com/images/M/MV5BMjMyNjkxMTg2NV5BMl5BanBnXkFtZTgwNjkyNTk0MzI@._V1_UX182_CR0,0,182,268_AL_.jpg",
    "rating": 6.4,
    "synopsis": "Roman J. Israel, Esq., a driven, idealistic defense attorney, finds himself in a tumultuous series of events that lead to a crisis and the necessity for extreme action.",
    "title": "L'Affaire Roman J. (2017)",
    "votes": 22.524,
    "year": 2017
  },
  ...
]
```

#### `GET /movies`

Fetch a random **must-watch** movie.

```sh
❯ curl -H "Accept: application/json" http://localhost:9292/movies
{
  "id": "tt0765429",
  "link": "https://www.imdb.com/title/tt0765429/?ref_=nm_flmg_act_13",
  "metascore": 76,
  "poster": "https://m.media-amazon.com/images/M/MV5BMTkyNzY5MDA5MV5BMl5BanBnXkFtZTcwMjg4MzI3MQ@@._V1_UY268_CR4,0,182,268_AL_.jpg",
  "rating": 7.8,
  "synopsis": "An outcast New York City cop is charged with bringing down Harlem drug lord Frank Lucas, whose real life inspired this partly biographical film.",
  "title": "American Gangster (2007)",
  "votes": 362.951,
  "year": 2007
}
```

#### `GET /movies/:id`

Fetch a specific movie.

```sh
❯ curl -H "Accept: application/json" http://localhost:9292/movies/tt0477080
{
  "id": "tt0477080",
  "link": "https://www.imdb.com/title/tt0477080/?ref_=nm_flmg_act_9",
  "metascore": 69,
  "poster": "https://m.media-amazon.com/images/M/MV5BMjI4NDQwMDM0N15BMl5BanBnXkFtZTcwMzY1ODMwNA@@._V1_UX182_CR0,0,182,268_AL_.jpg",
  "rating": 6.8,
  "synopsis": "With an unmanned, half-mile-long freight train barreling toward a city, a veteran engineer and a young conductor race against the clock to prevent a catastrophe.",
  "title": "Unstoppable (2010)",
  "votes": 171.245,
  "year": 2010
  }
```

#### `GET /movies/search`

Search for Denzel's movies.

This endpoint accepts the following optional query string parameters:

* `limit` - number of movies to return (default: 5)
* `metascore` - filter by metascore (default: 0)

The results array should be sorted by metascore in descending way.

```sh
❯ curl -H "Accept: application/json" http://localhost:9292/movies/search?limit=5&metascore=77
{
  "limit": 5,
  "results": [
  {
    "id": "tt2671706",
    "link": "https://www.imdb.com/title/tt2671706/?ref_=nm_flmg_act_3",
    "metascore": 79,
    "poster": "https://m.media-amazon.com/images/M/MV5BOTg0Nzc1NjA0MV5BMl5BanBnXkFtZTgwNTcyNDQ0MDI@._V1_UX182_CR0,0,182,268_AL_.jpg",
    "rating": 7.2,
    "synopsis": "A working-class African-American father tries to raise his family in the 1950s, while coming to terms with the events of his life.",
    "title": "Fences (2016)",
    "votes": 84.291,
    "year": 2016
  },
  {
    "id": "tt0115956",
    "link": "https://www.imdb.com/title/tt0115956/?ref_=nm_flmg_act_31",
    "metascore": 77,
    "poster": "https://m.media-amazon.com/images/M/MV5BODJlOTlkNzUtN2U2OC00NWUxLTg3MjgtNGVmZGU5ZTk0ZjM4XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_UX182_CR0,0,182,268_AL_.jpg",
    "rating": 6.6,
    "synopsis": "A U.S. Army officer, despondent about a deadly mistake he made, investigates a female chopper commander's worthiness for the Medal of Honor.",
    "title": "À l'épreuve du feu (1996)",
    "votes": 46.271,
    "year": 1996
  },
  {
    "id": "tt0112857",
    "link": "https://www.imdb.com/title/tt0112857/?ref_=nm_flmg_act_32",
    "metascore": 78,
    "poster": "https://m.media-amazon.com/images/M/MV5BNjI3NjFiNmMtMmQ1ZC00OTUwLWJlMWMtM2UxY2M2NDQ0OWJhXkEyXkFqcGdeQXVyNTI4MjkwNjA@._V1_UX182_CR0,0,182,268_AL_.jpg",
    "rating": 6.7,
    "synopsis": "An African-American man is hired to find a woman, and gets mixed up in a murderous political scandal.",
    "title": "Le diable en robe bleue (1995)",
    "votes": 15.686,
    "year": 1995
  }],
  "total": 3
}
```

#### POST /movies/:id

Save a watched date and a review.

This endpoint accepts the following post parameters:

* `date` - the watched date
* `review` - the personal review

```sh
❯ curl -X POST -d '{"date": "2019-03-04", "review": "😍 🔥"}' -H "Content-Type: application/json" http://localhost:9292/movies/tt0328107
{
  "_id": "507f191e810c19729de860ea"
}
```


### GraphQL endpoints to implement

Same definitions as REST API with `/graphql` endpoint.

* Populate the database
* Fetch a random **must-watch** movie
* Fetch a specific movie
* Search for Denzel's movies
* Save a watched date and a review.

#### Schema

```
schema {
  query Query
}

type Query {
  movies: [Movie]
  movie: Movie
}

type Movie {
  link: String
  metascore: Int
  synopsis: String
  title: String
  year: Int
}
```

```sh
❯ curl -d '{"query": "movie {link metascore synopsis title year}"}' -H "Content-Type: application/json" http://localhost:9292/graphql
{
  "data": {
    "movie": {
      "link": "https://www.imdb.com/title/tt0174856/?ref_=nm_flmg_act_23",
      "metascore": 74,
      "synopsis": "The story of Rubin \"Hurricane\" Carter, a boxer wrongly imprisoned for murder, and the people who aided in his fight to prove his innocence.",
      "title": "Hurricane Carter (1999)",
      "year": 1999
    }
  }
}


```
**Some Graphql queries :**
```js
query{
  random{
    id,title,metascore,link,year,date,rating,votes,review
  }
}
---------------------------------------------------------------
query{
  getMovie(id:"tt0174856"){
    title,metascore,synopsis,review
  }
}
---------------------------------------------------------------


```

## Licence

[Uncopyrighted](http://zenhabits.net/uncopyright/)
