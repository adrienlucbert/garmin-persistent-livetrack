import { LiveTrackSession } from '$lib/orm/models/LiveTrackSession'
import { DataSource } from 'typeorm'
import { env } from '$env/dynamic/private'
import { dev } from '$app/environment'

export const SqliteDatabase = new DataSource({
  type: 'sqlite',
  database: env.SQLITE_DB_PATH || '/data/sqlite.db',
  entities: [ LiveTrackSession ],
  logging: dev,
	synchronize: true,
})
