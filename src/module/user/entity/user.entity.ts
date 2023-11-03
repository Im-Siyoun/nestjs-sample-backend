import {
  Entity,
  Column,
  CreateDateColumn,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryColumn({ nullable: false, unique: true, type: 'varchar' })
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  password: string;

  // 1 - 일반 사용자, 2 - 관리자, 3 - 최고관리자
  @Column({ type: 'enum', enum: ['1', '2', '3'], default: 3 })
  role: string;

  @CreateDateColumn()
  createAt: Date;

  @Column({ type: 'varchar', nullable: true })
  currentRefreshToken: string;

  @BeforeInsert()
  async HashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
