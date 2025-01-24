import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm';
import Defuse from './defuse.entity';
import Lab from './lab.entity';
import User from './user.entity';
import { transformer } from './commons/timestamp-trasnformer';

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
    answerPhase1!: string;

    @Column()
    answerPhase2!: string;

    @Column()
    answerPhase3!: string;

    @Column()
    answerPhase4!: string;

    @Column()
    answerPhase5!: string;

    @Column()
    answerPhase6!: string;

    @Column({ type: 'bigint', name: 'created_at', transformer })
    createdAt!: number;

    @OneToMany(() => Defuse, defuse => defuse.bomb, { cascade: true })
    defuses!: Defuse[];
}
