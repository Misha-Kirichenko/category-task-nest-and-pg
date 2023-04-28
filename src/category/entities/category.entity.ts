import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Category {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  name!: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  slug!: string;

  @ApiProperty()
  @Column({
    type: 'text',
    unique: false,
    nullable: true,
  })
  description?: string;

  @ApiProperty()
  @Column('boolean', { default: true })
  active!: boolean;

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdDate!: Date;
}
