import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../lib/enums';
import Submission from './submission';
import Bomb from './bomb';
import LabLog from './lab-log';

@Entity({ name: 'users' })
@Unique(['username'])
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    username!: string;

    @Column({ name: 'secret_key' })
    secretKey!: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.NONE })
    role!: UserRole;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt!: Date;

    @Column({ name: 'is_active', default: true })
    isActive!: boolean;

    @OneToMany(() => Submission, submission => submission.user)
    submissions!: Submission[];

    @OneToMany(() => Bomb, bomb => bomb.user)
    bombs!: Bomb[];

    @OneToMany(() => LabLog, log => log.author)
    labLogs!: LabLog[];

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
