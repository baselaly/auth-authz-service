export interface Ifind<T> {
  find({ where, select }: { where: object; select: object }): Promise<Partial<T>>;
}
