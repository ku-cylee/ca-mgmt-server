import {
    BaseEntity,
    Column,
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

    @Column()
    checksum!: string;

    @Column({ name: 'is_executable' })
    isExecutable!: boolean;

    @Column({ name: 'created_at' })
    createdAt!: number;
}
