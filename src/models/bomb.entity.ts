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

    @Column({ type: 'json' })
    solutions!: string[];

    @Column({ type: 'bigint', name: 'created_at', transformer })
    createdAt!: number;

    @OneToMany(() => Defuse, defuse => defuse.bomb, { cascade: true })
    defuseTrials!: Defuse[];

    public getSolution(phase: number) {
        return this.solutions[phase - 1];
    }
}
