import { Entity, Column, UpdateDateColumn, BaseEntity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class LiveTrackSession extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	uuid: string

	@Column({ type: 'varchar', nullable: true })
	link: string | null

	@UpdateDateColumn({ type: 'datetime' })
	updated_at: Date
}
