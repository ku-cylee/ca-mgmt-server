import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { UserRole } from './common/enums';
import LabVersion from './lab-version';
import Submission from './submission';
import Bomb from './bomb';

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
}
