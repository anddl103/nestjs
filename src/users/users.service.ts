import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, getRepository, Repository } from 'typeorm';
import { IPaginationMeta, paginate, Pagination } from 'nestjs-typeorm-paginate';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../common/entities/users.entity';
import { UserAddressSearchDTO } from './dtos/user-address-search.dto';
import { UserRegisterResponseDTO } from './dtos/user-reg.res.dto';
import { UserRegisterDTO } from './dtos/user-reg.dto';
import { UserDTO } from './dtos/user.dto';
import { UserEditDTO } from './dtos/user-edit.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(
    userRegisterDTO: UserRegisterDTO,
  ): Promise<UserRegisterResponseDTO> {
    const { username, password } = userRegisterDTO;
    //this.logger.debug('register user');
    const isUserExist = await this.usersRepository.findOne({ username });
    if (isUserExist) {
      throw new UnauthorizedException('해당 이메일은 이미 존재합니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.save({
      ...userRegisterDTO,
      password: hashedPassword,
    });

    const userRes = new UserRegisterResponseDTO();
    userRes.id = user.id;
    userRes.username = user.username;
    userRes.createdAt = user.createdAt;

    return userRes;
  }

  async findUserList(
    userAddressSearchDTO: UserAddressSearchDTO,
  ): Promise<Pagination<any, IPaginationMeta>> {
    //this.logger.log('start findUserList');
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    queryBuilder.select([
      'user.id',
      'user.username',
      'user.fullName',
      'user.level',
      'user.rank',
      'user.createdAt',
      'userAddress.id',
      'userAddress.area',
      'userAddress.type',
      'userAddress.address1',
      'userAddress.address2',
    ]);
    queryBuilder.leftJoin('user.userAddresses', 'userAddress');
    const { keyword } = userAddressSearchDTO;
    // 검색 조건
    if (keyword) {
      queryBuilder.andWhere('user.username like :username', {
        username: '%' + keyword + '%',
      });
      queryBuilder.orWhere('user.fullName like :fullName', {
        fullName: '%' + keyword + '%',
      });
    }
    // 최신 생성일순
    queryBuilder.orderBy('user.createdAt', 'DESC');
    // 일반회원 리스트
    const userList = paginate<any>(
      queryBuilder,
      userAddressSearchDTO.getIPaginationOptions(),
    );

    return userList;
  }

  async findUserDetailById(userId: number): Promise<any> {
    const user: UserDTO = await this.usersRepository.findOne({ id: userId });
    if (!user) throw new NotFoundException('등록되지 않은 사용자입니다.');
    //this.logger.log('start findUserById');
    const userDetail = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.fullName',
        'user.phoneNumber',
        'user.level',
        'user.rank',
        'user.memo',
        'user.createdAt',
        'userAddress.id',
        'userAddress.area',
        'userAddress.type',
        'userAddress.address1',
        'userAddress.address2',
      ])
      .leftJoin('user.userAddresses', 'userAddress')
      .where('user.id = :uid', {
        uid: userId,
      })
      .getOne();
    return userDetail;
  }

  async updateUserById(
    userEditDTO: UserEditDTO,
    userId: number,
  ): Promise<void> {
    const user: UserDTO = await this.usersRepository.findOne({ id: userId });
    if (!user) throw new NotFoundException('등록되지 않은 사용자입니다.');
    const { memo, level, rank } = userEditDTO;

    try {
      await getConnection()
        .createQueryBuilder()
        .update(UserEntity)
        .set({ memo, level, rank })
        .where('user.id = :uid', {
          uid: userId,
        })
        .execute();
    } catch (error) {
      throw new BadRequestException('updateUserById');
    }
  }
}
