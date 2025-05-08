import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { User } from './user.entity';
  
  @Entity()
  export class Institution {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column({ nullable: true })
    phone: string;
  
    @Column({ unique: true })
    cnpj: string;
  
    @OneToMany(() => User, (user) => user.institution)
    users: User[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  