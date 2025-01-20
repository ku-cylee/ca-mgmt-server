import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import Bomb from './bomb.entity';
import SkeletonFile from './skeleton-file.entity';
import Submission from './submission.entity';
import User from './user.entity';
import { transformer } from './commons/timestamp-trasnformer';

@Entity({ name: 'labs' })
@Unique(['name'])
export default class Lab extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ type: 'bigint', name: 'open_at', transformer })
    openAt!: number;

    @Column({ type: 'bigint', name: 'due_date', transformer })
    dueDate!: number;

    @Column({ type: 'bigint', name: 'close_at', transformer })
    closeAt!: number;

    @Column({ type: 'simple-array', name: 'submission_filenames' })
    submissionFiles!: string[];

    @ManyToOne(() => User, user => user.labs, { onDelete: 'CASCADE' })
    author!: User;

    @Column({ type: 'bigint', name: 'created_at', transformer })
    createdAt!: number;

    @Column({ type: 'bigint', name: 'updated_at', transformer })
    updatedAt!: number;

    @Column({ type: 'bigint', name: 'deleted_at', transformer, default: 0 })
    deletedAt!: number;

    @OneToMany(() => SkeletonFile, file => file.lab, {
        cascade: true,
    })
    skeletonFiles!: SkeletonFile[];

    @OneToMany(() => Submission, submission => submission.lab, {
        cascade: true,
    })
    submissions!: Submission[];

    @OneToMany(() => Bomb, bomb => bomb.lab, { cascade: true })
    bombs!: Bomb[];

    get isOpen() {
        return Date.now() >= this.openAt;
    }

    get isClosed() {
        return Date.now() >= this.closeAt;
    }

    get isDeleted() {
        return this.deletedAt !== 0;
    }
}
