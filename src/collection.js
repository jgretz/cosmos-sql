import {makeDatabaseUrl, makeCollectionUrl, HTTP_STATUS} from './util';

const createCollection = (client, config, collection, resolve, reject) => {
  client.createCollection(makeDatabaseUrl(config), {id: collection}, {offerThroughput: 400}, (err, created) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(created);
  });
};

export default (client, config, collection) => new Promise((resolve, reject) => {
  client.readCollection(makeCollectionUrl(config, collection), (err, result) => {
    if (err) {
      if (err.code === HTTP_STATUS.NOTFOUND) {
        createCollection(client, collection, resolve, reject);
        return;
      }

      reject(err);
      return;
    }

    resolve(result);
  });
});
