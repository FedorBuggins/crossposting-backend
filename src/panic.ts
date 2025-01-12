export function panic(err: string): never {
  throw new Error(err);
}
