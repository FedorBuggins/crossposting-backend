export function panic(errorMessage: string): never {
  throw new Error(errorMessage);
}
