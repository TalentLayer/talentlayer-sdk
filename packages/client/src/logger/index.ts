export class Logger {
    private prefix: string;
    private isLoggingEnabled: boolean;

    constructor(prefix: string = '', isLoggingEnabled: boolean = true) {
        this.prefix = prefix;
        this.isLoggingEnabled = isLoggingEnabled;
    }

    private formatMessage(message: string): string {
        return this.prefix ? `[${this.prefix}] ${message}` : message;
    }

    private logMessage(method: 'log' | 'error' | 'warn' | 'info' | 'debug', message: string, ...args: any[]): void {
        if (this.isLoggingEnabled) {
            console[method](this.formatMessage(message));
        }
    }

    log(message: string, ...args: any[]): void {
        this.logMessage('log', message, ...args);
    }

    debug(message: string, ...args: any[]): void {
        this.logMessage('debug', message, ...args);
    }

    error(message: string, ...args: any[]): void {
        this.logMessage('error', message, ...args);
    }

    warn(message: string, ...args: any[]): void {
        this.logMessage('warn', message, ...args);
    }

    info(message: string, ...args: any[]): void {
        this.logMessage('info', message, ...args);
    }
}