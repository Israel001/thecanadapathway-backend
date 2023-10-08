export const replacer = (i: number, arr: any, str: string) => {
  const len = arr.length;
  if (i < len) {
    const [key, value] = arr[i];
    const formattedKey = `{{${key}}}`;
    return replacer(i + 1, arr, str.split(formattedKey).join(value));
  } else {
    return str;
  }
};
