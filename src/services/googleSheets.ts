import { google } from 'googleapis';
import { User, GoogleSheetsConfig } from '../types';
import { logger } from '../utils/logger';

export class GoogleSheetsService {
  private sheets: any;
  private config?: GoogleSheetsConfig;
  private isConfigured: boolean = false;

  constructor() {
    // Check if required environment variables are set
    if (!process.env.GOOGLE_SHEETS_SPREADSHEET_ID || 
        !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 
        !process.env.GOOGLE_PRIVATE_KEY) {
      logger.warn('Google Sheets environment variables not configured. Authentication will be disabled.');
      this.isConfigured = false;
      return;
    }

    this.config = {
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: process.env.GOOGLE_SHEETS_RANGE || 'Sheet1!A:B',
      serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    };

    this.isConfigured = true;
    this.initializeSheets();
  }

  private initializeSheets(): void {
    if (!this.config) {
      logger.error('Google Sheets configuration not available');
      return;
    }

    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: this.config.serviceAccountEmail,
          private_key: this.config.privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      logger.info('Google Sheets service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Google Sheets service', error);
      throw new Error('Google Sheets initialization failed');
    }
  }

  async getUsers(): Promise<User[]> {
    if (!this.isConfigured || !this.config || !this.sheets) {
      logger.warn('Google Sheets service not configured');
      return [];
    }

    try {
      logger.debug('Fetching users from Google Sheets');
      
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.config.spreadsheetId,
        range: this.config.range,
      });

      const rows = response.data.values;
      
      if (!rows || rows.length === 0) {
        logger.warn('No data found in Google Sheets');
        return [];
      }

      // Skip header row if it exists (assuming first row might be headers)
      const dataRows = rows.slice(1);
      
      const users: User[] = dataRows.map((row: any[]) => ({
        username: row[0]?.toString().trim() || '',
        password: row[1]?.toString().trim() || ''
      })).filter((user: User) => user.username && user.password);

      logger.info(`Retrieved ${users.length} users from Google Sheets`);
      return users;
    } catch (error) {
      logger.error('Error fetching users from Google Sheets', error);
      throw new Error('Failed to fetch users from Google Sheets');
    }
  }

  async authenticateUser(username: string, password: string): Promise<boolean> {
    try {
      const users = await this.getUsers();
      
      const user = users.find(u => 
        u.username.toLowerCase() === username.toLowerCase() && 
        u.password === password
      );

      const isAuthenticated = !!user;
      logger.info(`Authentication attempt for user '${username}': ${isAuthenticated ? 'SUCCESS' : 'FAILED'}`);
      
      return isAuthenticated;
    } catch (error) {
      logger.error('Error during user authentication', error);
      throw new Error('Authentication service unavailable');
    }
  }

  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const users = await this.getUsers();
      return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
    } catch (error) {
      logger.error('Error fetching user by username', error);
      throw new Error('Failed to fetch user data');
    }
  }
} 