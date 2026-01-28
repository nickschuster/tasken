export const UUIDV4 = () => {
  return crypto.randomUUID();
};

export const parseDate = <T>(obj: T, key: keyof T) => {
  return obj[key] !== undefined ? { [key]: obj[key] ? new Date(obj[key] as string) : null } : {};
};
