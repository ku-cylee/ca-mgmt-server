import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Lab from './lab';
import User from './user';
import { LabLogAction, LabLogCategory } from '../lib/enums';

@Entity({ name: 'lab_logs' })
export default class LabLog extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Lab, lab => lab.logs)
    lab!: Lab;

    @ManyToOne(() => User, user => user.labLogs)
    author!: User;

    @Column({ type: 'enum', enum: LabLogAction })
    action!: LabLogAction;

    @Column({ type: 'enum', enum: LabLogCategory })
    category!: LabLogCategory;

    @Column({ type: 'longtext', default: '' })
    content!: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt!: Date;
}
