export type ResponseDetails<T> = {
  data: T;
};

export type ResponseAction = {
  message: string;
  status: 'success' | 'failed';
};
