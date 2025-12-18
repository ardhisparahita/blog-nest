import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { Role } from './enum/role.enum';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async Register(registerDto: RegisterDto): Promise<{ message: string }> {
    const hashPassword = await bcrypt.hash(registerDto.password, 12);

    const userEmail = await this.userRepository.findOneBy({
      email: registerDto.email,
    });
    const userName = await this.userRepository.findOneBy({
      name: registerDto.name,
    });

    if (userEmail) {
      throw new ConflictException('Email is already exist!');
    }

    if (userName) {
      throw new ConflictException('Name is already exist!');
    }

    const userData = await this.userRepository.find();
    const roleUser: Role = userData.length === 0 ? Role.ADMIN : Role.USER;

    const newUser = this.userRepository.create({
      ...registerDto,
      password: hashPassword,
      role: roleUser,
    });

    await this.userRepository.save(newUser);

    return {
      message: 'create user success',
    };
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }

    if (!(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('invalid credentials');
    }

    const payload = { id: user.id, email: user.email, role: user.role };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async getUser(id: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return null;
    }
    return user;
  }
}
