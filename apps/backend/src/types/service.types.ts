export type ServiceResponse<T> = {
  resource: T;
  successed: true;
  error: null;
} | {
  successed: false,
  resource: null,
  error: unknown
};
