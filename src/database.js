import {makeDatabaseUrl, HTTP_STATUS} from './util';

const createDatabase = (client, config, resolve, reject) => {
  client.createDatabase({id: config.database}, (err, created) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(created);
  });
};

export default (client, config) => new Promise((resolve, reject) => {
  client.readDatabase(makeDatabaseUrl(config), (err, result) => {
    if (err) {
      if (err.code === HTTP_STATUS.NOTFOUND && config.createDatabaseIfNotExists) {
        createDatabase(client, config, resolve, reject);
        return;
      }

      reject(err);
      return;
    }

    resolve(result);
  });
});
