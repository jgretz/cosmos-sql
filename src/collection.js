import {makeDatabaseUrl, makeCollectionUrl, HTTP_STATUS, makeDocumentUrl} from './util';

const resolveOrReject = (resolve, reject) => (err, result) => {
  if (err) {
    reject(err);
    return;
  }

  resolve(result);
};

const createCollection = (client, config, collection, resolve, reject) => {
  client.createCollection(makeDatabaseUrl(config), {id: collection}, {offerThroughput: config.collectionDefaultThroughput}, resolveOrReject(resolve, reject));
};

const getCollection = (client, config, collection) => new Promise((resolve, reject) => {
  const handle404 = err => {
    if (err.code === HTTP_STATUS.NOTFOUND && config.createCollectionIfNotExists) {
      createCollection(client, config, collection, resolve, reject);
      return;
    }

    reject(err);
  };

  client.readCollection(makeCollectionUrl(config, collection), resolveOrReject(resolve, handle404));
});

const getById = (client, config, collection) => id => new Promise((resolve, reject) => {
  client.readDocument(makeDocumentUrl(config, collection, id), resolveOrReject(resolve, reject));
});

const query = (client, config, collection) => query => new Promise((resolve, reject) => {
  client.queryDocuments(makeCollectionUrl(config, collection), query).toArray(resolveOrReject(resolve, reject));
});

const create = (client, config, collection) => doc => new Promise((resolve, reject) => {
  client.createDocument(makeCollectionUrl(config, collection), doc, resolveOrReject(resolve, reject));
});

const replace = (client, config, collection) => (id, doc) => new Promise((resolve, reject) => {
  client.replaceDocument(makeDocumentUrl(config, collection, id), doc, resolveOrReject(resolve, reject));
});

const remove = (client, config, collection) => id => new Promise((resolve, reject) => {
  client.deleteDocument(makeDocumentUrl(config, collection, id), resolveOrReject(resolve, reject));
});

export default async (client, config, collectionName) => {
  const collection = await getCollection(client, config, collectionName);

  return {
    collection,

    getById: getById(client, config, collectionName),
    query: query(client, config, collectionName),

    create: create(client, config, collectionName),
    replace: replace(client, config, collectionName),
    delete: remove(client, config, collectionName),
  };
};
