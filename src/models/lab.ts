import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import Bomb from './bomb';
import SkeletonFile from './skeleton-file';
import Submission from './submission';
import User from './user';

@Entity({ name: 'labs' })
@Unique(['name'])
export default class Lab extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ type: 'bigint', name: 'open_at' })
    openAt!: number;

    @Column({ type: 'bigint', name: 'due_date' })
    dueDate!: number;

    @Column({ type: 'bigint', name: 'close_at' })
    closeAt!: number;

    @Column({ type: 'simple-array', name: 'submission_filenames' })
    submissionFiles!: string[];

    @ManyToOne(() => User, user => user.labs)
    author!: User;

    @Column({ type: 'bigint', name: 'created_at' })
    createdAt!: number;

    @Column({ type: 'bigint', name: 'updated_at' })
    updatedAt!: number;

    @Column({ type: 'bigint', name: 'deleted_at', default: 0 })
    deletedAt!: number;

    @OneToMany(() => SkeletonFile, file => file.lab)
    skeletonFiles!: SkeletonFile[];

    @OneToMany(() => Submission, submission => submission.lab)
    submissions!: Submission[];

    @OneToMany(() => Bomb, bomb => bomb.lab)
    bombs!: Bomb[];

    public isDeleted() {
        return this.deletedAt !== 0;
    }
}
