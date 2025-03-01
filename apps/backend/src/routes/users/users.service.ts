import { Injectable } from '@nestjs/common';

import Database from 'database/database/models.database';

import type { User } from 'types/authors/user.types';
import type { ServiceResponse } from 'types/service.types';

const { users } = Database;

@Injectable()
export class UsersService {
  public async getUser(id: string): Promise<ServiceResponse<User>> {
    try {
      const user = await users.model.findOne({ id });

      if (!user) return { successed: false, error: 'User not found' };

      return {
        successed: true,
        resource: user,
      };
    } catch (error) {
      console.error(error);

      return {
        successed: false,
        error,
      };
    }
  }
}
