export interface ServiceResponse<T> {
    resource?: T;
    successed: boolean;
    error?: unknown;
};