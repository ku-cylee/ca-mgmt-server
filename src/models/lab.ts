import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import LabVersion from './lab-version';
import LabFile from './lab-file';

@Entity({ name: 'labs' })
@Unique(['name'])
export default class Lab extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @OneToMany(() => LabVersion, ver => ver.lab)
    versions!: LabVersion[];

    @OneToMany(() => LabFile, file => file.lab)
    files!: LabFile[];
}
