export type ErrorLike = Error | string | ErrorObj;

export type ErrorObj = {
  name?: string;
  message?: string;
  stack?: string;
  /**
   * Marks this error as fit to display to the user. Default is `true` if not
   * defined. May be used by other components, for instance, if set to false,
   * useErrorAlert() will show a generic message by default until the user
   * clicks a Details button.
   */
  userFacing?: boolean;
};
