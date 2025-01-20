import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Lab from './lab';
import User from './user';

@Entity({ name: 'submissions' })
export default class Submission extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Lab, lab => lab.submissions, { onDelete: 'CASCADE' })
    lab!: Lab;

    @ManyToOne(() => User, user => user.submissions, { onDelete: 'CASCADE' })
    author!: User;

    @Column()
    filename!: string;

    @Column({ type: 'text' })
    content!: string;

    @Column()
    checksum!: string;

    @Column({ type: 'bigint', name: 'created_at' })
    createdAt!: number;

    @Column({ type: 'bigint', name: 'updated_at' })
    updatedAt!: number;
}
