/**
 * fetch-error
 * Error type for fetch operations
 */

export interface FetchError {
  message: string;
  status?: number;
  statusText?: string;
}
