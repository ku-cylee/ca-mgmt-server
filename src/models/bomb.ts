import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm';
import Lab from './lab';
import User from './user';
import Defuse from './defuse';

@Entity({ name: 'bombs' })
export default class Bomb extends BaseEntity {
    @PrimaryColumn()
    id!: string;

    @Column()
    longId!: string;

    @ManyToOne(() => Lab, lab => lab.bombs, { onDelete: 'CASCADE' })
    lab!: Lab;

    @ManyToOne(() => User, user => user.bombs, { onDelete: 'CASCADE' })
    author!: User;

    @Column()
    phase1Answer!: string;

    @Column()
    phase2Answer!: string;

    @Column()
    phase3Answer!: string;

    @Column()
    phase4Answer!: string;

    @Column()
    phase5Answer!: string;

    @Column()
    phase6Answer!: string;

    @Column({ type: 'bigint', name: 'created_at' })
    createdAt!: number;

    @OneToMany(() => Defuse, defuse => defuse.bomb, { cascade: true })
    defuses!: Defuse[];
}
