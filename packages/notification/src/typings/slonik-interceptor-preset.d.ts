declare module 'slonik-interceptor-preset' {
  import { Interceptor } from 'slonik';

  export function createInterceptors(): Interceptor[];
}
