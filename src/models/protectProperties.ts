/* eslint-disable @typescript-eslint/no-explicit-any */
export default class cleanProperties {
  hide_properties = ['password', 'active'];
  cleanProperties<T>(U: T | T[]): T {
    if (U === null || U === undefined) return U;
    const isArray = Array.isArray(U);
    if (!isArray) U = [U as T];
    const result = (U as T[]).map((v: T) => {
      const property = <any>{};
      Object.keys(v as object).forEach(c => {
        if (!this.hide_properties.includes(c)) property[c] = (v as any)[c];
      });
      return property;
    });
    if (!isArray) return result[0] as T;
    return result as T;
  }
}
