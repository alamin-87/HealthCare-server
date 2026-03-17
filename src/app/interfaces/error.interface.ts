export interface TErrorSources {
  path: string | undefined;
  message: string;
}

export interface TErrorResponse {
  statusCode?: number;
  success: boolean;
  message: string;
  errorSources: TErrorSources[];
  stack?: string | undefined;
  error?: unknown | undefined;
}
