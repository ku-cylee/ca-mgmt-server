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
import SubmissionFiles from './submission-files.entity';
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

    @OneToMany(() => SubmissionFiles, sf => sf.lab, {
        cascade: true,
    })
    submissionFiles!: SubmissionFiles[];

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
