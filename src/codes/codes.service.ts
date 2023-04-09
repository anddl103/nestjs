import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeEntity } from 'src/common/entities/code.entity';
import { TreeEntity } from 'src/common/entities/tree.entity';
import { Repository, TreeRepository } from 'typeorm';
import { CodeRegisterDTO } from './dtos/code-reg.dto';

@Injectable()
export class CodesService {
  constructor(
    @InjectRepository(CodeEntity)
    private readonly codesRepository: Repository<CodeEntity>,
    @InjectRepository(TreeEntity)
    private readonly treeRepository: TreeRepository<TreeEntity>,
  ) {}

  //   removeCode(id: any) {
  //     throw new Error('Method not implemented.');
  //   }
  //   updateCode(codeEditDTO: any, codeId: any) {
  //     throw new Error('Method not implemented.');
  //   }

  async registerCode(codeRegisterDTO: CodeRegisterDTO) {
    const code = await this.codesRepository.save({
      ...codeRegisterDTO,
    });
    return code;
  }
  //   findOneById(id: any) {
  //     throw new Error('Method not implemented.');
  //   }
  async findCodeList() {
    const tree = await this.codesRepository.find();

    return tree;
  }

  async findCodeListByRefAndParentId(
    ref: string,
    parentId: number,
  ): Promise<any> {
    //this.logger.log('start findUserList');
    const queryBuilder = await this.codesRepository.createQueryBuilder('code');

    queryBuilder
      .select(['code.id', 'code.name', 'code.description', 'code.parentId'])
      .where('code.depth > 0');
    // 코드 그룹
    if (ref) {
      queryBuilder.andWhere('code.ref = :ref', { ref });
    }
    // 부모 아이디
    if (parentId) {
      queryBuilder.andWhere('code.parentId = :parentId', { parentId });
    }

    // 기본 정렬 순서
    queryBuilder.orderBy('code.position', 'DESC');

    const codeList = queryBuilder.getMany();
    return codeList;
  }
}
