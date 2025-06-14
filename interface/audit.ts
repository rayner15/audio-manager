import { Action } from '@prisma/client';

export interface AuditLogData {
  accountId: string;
  action: Action;
  entity: string;
  entityId: string;
  details?: any;
}
