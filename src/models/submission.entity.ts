import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import SubmissionFile from './submission-files.entity';
import User from './user.entity';
import { transformer } from './commons/timestamp-trasnformer';

@Entity({ name: 'submissions' })
export default class Submission extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.submissions, { onDelete: 'CASCADE' })
    author!: User;

    @ManyToOne(() => SubmissionFile, sf => sf.submissions, {
        onDelete: 'CASCADE',
    })
    file!: SubmissionFile;

    @Column({ type: 'text' })
    content!: string;

    @Column()
    checksum!: string;

    @Column({ type: 'bigint', name: 'created_at', transformer })
    createdAt!: number;
}
