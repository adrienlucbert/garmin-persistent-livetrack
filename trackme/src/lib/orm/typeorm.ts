import type { DataSource } from "typeorm"
import { SqliteDatabase } from "./data-sources/sqlite"

export class TypeOrm {
	private static datasource: Promise<DataSource> | null = null

	private constructor() {}

	public static db(): Promise<DataSource> {
		if (TypeOrm.datasource === null) {
			TypeOrm.datasource = SqliteDatabase.initialize()

			TypeOrm.datasource
				.then(() => {
					console.info("Datasource initialized.")
				})
				.catch((err) => {
					console.error("Error during data initialization", err)
				})
		}
			return TypeOrm.datasource
	}
}
