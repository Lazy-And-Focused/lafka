import { Models } from "./database.types";

export type DataType = Exclude<Models, "auth">;
  
export type Response<T, K=null> = ({
  successed: true;
  data: T;
  error?: null;
} | {
  successed: false;
  data: K;
  error: string;
});