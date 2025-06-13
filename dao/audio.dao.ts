import { Action } from '@prisma/client';
import { CreateAudioFileData, UpdateAudioFileData } from '../interface/audioFile';
import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import { AuditService } from '@/services/audit.svc';

export class AudioDAO {
  private auditService: AuditService;

  constructor() {
    this.auditService = new AuditService();
  }

  async createAudioFile(data: CreateAudioFileData) {
    try {
      const audioFile = await prisma.audioFile.create({
        data,
        include: {
          category: true,
          account: {
            include: {
              profile: true
            }
          }
        }
      });

      await this.auditService.logAuditEvent({
        accountId: data.accountId,
        action: Action.CREATE,
        entity: 'AudioFile',
        entityId: audioFile.id,
        details: { fileName: data.fileName, categoryId: data.categoryId }
      });

      logger.info({
        msg: 'Audio file created successfully',
        audioFileId: audioFile.id,
        accountId: data.accountId,
        fileName: data.fileName
      });

      return audioFile;
    } catch (error) {
      logger.error({
        msg: 'Error creating audio file',
        error: error instanceof Error ? error.message : 'Unknown error',
        accountId: data.accountId,
        fileName: data.fileName
      });
      throw error;
    }
  }

  async getAudioFilesByAccount(accountId: number) {
    try {
      const audioFiles = await prisma.audioFile.findMany({
        where: { accountId },
        include: {
          category: true
        },
        orderBy: {
          uploadedAt: 'desc'
        }
      });

      logger.info({
        msg: 'Retrieved audio files for account',
        accountId,
        count: audioFiles.length
      });

      return audioFiles;
    } catch (error) {
      logger.error({
        msg: 'Error retrieving audio files',
        error: error instanceof Error ? error.message : 'Unknown error',
        accountId
      });
      throw error;
    }
  }

  async getAudioFileById(id: number, accountId: number) {
    try {
      const audioFile = await prisma.audioFile.findFirst({
        where: {
          id,
          accountId
        },
        include: {
          category: true
        }
      });

      if (audioFile) {
        await this.auditService.logAuditEvent({
          accountId,
          action: Action.READ,
          entity: 'AudioFile',
          entityId: id,
          details: { fileName: audioFile.fileName }
        });

        logger.info({
          msg: 'Audio file retrieved',
          audioFileId: id,
          accountId,
          fileName: audioFile.fileName
        });
      }

      return audioFile;
    } catch (error) {
      logger.error({
        msg: 'Error retrieving audio file',
        error: error instanceof Error ? error.message : 'Unknown error',
        audioFileId: id,
        accountId
      });
      throw error;
    }
  }

  async updateAudioFile(id: number, accountId: number, data: UpdateAudioFileData) {
    try {
      const audioFile = await prisma.audioFile.update({
        where: {
          id,
          accountId
        },
        data,
        include: {
          category: true
        }
      });

      // Log audit trail
      await this.auditService.logAuditEvent({
        accountId,
        action: Action.UPDATE,
        entity: 'AudioFile',
        entityId: id,
        details: data
      });

      logger.info({
        msg: 'Audio file updated',
        audioFileId: id,
        accountId,
        updates: data
      });

      return audioFile;
    } catch (error) {
      logger.error({
        msg: 'Error updating audio file',
        error: error instanceof Error ? error.message : 'Unknown error',
        audioFileId: id,
        accountId
      });
      throw error;
    }
  }

  async deleteAudioFile(id: number, accountId: number) {
    try {
      const audioFile = await prisma.audioFile.delete({
        where: {
          id,
          accountId
        }
      });

      // Log audit trail
      await this.auditService.logAuditEvent({
        accountId,
        action: Action.DELETE,
        entity: 'AudioFile',
        entityId: id,
        details: { fileName: audioFile.fileName }
      });

      logger.info({
        msg: 'Audio file deleted',
        audioFileId: id,
        accountId,
        fileName: audioFile.fileName
      });

      return audioFile;
    } catch (error) {
      logger.error({
        msg: 'Error deleting audio file',
        error: error instanceof Error ? error.message : 'Unknown error',
        audioFileId: id,
        accountId
      });
      throw error;
    }
  }

  async getAllCategories() {
    try {
      const categories = await prisma.category.findMany({
        orderBy: {
          name: 'asc'
        }
      });

      logger.debug({
        msg: 'Retrieved all categories',
        count: categories.length
      });

      return categories;
    } catch (error) {
      logger.error({
        msg: 'Error retrieving categories',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
} 