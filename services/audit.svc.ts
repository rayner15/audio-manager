import { AuditDAO } from '../../dao/audit.dao';
import { AuditLogData } from '../../interface/audit';

export class AuditService {
  private auditDAO: AuditDAO;

  constructor() {
    this.auditDAO = new AuditDAO();
  }

  /**
   * Log an audit event
   * @param data The audit log data
   */
  async logAuditEvent(data: AuditLogData) {
    return this.auditDAO.createAuditLog(data);
  }
} 