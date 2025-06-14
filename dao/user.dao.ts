import { Action } from '@prisma/client';
import { UserProfile, UserAccount } from '../interface/user';
import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import { AuditService } from '@/services/audit.svc';

export class UserDAO {
  private auditService: AuditService;

  constructor() {
    this.auditService = new AuditService();
  }

  async createUser(data: UserAccount) {
    try {
      const user = await prisma.account.create({
        data,
        include: {
          profile: true
        }
      });

      await this.auditService.logAuditEvent({
        accountId: user.id,
        action: Action.CREATE,
        entity: 'Account',
        entityId: user.id,
        details: { username: data.username, email: data.email }
      });

      this.logSuccess('User account created successfully', {
        accountId: user.id,
        username: data.username,
        email: data.email
      });

      return user;
    } catch (error) {
      this.logError('Error creating user account', error, {
        username: data.username,
        email: data.email
      });
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await prisma.account.findUnique({
        where: { id },
        include: {
          profile: true
        }
      });

      if (user) {
        this.logDebug('User retrieved by ID', {
          accountId: id,
          username: user.username
        });
      }

      return user;
    } catch (error) {
      this.logError('Error retrieving user by ID', error, { accountId: id });
      throw error;
    }
  }

  async getUserByUsername(username: string) {
    try {
      const user = await prisma.account.findUnique({
        where: { username },
        include: {
          profile: true
        }
      });

      if (user) {
        this.logDebug('User retrieved by username', {
          accountId: user.id,
          username
        });
      }

      return user;
    } catch (error) {
      this.logError('Error retrieving user by username', error, { username });
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await prisma.account.findUnique({
        where: { email },
        include: {
          profile: true
        }
      });

      if (user) {
        this.logDebug('User retrieved by email', {
          accountId: user.id,
          email
        });
      }

      return user;
    } catch (error) {
      this.logError('Error retrieving user by email', error, { email });
      throw error;
    }
  }

  async updateUser(id: string, data: UserAccount) {
    try {
      const user = await prisma.account.update({
        where: { id },
        data,
        include: {
          profile: true
        }
      });

      await this.auditService.logAuditEvent({
        accountId: id,
        action: Action.UPDATE,
        entity: 'Account',
        entityId: id,
        details: data
      });

      this.logSuccess('User account updated', {
        accountId: id,
        updates: data
      });

      return user;
    } catch (error) {
      this.logError('Error updating user account', error, { accountId: id });
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await prisma.account.delete({
        where: { id },
        include: {
          profile: true
        }
      });

      await this.auditService.logAuditEvent({
        accountId: id,
        action: Action.DELETE,
        entity: 'Account',
        entityId: id,
        details: { username: user.username, email: user.email }
      });

      this.logSuccess('User account deleted', {
        accountId: id,
        username: user.username
      });

      return user;
    } catch (error) {
      this.logError('Error deleting user account', error, { accountId: id });
      throw error;
    }
  }

  async createProfile(accountId: string, data: UserProfile) {
    try {
      const profile = await prisma.userProfile.create({
        data: {
          accountId,
          ...data
        }
      });

      await this.auditService.logAuditEvent({
        accountId,
        action: Action.CREATE,
        entity: 'UserProfile',
        entityId: profile.id,
        details: data
      });

      this.logSuccess('User profile created', {
        accountId,
        profileId: profile.id
      });

      return profile;
    } catch (error) {
      this.logError('Error creating user profile', error, { accountId });
      throw error;
    }
  }

  async updateProfile(accountId: string, data: UserProfile) {
    try {
      const profile = await prisma.userProfile.upsert({
        where: { accountId },
        update: data,
        create: {
          accountId,
          ...data as UserProfile
        }
      });

      await this.auditService.logAuditEvent({
        accountId,
        action: Action.UPDATE,
        entity: 'UserProfile',
        entityId: profile.id,
        details: data
      });

      this.logSuccess('User profile updated', {
        accountId,
        profileId: profile.id,
        updates: data
      });

      return profile;
    } catch (error) {
      this.logError('Error updating user profile', error, { accountId });
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