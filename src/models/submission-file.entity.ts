import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Lab from './lab.entity';
import Submission from './submission.entity';
import { transformer } from './commons/timestamp-trasnformer';

@Entity({ name: 'submission_files' })
export default class SubmissionFile extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToOne(() => Lab, lab => lab.submissionFiles, { onDelete: 'CASCADE' })
    lab!: Lab;

    @OneToMany(() => Submission, submission => submission.file, {
        cascade: true,
    })
    submissions!: Submission[];

    @Column({ type: 'bigint', name: 'created_at', transformer })
    createdAt!: number;

    @Column({ type: 'bigint', name: 'deleted_at', transformer, default: 0 })
    deletedAt!: number;

    get isDeleted() {
        return this.deletedAt !== 0;
    }
}
