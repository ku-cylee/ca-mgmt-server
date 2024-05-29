import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import User from './user';

@Entity({ name: 'bombs' })
export default class Bomb extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'bomb_id' })
    bombId!: string;

    @ManyToOne(() => User, user => user.bombs)
    user!: User;

    @Column()
    phase!: number;

    @Column()
    explosions!: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
