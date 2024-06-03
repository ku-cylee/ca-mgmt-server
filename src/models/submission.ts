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
import SubmissionFilename from './submission-filename';

@Entity({ name: 'submissions' })
export default class Submission extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.submissions)
    user!: User;

    @ManyToOne(() => SubmissionFilename, file => file.submissions)
    filename!: SubmissionFilename;

    @Column({ type: 'text' })
    content!: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt!: Date;
}
