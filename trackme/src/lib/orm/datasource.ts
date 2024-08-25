import { LiveTrackSession } from '$lib/orm/models/LiveTrackSession'
import { env } from '$env/dynamic/private'
import { DataSource } from 'typeorm'
import { dev } from '$app/environment'

let datasource: DataSource | null = null
export const AppDataSource = () => {
	if (datasource === null) {
		datasource = new DataSource({
			type: 'postgres',
			url: env.DSN,
			entities: [LiveTrackSession],
			logging: dev,
			synchronize: true,
		})
	}
	return datasource
}
