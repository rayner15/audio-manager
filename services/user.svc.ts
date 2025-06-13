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
   * Get user profile by ID
   */
  async getUserProfile(accountId: number): Promise<UserResponse> {
    try {
      const user = await this.userDAO.getUserById(accountId);
      
      if (!user) {
        throw new Error('User not found');
      }

      logger.info({
        msg: '/api/user/me -> fetched user profile successfully',
        accountId
      });

      return this.formatUserResponse(user);
    } catch (error) {
      logger.error({
        msg: 'Error fetching user profile',
        error: error instanceof Error ? error.message : 'Unknown error',
        accountId
      });
      throw error;
    }
  }

  /**
   * Update user credentials
   */
  async updateUserCredentials(
    accountId: number, 
    data: { username?: string; email?: string; password?: string }
  ): Promise<UserResponse> {
    const updateData = await this.prepareCredentialsUpdate(accountId, data);
    
    try {
      const user = await this.userDAO.updateUser(accountId, updateData);

      logger.info({
        msg: '/api/user/me -> updated user credentials successfully',
        accountId,
        updates: Object.keys(updateData)
      });

      return this.formatUserResponse(user);
    } catch (error) {
      logger.error({
        msg: 'Error updating user credentials',
        error: error instanceof Error ? error.message : 'Unknown error',
        accountId
      });
      throw error;
    }
  }

  /**
   * Delete user account
   */
  async deleteUserAccount(accountId: number): Promise<UserResponse> {
    try {
      const user = await this.userDAO.deleteUser(accountId);

      logger.info({
        msg: '/api/user/me -> deleted user account successfully',
        accountId,
        username: user.username
      });

      return {
        id: user.id,
        username: user.username,
        email: user.email
      };
    } catch (error) {
      logger.error({
        msg: 'Error deleting user account',
        error: error instanceof Error ? error.message : 'Unknown error',
        accountId
      });
      throw error;
    }
  }

  /**
   * Create user profile
   */
  async createUserProfile(accountId: number, data: ProfileData) {
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

  /**
   * Update user profile
   */
  async updateUserProfile(accountId: number, data: ProfileData) {
    try {
      const profile = await this.userDAO.updateProfile(accountId, {
        firstName: data.firstName || '',
        lastName: data.lastName || ''
      });

      logger.info({
        msg: '/api/user/profile/me -> updated user profile successfully',
        accountId,
        profileId: profile.id
      });

      return profile;
    } catch (error) {
      logger.error({
        msg: 'Error updating user profile',
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

  private async prepareCredentialsUpdate(
    accountId: number,
    data: { username?: string; email?: string; password?: string }
  ): Promise<UserAccount> {
    const updateData: UserAccount = {
      username: '',
      email: '',
      password_hash: ''
    };
    
    this.validateUserCredentials(data);
    if (data.username !== undefined || data.email !== undefined) {
      const checkData = {
        username: data.username,
        email: data.email
      };
      
      await this.checkExistingCredentialsForUpdate(accountId, checkData);
    }

    // Prepare update data
    if (data.username !== undefined) {
      updateData.username = data.username;
    }

    if (data.email !== undefined) {
      updateData.email = data.email;
    }

    if (data.password !== undefined) {
      updateData.password_hash = await bcrypt.hash(data.password, 12);
    }

    return updateData;
  }

  private async checkExistingCredentialsForUpdate(
    accountId: number,
    data: { username?: string; email?: string }
  ) {
    if (data.username) {
      const existingUser = await this.userDAO.getUserByUsername(data.username);
      if (existingUser && existingUser.id !== accountId) {
        throw new Error('Username already exists');
      }
    }

    if (data.email) {
      const existingUser = await this.userDAO.getUserByEmail(data.email);
      if (existingUser && existingUser.id !== accountId) {
        throw new Error('Email already exists');
      }
    }
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