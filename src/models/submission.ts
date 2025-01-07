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

    @ManyToOne(() => Lab, lab => lab.submissions)
    lab!: Lab;

    @ManyToOne(() => User, user => user.submissions)
    author!: User;

    @Column()
    filename!: string;

    @Column({ type: 'text' })
    content!: string;

    @Column()
    checksum!: string;

    @Column({ name: 'created_at' })
    createdAt!: number;

    @Column({ name: 'updated_at' })
    updatedAt!: number;
}
