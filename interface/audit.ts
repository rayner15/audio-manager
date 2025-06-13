import { Action } from '@prisma/client';

export interface AuditLogData {
  accountId: number;
  action: Action;
  entity: string;
  entityId: number;
  details?: any;
}
