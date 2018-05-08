import {DocumentClient} from 'documentdb';
import getDatabase from './database';
import getCollection from './collection';

const DEFAULT_CONFIG = {
  uri: null,
  primaryKey: null,
  database: null,
  collections: [],

  createDatabaseIfNotExists: true,
  createCollectionIfNotExists: true,
};

export default async config => {
  const cosmosConfig = {
    ...DEFAULT_CONFIG,
    config,
  };

  const client = new DocumentClient(cosmosConfig.uri, {'masterKey': cosmosConfig.primaryKey});
  const database = await getDatabase(client, cosmosConfig);

  const result = {client, database};
  for (const collection of config.collections) {
    result[collection] = await getCollection(client, collection);
  }

  return result;
};
