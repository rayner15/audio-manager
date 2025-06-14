import { UserDAO } from '@/dao/user.dao';
import { RegisterUserInput, UserResponse, UserAccount } from '@/interface/user';
import { logger } from '@/lib/logger-edge';
import { UserProfile } from '@prisma/client';
import bcrypt from 'bcryptjs';

type ProfileData = {
  firstName?: string | null;
  lastName?: string | null;
};


export class UserService {
  private userDAO: UserDAO;

  constructor() {
    this.userDAO = new UserDAO();
  }

  async registerUser(data: RegisterUserInput): Promise<UserResponse> {
    this.validateUserCredentials(data);
    await this.checkExistingCredentials(data);
    
    try {
      const user = await this.createUserAccount(data);
      
      if (data.firstName || data.lastName) {
        await this.createUserProfile(user.id, {
          firstName: data.firstName,
          lastName: data.lastName
        } as UserProfile);
      }

      const userWithProfile = await this.userDAO.getUserById(user.id);
      
      logger.info({
        msg: '/api/register -> user registered successfully',
        accountId: user.id,
        username: data.username,
        email: data.email
      });

      return this.formatUserResponse(userWithProfile);
    } catch (error) {
      logger.error({
        msg: 'Error registering user',
        error: error instanceof Error ? error.message : 'Unknown error',
        username: data.username,
        email: data.email
      });
      throw error;
    }
  }





  /**
   * Create user profile
   */
  async createUserProfile(accountId: string, data: ProfileData) {
    try {
      const profile = await this.userDAO.createProfile(accountId, {
        firstName: data.firstName || '',
        lastName: data.lastName || ''
      });

      logger.info({
        msg: '/api/user/profile -> created user profile successfully',
        accountId,
        profileId: profile.id
      });

      return profile;
    } catch (error) {
      logger.error({
        msg: 'Error creating user profile',
        error: error instanceof Error ? error.message : 'Unknown error',
        accountId
      });
      throw error;
    }
  }


  // Helper methods
  private validateUserCredentials(data: { username?: string; email?: string; password?: string }) {
    if (data.username !== undefined && (data.username.length < 3)) {
      throw new Error('Username must be at least 3 characters long');
    }

    if (data.email !== undefined && !this.isValidEmail(data.email)) {
      throw new Error('Valid email address is required');
    }

    if (data.password !== undefined && data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
  }

  private async checkExistingCredentials(data: { username?: string; email?: string }) {
    if (data.username) {
      const existingUserByUsername = await this.userDAO.getUserByUsername(data.username);
      if (existingUserByUsername) {
        throw new Error('Username already exists');
      }
    }

    if (data.email) {
      const existingUserByEmail = await this.userDAO.getUserByEmail(data.email);
      if (existingUserByEmail) {
        throw new Error('Email already exists');
      }
    }
  }

  private async createUserAccount(data: { username: string; email: string; password: string }): Promise<any> {
    const password_hash = await bcrypt.hash(data.password, 12);

    const userData: UserAccount = {
      username: data.username,
      email: data.email,
      password_hash
    };

    return this.userDAO.createUser(userData);
  }



  private formatUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      profile: user.profile
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
} 