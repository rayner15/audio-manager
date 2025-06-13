// Simplified logger for Edge Runtime (middleware)
// Edge Runtime doesn't support Node.js file system operations

interface LogData {
  msg: string;
  [key: string]: unknown;
}

class EdgeLogger {
  info(data: LogData) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[INFO] ${data.msg}`, data);
    }
  }

  warn(data: LogData) {
    console.warn(`[WARN] ${data.msg}`, data);
  }

  error(data: LogData) {
    console.error(`[ERROR] ${data.msg}`, data);
  }

  debug(data: LogData) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${data.msg}`, data);
    }
  }
}

export const logger = new EdgeLogger(); 