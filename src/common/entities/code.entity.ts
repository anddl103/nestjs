import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity({
  name: 'code',
})
// @Tree('nested-set')
export class CodeEntity {
  @ApiProperty({
    example: 1,
    description: '내부 아이디',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 12,
    description: '가게 아이디',
  })
  @Column({ type: 'int', nullable: false })
  parentId: number;

  @ApiProperty({
    example: 'target',
    description: '적용대상그룹',
  })
  @Column({ type: 'varchar', nullable: false })
  ref: string;

  @ApiProperty({
    example: 0,
    description: '(0 : 코드 종류, 1 대분류 : 2 중분류 3: 소분류 ...)',
  })
  @Column({ type: 'int', nullable: true })
  depth: number;

  @ApiProperty({
    example: 'target',
    description: '적용대상',
  })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({
    example: '적용대상',
    description: '적용대상',
  })
  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ApiProperty({
    example: 1,
    description: '순서',
  })
  @Column({ type: 'int', nullable: true })
  position: number;

  @ApiProperty({
    example: false,
    description: '비활성 여부',
  })
  @Column({ type: 'boolean', default: false })
  isDisabled: boolean;
}
