import { SettingsDAO } from '@/dao/settings.dao';
import { UserProfile } from '@/interface/user';
import { logger } from '@/lib/logger-edge';
import bcrypt from 'bcryptjs';

export class SettingsService {
  private settingsDAO: SettingsDAO;

  constructor() {
    this.settingsDAO = new SettingsDAO();
  }

  async updateUsername(userId: string, username: string, password: string) {
    try {
      // Verify password first
      const isPasswordValid = await this.settingsDAO.verifyPassword(userId, password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      const updatedUser = await this.settingsDAO.updateUsername(userId, username);
      
      logger.info({
        msg: '/api/user/username -> username updated successfully',
        accountId: userId,
        username
      });

      return updatedUser;
    } catch (error) {
      logger.error({
        msg: 'Error updating username',
        error: error instanceof Error ? error.message : 'Unknown error',
        accountId: userId
      });
      throw error;
    }
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
      // Validate password requirements
      if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long');
      }
      
      // Verify current password
      const isPasswordValid = await this.settingsDAO.verifyPassword(userId, currentPassword);
      
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }
      
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      const updatedUser = await this.settingsDAO.updatePassword(userId, hashedPassword);
      
      logger.info({
        msg: '/api/user/password -> password updated successfully',
        accountId: userId
      });

      return updatedUser;
    } catch (error) {
      logger.error({
        msg: 'Error updating password',
        error: error instanceof Error ? error.message : 'Unknown error',
        accountId: userId
      });
      throw error;
    }
  }

  async getUserProfile(userId: string) {
    try {
      const profile = await this.settingsDAO.getUserProfile(userId);
      
      logger.info({
        msg: '/api/user/profile -> user profile retrieved',
        accountId: userId,
        found: !!profile
      });

      // Return default empty values if no profile exists
      if (!profile) {
        return {
          firstName: '',
          lastName: ''
        };
      }

      return {
        firstName: profile.firstName || '',
        lastName: profile.lastName || ''
      };
    } catch (error) {
      logger.error({
        msg: 'Error retrieving user profile',
        error: error instanceof Error ? error.message : 'Unknown error',
        accountId: userId
      });
      throw error;
    }
  }

  async updateUserProfile(userId: string, profileData: UserProfile) {
    try {
      const profile = await this.settingsDAO.updateUserProfile(userId, profileData);
      
      logger.info({
        msg: '/api/user/profile -> user profile updated',
        accountId: userId,
        fields: Object.keys(profileData)
      });

      return profile;
    } catch (error) {
      logger.error({
        msg: 'Error updating user profile',
        error: error instanceof Error ? error.message : 'Unknown error',
        accountId: userId
      });
      throw error;
    }
  }

  async deleteUserAccount(userId: string, password: string) {
    try {
      // Verify password first
      const isPasswordValid = await this.settingsDAO.verifyPassword(userId, password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      const deletedAccount = await this.settingsDAO.deleteUserAccount(userId);
      
      logger.info({
        msg: '/api/user/account -> account deleted successfully',
        accountId: userId
      });

      return deletedAccount;
    } catch (error) {
      logger.error({
        msg: 'Error deleting user account',
        error: error instanceof Error ? error.message : 'Unknown error',
        accountId: userId
      });
      throw error;
    }
  }
}
