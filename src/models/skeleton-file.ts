import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Lab from './lab';

@Entity({ name: 'skeleton_files' })
export default class SkeletonFile extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Lab, lab => lab.skeletonFiles)
    lab!: Lab;

    @Column()
    path!: string;

    @Column({ type: 'text' })
    content!: string;

    @Column({ name: 'is_executable' })
    isExecutable!: boolean;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt!: Date;
}
