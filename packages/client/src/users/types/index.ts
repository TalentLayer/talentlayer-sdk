export interface IUser {
  getOne(userId: string): Promise<any>;

  getUsers(params: {
    numberPerPage?: number;
    offset?: number;
    searchQuery?: string;
  }): Promise<any>;

  getTotalGains(userId: string): Promise<any>;

  getPayments(userId: string, numberPerPage?: number, offset?: number, startDate?: string, endDate?: string): Promise<any>
}
