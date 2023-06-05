export interface IFindAll<T> {
  findAll(params: {
    select?: object;
    skip?: number;
    take?: number;
    cursor?: object;
    where?: object;
    orderBy?: object;
  }): Promise<Array<Partial<T>>>;
}
