import { Injectable } from '@nestjs/common';
import { Connection } from '../connection/connection';

@Injectable()
export class UserRepository {
  constructor(private connection: Connection) {}

  // save();
}
