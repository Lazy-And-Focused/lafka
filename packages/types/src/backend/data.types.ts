import { Models } from "../database/models.types";
export type DataType = Exclude<Models, "auth_users">;

export interface GetData<T> {
  type: DataType;
  successed: boolean;
  resource?: T;
  error?: unknown;
}

export interface CreateData<T> {
  type: DataType;
  successed: boolean;
  created_resource?: T;
  date: Date;
  error?: unknown;
}

export interface ChangeData<T> {
  type: DataType;
  successed: boolean;

  resource: T;
  changed_resource?: T;
  date: Date;
    
  error?: unknown;
}

export interface DeleteData<T> {
  type: DataType;
  successed: boolean;
	
  resource: T;
  date: Date;

  error?: unknown;
}