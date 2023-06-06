export interface IDelete<T> {
  delete(where: object): Promise<T>;
}
