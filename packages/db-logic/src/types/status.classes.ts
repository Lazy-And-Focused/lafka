import { Status as StatusType } from "./mongodb.types";

class Error<T extends any = any> implements StatusType<T> {
	public readonly text: string;
	public readonly error: string;
	public readonly type: 0 = 0;
	public readonly data?: T;

	public constructor(
		error: string,
		data?: {
			text?: string;
			data?: T;
		}
	) {
		this.text = data?.text ? data.text : "Произошла ошибка на стороне сервера";

		this.data = data?.data;
		this.error = error;
	}
}

class Status<T extends any = any> implements StatusType<T> {
	public readonly error = null;

	public readonly type: 0 | 1;
	public readonly text: string;
	public readonly data?: T;

	public constructor(data: Partial<StatusType> & { type: 0 | 1 }) {
		this.type = data.type;
		this.data = data.data;

		this.text = data.text ? data.text : data.type === 1 ? "Successed" : "Fail";
	}
}

export { Error, Status };
