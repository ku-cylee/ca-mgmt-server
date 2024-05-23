import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Lab from './lab';
import User from './user';

@Entity({ name: 'lab_versions' })
export default class LabVersion extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Lab, lab => lab.versions)
    lab!: Lab;

    @ManyToOne(() => User, user => user.labVersions)
    author!: User;

    @Column({ name: 'open_at' })
    openAt!: Date;

    @Column({ name: 'due_date' })
    dueDate!: Date;

    @Column({ name: 'close_at' })
    closeAt!: Date;

    @Column({ name: 'needs_submission' })
    needsSubmission!: boolean;

    @Column({ name: 'skeleton_path' })
    skeletonPath!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @Column({ name: 'is_active', default: true })
    isActive!: boolean;
}
