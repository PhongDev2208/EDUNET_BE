/**
 * Omits the specified properties from the target object.
 *
 * @template T - The type of the target object.
 * @template K - The type of the keys that can be used to access the properties of the target object.
 * @param {T} obj - The target object from which the properties will be omitted.
 * @param {K[]} keys - An array of keys that specify the properties to be omitted from the target object.
 * @returns {Omit<T, K>} - A new object containing all the properties of the target object except the ones specified in the `keys` parameter.
 */
export function omit<T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  const ret: Partial<T> = {};
  const keysSet = new Set(keys);

  for (const key in obj) {
    if (!keysSet.has(key as unknown as K)) {
      ret[key] = obj[key];
    }
  }

  return ret as Omit<T, K>;
}

/**
 * Creates a new object with the specified keys from the target object.
 */
export const pick = <T extends object, K extends keyof T>(whitelisted: K[] | string[], target: T, defaultValue?: any) =>
  Object.fromEntries(
    whitelisted.map((key) => [
      key,
      key in target ? target[key as K] : defaultValue,
    ]),
  );
