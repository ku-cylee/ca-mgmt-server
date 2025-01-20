import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import Bomb from './bomb.entity';
import { transformer } from './commons/timestamp-trasnformer';

@Entity({ name: 'defuses' })
export default class Defuse extends BaseEntity {
    @PrimaryColumn()
    id!: number;

    @ManyToOne(() => Bomb, bomb => bomb.defuses, { onDelete: 'CASCADE' })
    bomb!: Bomb;

    @Column()
    phase!: number;

    @Column()
    answer!: string;

    @Column()
    exploded!: boolean;

    @Column({ type: 'bigint', name: 'created_at', transformer })
    createdAt!: number;
}
