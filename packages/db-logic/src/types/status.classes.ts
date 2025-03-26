import { Status as StatusType } from "./mongodb.types";

class Error<
  Data extends any = any,
  Error extends string = string,
> implements StatusType<
  Data, Error, true
> {
  public readonly successed = false;
  public readonly text: string;
  public readonly error: Error;
  public readonly data: Data|undefined;

  public constructor(
    error: Error,
    data?: {
      text?: string;
      data?: Data;
    }
  ) {
    this.text = data?.text ? data?.text : "Произошла ошибка на стороне сервера";

    this.data = data?.data;
    this.error = error;
  }
}

class Status<
  Data extends any = any,
  Error extends any = undefined,
  isError extends boolean = Error extends undefined ? false : true
> implements StatusType<
  Data, Error, isError
> {
  public readonly successed: isError extends true ? false : true;

  public readonly text: string;
  public readonly data: isError extends true ? Data|undefined : Data;
  public readonly error: isError extends true ? Error : undefined;
  
  public constructor(data: StatusType<Data, Error, isError> & { text?: string }) {
    this.successed = data.successed;

    this.error = data.error;
		this.data = data.data;

		this.text = data?.text
      ? data.text
      : data.successed
        ? "Successed"
        : "Fail";
  }
}

export { Error, Status };
