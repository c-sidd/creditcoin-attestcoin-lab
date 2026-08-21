export class Logger {
  private level: "INFO" | "WARN" | "ERROR" | "DEBUG";

  constructor(level = "INFO") {
    const l = level.toUpperCase();
    if (l === "WARN" || l === "ERROR" || l === "DEBUG" || l === "INFO") {
      this.level = l;
    } else {
      this.level = "INFO";
    }
  }

  private shouldLog(msgLevel: "INFO" | "WARN" | "ERROR" | "DEBUG"): boolean {
    const levels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
    return levels[msgLevel] >= levels[this.level];
  }

  private log(level: "INFO" | "WARN" | "ERROR" | "DEBUG", message: string, context?: any): void {
    if (this.shouldLog(level)) {
      const output = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...(context ? { context } : {}),
      };
      console.log(JSON.stringify(output));
    }
  }

  info(message: string, context?: any): void {
    this.log("INFO", message, context);
  }

  warn(message: string, context?: any): void {
    this.log("WARN", message, context);
  }

  error(message: string, context?: any): void {
    this.log("ERROR", message, context);
  }

  debug(message: string, context?: any): void {
    this.log("DEBUG", message, context);
  }
}

export const logger = new Logger(process.env.LOG_LEVEL || "INFO");
