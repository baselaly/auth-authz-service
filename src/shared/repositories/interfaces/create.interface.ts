export interface ICreate<T> {
  create({ data, select }: { data: object; select?: object }): Promise<Partial<T>>;
}
