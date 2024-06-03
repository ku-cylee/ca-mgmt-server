import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import Lab from './lab';
import Submission from './submission';

@Entity({ name: 'submission_filenames' })
export default class SubmissionFilename extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Lab, lab => lab.submissionFilenames)
    lab!: Lab;

    @Column()
    filename!: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt!: Date;

    @Column({ name: 'is_deleted', default: false })
    isDeleted!: boolean;

    @OneToMany(() => Submission, submission => submission.filename)
    submissions!: Submission[];
}
