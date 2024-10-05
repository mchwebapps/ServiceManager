export default class ValidationError extends Error {
  private errors: { [key: string]: string[] } = {}

  public get Errors() {
    return this.errors
  }

  public AddError(key: string, value: string[]): void {
    this.errors[key] = value
  }

  constructor(validationErrors: { [key: string]: string[] }, errorMessage?: string) {
    super(errorMessage ?? '')
    Object.setPrototypeOf(this, ValidationError.prototype)
    this.errors = validationErrors
  }

}
