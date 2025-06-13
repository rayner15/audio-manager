import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';
import { AuditLogData } from '../interface/audit';

export class AuditDAO {
  /**
   * Creates an audit log entry
   * @param data The audit log data to create
   */
  async createAuditLog(data: AuditLogData) {
    try {
      const auditLog = await prisma.auditLog.create({
        data
      });
      
      logger.debug({
        msg: 'Audit log created',
        entity: data.entity,
        action: data.action,
        entityId: data.entityId,
        accountId: data.accountId
      });
      
      return auditLog;
    } catch (error) {
      logger.error({
        msg: 'Error creating audit log',
        error: error instanceof Error ? error.message : 'Unknown error',
        auditData: data
      });
      return null;
    }
  }
  
} 