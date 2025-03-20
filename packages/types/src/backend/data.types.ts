import { Models } from "../database/models.types";

import { UpdateWriteOpResult, DeleteResult } from "mongoose";

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

  changed_resource_type: "resource"|"update"
  changed_resource?: T|UpdateWriteOpResult;
  date: Date;
    
  error?: unknown;
}

export interface DeleteData<T> {
  type: DataType;
  successed: boolean;
	
  deleted_resource_type: "resource"|"delete";
  deleted_resource?: T|DeleteResult;
  date: Date;

  error?: unknown;
}