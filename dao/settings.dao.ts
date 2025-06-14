import { Action } from '@prisma/client';
import { UserProfile } from '../interface/user';
import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import { AuditService } from '@/services/audit.svc';
import bcrypt from 'bcryptjs';

export class SettingsDAO {
  private auditService: AuditService;

  constructor() {
    this.auditService = new AuditService();
  }

  async updateUsername(userId: string, username: string) {
    try {
      // Check if username is already taken
      const existingUser = await prisma.account.findUnique({
        where: { username }
      });
      
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Username is already taken');
      }

      // Update username
      const updatedUser = await prisma.account.update({
        where: { id: userId },
        data: {
          username,
          updatedAt: new Date()
        }
      });

      await this.auditService.logAuditEvent({
        accountId: userId,
        action: Action.UPDATE,
        entity: 'Account',
        entityId: userId,
        details: { fields: ['username'] }
      });

      this.logSuccess('Username updated successfully', {
        accountId: userId,
        username
      });

      return updatedUser;
    } catch (error) {
      this.logError('Error updating username', error, { accountId: userId });
      throw error;
    }
  }

  async updatePassword(userId: string, newPasswordHash: string) {
    try {
      const updatedUser = await prisma.account.update({
        where: { id: userId },
        data: {
          password_hash: newPasswordHash,
          updatedAt: new Date()
        }
      });

      await this.auditService.logAuditEvent({
        accountId: userId,
        action: Action.UPDATE,
        entity: 'Account',
        entityId: userId,
        details: { fields: ['password'] }
      });

      this.logSuccess('Password updated successfully', {
        accountId: userId
      });

      return updatedUser;
    } catch (error) {
      this.logError('Error updating password', error, { accountId: userId });
      throw error;
    }
  }

  async updateUserProfile(userId: string, profileData: UserProfile) {
    try {
      // Check if profile exists
      const existingProfile = await prisma.userProfile.findUnique({
        where: { accountId: userId }
      });
      
      let profile;
      
      if (existingProfile) {
        // Update existing profile
        profile = await prisma.userProfile.update({
          where: { accountId: userId },
          data: {
            ...profileData,
            updatedAt: new Date()
          }
        });
      } else {
        // Create new profile
        profile = await prisma.userProfile.create({
          data: {
            accountId: userId,
            ...profileData
          }
        });
      }

      await this.auditService.logAuditEvent({
        accountId: userId,
        action: existingProfile ? Action.UPDATE : Action.CREATE,
        entity: 'UserProfile',
        entityId: profile.id,
        details: { fields: Object.keys(profileData) }
      });

      this.logSuccess('User profile updated', {
        accountId: userId,
        profileId: profile.id
      });

      return profile;
    } catch (error) {
      this.logError('Error updating user profile', error, { accountId: userId });
      throw error;
    }
  }

  async getUserProfile(userId: string) {
    try {
      const profile = await prisma.userProfile.findUnique({
        where: { accountId: userId }
      });

      this.logDebug('User profile retrieved', {
        accountId: userId,
        found: !!profile
      });

      return profile;
    } catch (error) {
      this.logError('Error retrieving user profile', error, { accountId: userId });
      throw error;
    }
  }

  async deleteUserAccount(userId: string) {
    try {
      await this.auditService.logAuditEvent({
        accountId: userId,
        action: Action.DELETE,
        entity: 'Account',
        entityId: userId,
        details: { reason: 'User requested account deletion' }
      });

      const deletedAccount = await prisma.account.delete({
        where: { id: userId }
      });

      this.logSuccess('User account deleted', {
        accountId: userId
      });

      return deletedAccount;
    } catch (error) {
      this.logError('Error deleting user account', error, { accountId: userId });
      throw error;
    }
  }

  async verifyPassword(userId: string, password: string) {
    try {
      const user = await prisma.account.findUnique({
        where: { id: userId }
      });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      
      if (!isPasswordValid) {
        return false;
      }
      
      return true;
    } catch (error) {
      this.logError('Error verifying password', error, { accountId: userId });
      throw error;
    }
  }

  private logSuccess(message: string, data: any) {
    logger.info({
      msg: message,
      ...data
    });
  }

  private logDebug(message: string, data: any) {
    logger.debug({
      msg: message,
      ...data
    });
  }

  private logError(message: string, error: unknown, data: any) {
    logger.error({
      msg: message,
      error: error instanceof Error ? error.message : 'Unknown error',
      ...data
    });
  }
} 