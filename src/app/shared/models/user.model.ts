export class User {
  constructor(
    public id: string,
    public username: string,
    public fullName: string,
    public blocked: boolean,
    public role?: string, // Role label for display
    public email?: string,
    public pets?: any[]
  ){}
}
