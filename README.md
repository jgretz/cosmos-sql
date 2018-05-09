# cosmos-sql

## What is it?
cosmos-sql is a wrapper around [Azure Cosmos DB SQL API](https://docs.microsoft.com/en-us/azure/cosmos-db/sql-api-introduction). In short, Cosmos DB SQL API is a basic document database, with the added spice that these documents can be queried by SQL. I've found this combination to be surprisingly powerful and useful, especially when prototyping.

The intent of this package is to provide more syntactic sugar than documentdb, which is prescribed by the tutorials and sadly relies heavily on callbacks.

## Installation
```
npm install cosmos-sql --save
```

or

```
yarn add cosmos-sql
```

## Setup
This package exposese single asynchronous function as the default export. This function accepts a configuration and returns an object that will allow you to easily access your database.

```
import cosmosSql from 'cosmos-sql';

const config = { ... };
const cosmos = await cosmosSql(config); // cosmos is now the access object described below
```

## Configuration
There are two logical groups of configuration options. The access group are required to be provided by you (it is your database after all), while I provide intellegent defaults for the options.

### Access
```
{
  uri: 'the uri of your COSMOSDB SQL API service', // you can copy this from the azure dashboard under Keys
  primaryKey: 'the uri of your COSMOSDB SQL API service', // you can copy this from the azure dashboard under Keys
  database: 'the name of your database',
  collections: [], // an array of strings that represent the collections in your database
}
```

### Options
```
{
  createDatabaseIfNotExists: true, // if the database doesnt exist and this is true (default), cosmos-sql will create the database
  createCollectionIfNotExists: true,  // if the collection doesnt exist and this is true (default), cosmos-sql will create the collection

  collectionDefaultThroughput: 400, // when creating the collection, this will be the configured throughput RU/s.
}
```

*Please note: the creation of collections does start the meter for billing on azure, so be sure to be aware of that*

## Access Object
Once configured, the function will return an js object with the following structure:

```
{
  client, // this is the raw documentdb client
  database, // this is the raw documentdb database

  // there will be a property for each collection you named in the array.
  // Each collection object will follow the pattern laid out below.
  ...collections by name 
}
```

## Collections
As mentioned above, each collection passed into the configuration will reside on the access object at a property with the supplied name. (i.e. links will be at cosmos.links). Each collection will follow this pattern:

```
{
  collection, // the raw documentdb collection
  
  getById: async (id) => {} // pass the id of the document, get the document
  query: async (id) => {} // pass the query (string or object), and get an array of the results

  create: async (document) => {} // pass the json object, get the document result
  update: async (id, document) => {} // pass the id of the document to update and the json object, get the document result
  delete: async (id) => {} // pass the id of the document, get the result from the database 
}
```

### Querying
The sql understood by Cosmos DB SQL API is actually pretty robust (which is a large reason it's so helpful). To learn more, see their [documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/sql-api-sql-query-reference).