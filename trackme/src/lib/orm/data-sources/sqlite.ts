import { LiveTrackSession } from '$lib/orm/models/LiveTrackSession'
import { DataSource } from 'typeorm'
import { SQLITE_DB_PATH } from '$env/static/private'
import { dev } from '$app/environment'

export const SqliteDatabase = new DataSource({
	type: 'better-sqlite3',
	database: SQLITE_DB_PATH || '/data/sqlite.db',
	entities: [LiveTrackSession],
	logging: dev,
	synchronize: true,
})
