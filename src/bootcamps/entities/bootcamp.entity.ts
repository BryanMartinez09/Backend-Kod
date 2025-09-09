import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Bootcamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  title: string;

  @Column({ length: 50 })
  area: string;         // p.ej. "FullStack", "Data", "QA"

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 12 })
  weeks: number;

  @Column({ default: true })
  isOpen: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
