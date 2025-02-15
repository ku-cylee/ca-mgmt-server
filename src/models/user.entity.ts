import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { UserRole } from '../lib/enums';
import Bomb from './bomb.entity';
import Lab from './lab.entity';
import Submission from './submission.entity';
import { transformer } from './commons/timestamp-trasnformer';

@Entity({ name: 'users' })
@Unique(['username'])
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @Column({ name: 'secret_key' })
    secretKey!: string;

    @Column({ type: 'enum', enum: UserRole })
    role!: UserRole;

    @Column({ type: 'bigint', name: 'created_at', transformer })
    createdAt!: number;

    @Column({ type: 'bigint', name: 'updated_at', transformer })
    updatedAt!: number;

    @Column({ type: 'bigint', name: 'deleted_at', transformer, default: 0 })
    deletedAt!: number;

    @OneToMany(() => Lab, lab => lab.author, { cascade: true })
    labs!: Lab[];

    @OneToMany(() => Submission, submission => submission.author, {
        cascade: true,
    })
    submissions!: Submission[];

    @OneToMany(() => Bomb, bomb => bomb.author, { cascade: true })
    bombs!: Bomb[];

    get isAdmin() {
        return this.role === UserRole.ADMIN;
    }

    get isTA() {
        return this.role === UserRole.TA;
    }

    get isStudent() {
        return this.role === UserRole.STUDENT;
    }

    get isDeleted() {
        return this.deletedAt !== 0;
    }

    public is(other: User): boolean {
        return this.id === other.id;
    }
}
