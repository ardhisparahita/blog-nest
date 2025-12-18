import { Controller, Get, Inject, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';

@Controller('/api/users')
export class UserController {
  constructor(
    private userService: UserService,
    private connection: Connection,
    private mailService: MailService,
    @Inject('EmailService') private emailService: MailService,
    private userRepository: UserRepository,
    private memberService: MemberService,
  ) {}

  @Get('/hello')
  sayHello(@Query('name') name: string): string {
    return this.userService.sayHello(name);
  }

  @Get('/connection')
  getConnection(): string {
    this.mailService.send();
    this.emailService.send();
    console.log(this.memberService.getConnectionName());
    this.memberService.sendEmail();
    return this.connection.getName();
  }

  // @Get('/create')
  // async create(
  //   @Query('first_name') firstName: string,
  //   @Query('last_name') lastName: string,
  // ): Promise<User> {
  //   return this.userRepository.save(firstName, lastName);
  // }
}
