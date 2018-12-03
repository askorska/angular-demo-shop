export class User {
  id: number;
  login: string;
  role: Role;
  constructor(id: number, login: string, role: Role) {
    this.id = id;
    this.login = login;
    this.role = role;
  }
}

export enum Role {
  Admin = 0,
  CommonUser = 1
}
