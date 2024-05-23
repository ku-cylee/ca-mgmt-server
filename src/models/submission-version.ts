import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Submission from './submission';

@Entity({ name: 'submission_versions' })
export default class SubmissionVersion extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Submission, submission => submission.versions)
    submission!: Submission;

    @Column('text')
    content!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}
