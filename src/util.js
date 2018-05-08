export const HTTP_STATUS = {
  NOTFOUND: 404,
};

export const makeDatabaseUrl = config => `dbs/${config.database}`;
export const makeCollectionUrl = (config, collection) => `${makeDatabaseUrl(config)}/colls/${collection}`;
