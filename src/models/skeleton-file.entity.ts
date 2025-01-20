import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Lab from './lab.entity';
import { transformer } from './commons/timestamp-trasnformer';

@Entity({ name: 'skeleton_files' })
export default class SkeletonFile extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Lab, lab => lab.skeletonFiles, { onDelete: 'CASCADE' })
    lab!: Lab;

    @Column()
    path!: string;

    @Column({ type: 'text' })
    content!: string;

    @Column()
    checksum!: string;

    @Column({ name: 'is_executable' })
    isExecutable!: boolean;

    @Column({ type: 'bigint', name: 'created_at', transformer })
    createdAt!: number;
}
