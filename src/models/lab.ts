import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import SubmissionFilename from './submission-filename';
import SkeletonFile from './skeleton-file';
import LabLog from './lab-log';

@Entity({ name: 'labs' })
@Unique(['name'])
export default class Lab extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ type: 'timestamp', name: 'open_at' })
    openAt!: Date;

    @Column({ type: 'timestamp', name: 'due_date' })
    dueDate!: Date;

    @Column({ type: 'timestamp', name: 'close_at' })
    closeAt!: Date;

    @Column({ name: 'needs_submission' })
    needsSubmission!: boolean;

    @OneToMany(() => SkeletonFile, file => file.lab)
    skeletonFiles!: SkeletonFile[];

    @OneToMany(() => SubmissionFilename, file => file.lab)
    submissionFilenames!: SubmissionFilename[];

    @OneToMany(() => LabLog, log => log.lab)
    logs!: LabLog[];

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt!: Date;

    @Column({ name: 'is_deleted', default: false })
    isDeleted!: boolean;
}
