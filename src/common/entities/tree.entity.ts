import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity({
  name: 'tree',
})
@Tree('nested-set')
export class TreeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // @TreeChildren()
  // children: TreeEntity[];

  // @TreeParent()
  // parent: TreeEntity;
}
