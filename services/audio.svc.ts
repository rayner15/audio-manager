import { AudioDAO } from '@/dao/audio.dao';
import { CreateAudioFileData, UpdateAudioFileData } from '@/interface/audioFile';
import { logger } from '@/lib/logger-edge';
import fs from 'fs/promises';
import path from 'path';

export class AudioService {
  private audioDAO: AudioDAO;

  constructor() {
    this.audioDAO = new AudioDAO();
  }

  async uploadAudioFile(data: CreateAudioFileData) {
    // Validate file size (25MB limit)
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '26214400'); // 25MB
    if (data.sizeBytes > maxSize) {
      throw new Error(`File size exceeds maximum limit of ${maxSize} bytes`);
    }

    // Validate MIME type
    const allowedMimeTypes = [
      'audio/mpeg',
      'audio/wav',
      'audio/x-wav',
      'audio/mp4',
      'audio/m4a',
      'audio/x-m4a'
    ];

    if (!allowedMimeTypes.includes(data.mimeType)) {
      throw new Error(`Unsupported file type: ${data.mimeType}`);
    }

    // Validate file extension
    const allowedExtensions = ['.mp3', '.wav', '.m4a'];
    const fileExtension = path.extname(data.fileName).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error(`Unsupported file extension: ${fileExtension}`);
    }

    try {
      console.log("datadata",data);
      const audioFile = await this.audioDAO.createAudioFile(data);
      
      logger.info({
        msg: '/api/audio/upload -> audio file uploaded successfully',
        audioFileId: audioFile.id,
        accountId: data.accountId,
        fileName: data.fileName,
        sizeBytes: data.sizeBytes
      });

      return audioFile;
    } catch (error) {
      // Clean up uploaded file if database operation fails
      try {
        await fs.unlink(data.filePath);
        logger.info({
          msg: 'Cleaned up uploaded file after database error',
          filePath: data.filePath
        });
      } catch (unlinkError) {
        logger.warn({
          msg: 'Failed to clean up uploaded file',
          filePath: data.filePath,
          error: unlinkError instanceof Error ? unlinkError.message : 'Unknown error'
        });
      }
      
      throw error;
    }
  }

  async getUserAudioFiles(accountId: string) {
    try {
      const audioFiles = await this.audioDAO.getAudioFilesByAccount(accountId);
      
      logger.info({
        msg: '/api/audio -> fetched user audio files successfully',
        accountId,
        count: audioFiles.length
      });

      return audioFiles;
    } catch (error) {
      logger.error({
        msg: 'Error fetching user audio files',
        error: error instanceof Error ? error.message : 'Unknown error',
        accountId
      });
      throw error;
    }
  }

  async getAudioFile(id: string, accountId: string) {
    try {
      const audioFile = await this.audioDAO.getAudioFileById(id, accountId);
      
      if (!audioFile) {
        throw new Error('Audio file not found or access denied');
      }

      // Verify file still exists on disk
      try {
        await fs.access(audioFile.filePath);
      } catch {
        logger.error({
          msg: 'Audio file missing from disk',
          audioFileId: id,
          filePath: audioFile.filePath
        });
        throw new Error('Audio file not found on disk');
      }

      logger.info({
        msg: '/api/audio/[fileId] -> fetched audio file successfully',
        audioFileId: id,
        accountId,
        fileName: audioFile.fileName
      });

      return audioFile;
    } catch (error) {
      logger.error({
        msg: 'Error fetching audio file',
        error: error instanceof Error ? error.message : 'Unknown error',
        audioFileId: id,
        accountId
      });
      throw error;
    }
  }

  async updateAudioFile(id: string, accountId: string, data: UpdateAudioFileData) {
    try {
      const audioFile = await this.audioDAO.updateAudioFile(id, accountId, data);
      
      logger.info({
        msg: '/api/audio/[fileId] -> updated audio file successfully',
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

  async deleteAudioFile(id: string, accountId: string) {
    try {
      const audioFile = await this.audioDAO.getAudioFileById(id, accountId);
      
      if (!audioFile) {
        throw new Error('Audio file not found or access denied');
      }

      // Delete from database first
      await this.audioDAO.deleteAudioFile(id, accountId);

      // Then delete from disk
      try {
        await fs.unlink(audioFile.filePath);
        logger.info({
          msg: 'Deleted audio file from disk',
          filePath: audioFile.filePath
        });
      } catch (fileError) {
        logger.warn({
          msg: 'Failed to delete audio file from disk',
          filePath: audioFile.filePath,
          error: fileError instanceof Error ? fileError.message : 'Unknown error'
        });
      }

      logger.info({
        msg: '/api/audio/[fileId] -> deleted audio file successfully',
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

  async getCategories() {
    try {
      const categories = await this.audioDAO.getAllCategories();
      
      logger.info({
        msg: '/api/categories -> fetched categories successfully',
        count: categories.length
      });

      return categories;
    } catch (error) {
      logger.error({
        msg: 'Error fetching categories',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async ensureUploadDirectory() {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
      logger.info({
        msg: 'Created upload directory',
        uploadDir
      });
    }
    
    return uploadDir;
  }

  generateUniqueFileName(originalName: string, accountId: string): string {
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');
    
    return `${accountId}_${sanitizedBaseName}${extension}`;
  }
} 