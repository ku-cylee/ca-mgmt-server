import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../lib/enums';
import LabVersion from './lab-version';
import Submission from './submission';
import Bomb from './bomb';

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

    @Column({ name: 'is_active', default: true })
    isActive!: boolean;

    @OneToMany(() => LabVersion, ver => ver.author)
    labVersions!: LabVersion[];

    @OneToMany(() => Submission, submission => submission.user)
    submissions!: Submission[];

    @OneToMany(() => Bomb, bomb => bomb.user)
    bombs!: Bomb[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

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
