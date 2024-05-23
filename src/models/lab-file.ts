import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Lab from './lab';
import Submission from './submission';

@Entity({ name: 'lab_files' })
export default class LabFile extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Lab, lab => lab.files)
    lab!: Lab;

    @Column()
    filename!: string;

    @OneToMany(() => Submission, submission => submission.file)
    submissions!: Submission[];
}
