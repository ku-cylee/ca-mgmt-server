import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { UserRole } from '../lib/enums';
import Bomb from './bomb';
import Lab from './lab';
import Submission from './submission';

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

    @Column({ name: 'created_at' })
    createdAt!: number;

    @Column({ name: 'updated_at' })
    updatedAt!: number;

    @Column({ name: 'deleted_at', default: null, nullable: true })
    deletedAt!: number;

    @OneToMany(() => Lab, lab => lab.author)
    labs!: Lab[];

    @OneToMany(() => Submission, submission => submission.author)
    submissions!: Submission[];

    @OneToMany(() => Bomb, bomb => bomb.author)
    bombs!: Bomb[];

    public isAdmin() {
        return this.role === UserRole.ADMIN;
    }

    public isTA() {
        return this.role === UserRole.TA;
    }

    public isStudent() {
        return this.role === UserRole.STUDENT;
    }
}
