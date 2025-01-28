import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import Lab from './lab.entity';
import { transformer } from './commons/timestamp-trasnformer';

@Entity({ name: 'skeleton_files' })
@Unique(['lab', 'path', 'deletedAt'])
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

    @Column({ type: 'bigint', name: 'deleted_at', transformer, default: 0 })
    deletedAt!: number;

    get isDeleted() {
        return this.deletedAt !== 0;
    }
}
