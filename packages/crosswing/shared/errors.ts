export type ErrorLike = Error | string | ErrorObj;

export type ErrorObj = {
  name?: string;
  message?: string;
  /** Additional details not shown to the user by default. */
  details?: string;
  stack?: string;
  /**
   * Marks this error as fit to display to the user. Default is `true` if not
   * defined. May be used by other components, for instance, if set to false,
   * useErrorAlert() will show a generic message by default until the user
   * clicks a Details button.
   */
  userFacing?: boolean;
};

export function getErrorObj(error: ErrorLike): ErrorObj {
  return typeof error === "string" ? { message: error } : error;
}

export function getErrorMessage(error: ErrorLike): string {
  return getErrorObj(error).message ?? "";
}
