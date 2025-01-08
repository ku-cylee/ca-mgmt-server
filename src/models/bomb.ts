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

    @ManyToOne(() => Lab, lab => lab.bombs)
    lab!: Lab;

    @ManyToOne(() => User, user => user.bombs)
    author!: User;

    @Column()
    phase1_answer!: string;

    @Column()
    phase2_answer!: string;

    @Column()
    phase3_answer!: string;

    @Column()
    phase4_answer!: string;

    @Column()
    phase5_answer!: string;

    @Column()
    phase6_answer!: string;

    @Column({ type: 'bigint', name: 'created_at' })
    createdAt!: number;

    @OneToMany(() => Defuse, defuse => defuse.bomb)
    defuses!: Defuse[];
}
