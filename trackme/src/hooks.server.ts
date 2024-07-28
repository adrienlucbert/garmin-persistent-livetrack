import "reflect-metadata"
import { building } from '$app/environment';
import { TypeOrm } from "$lib/orm/typeorm"

if (!building) {
	await TypeOrm.db()
}
