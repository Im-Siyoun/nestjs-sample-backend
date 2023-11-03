import {
  Entity,
  Column,
  CreateDateColumn,
  BeforeInsert,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  detail: string;

  @Column({ type: 'varchar' })
  ImgUrl: string;

  @CreateDateColumn()
  createAt: Date;

  @Column({ type: 'numeric' })
  price: number;
}
