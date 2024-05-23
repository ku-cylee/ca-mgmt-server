import { BaseEntity, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import User from './user';
import LabFile from './lab-file';
import SubmissionVersion from './submission-version';

@Entity({ name: 'submissions' })
export default class Submission extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.submissions)
    user!: User;

    @ManyToOne(() => LabFile, file => file.submissions)
    file!: LabFile;

    @OneToMany(() => SubmissionVersion, ver => ver.submission)
    versions!: SubmissionVersion[];
}
