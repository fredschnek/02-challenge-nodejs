import { knex as setupKnex } from 'knex'
import { env } from './env'

if (process.env.DATABASE_URL === undefined) {
  throw new Error('DATABASE_URL is not defined')
}

const connectionConfig =
  env.DATABASE_CLIENT === 'sqlite'
    ? { filename: env.DATABASE_URL }
    : env.DATABASE_URL

export const config = {
  client: env.DATABASE_CLIENT,
  connection: connectionConfig,
  useNullAsDefault: true,
  migrations: {
    directory: './db/migrations',
    extension: 'ts',
  },
}

export const knex = setupKnex(config)
