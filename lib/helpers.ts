import { Metadata } from 'next';
import { siteName } from 'config';

export const truncate = (str: string, length: number) => {
  if (str?.length > length) {
    return str.substring(0, length) + '...';
  }
  return str || '';
};

//https://decipher.dev/30-seconds-of-typescript/docs/debounce/
export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export const randomId = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

type Params = {
  [key: string]: string | number | boolean;
};

export const get = async (url: string, params: Params) => {
  const cleanParams = Object.keys(params).reduce((accumulator: any, key) => {
    if (params[key]) accumulator[key] = params[key];
    return accumulator;
  }, {});

  const queryParams = new URLSearchParams(cleanParams).toString();

  const res = await fetch(`${url}?${queryParams}`, {
    method: 'GET',
  });

  let json: any = {};

  try {
    json = await res.json();
  } catch (error) {}
  if (!res.ok) {
    if (res.status === 404) throw new Error('Route not found');
    if (res.status === 405) throw new Error('Method not allowed');
    if (res.status === 504) throw new Error('Operation timed out. Please try again.');
    throw new Error(json.message || 'An error ocurred');
  }
  return json;
};

export const convertFileSize = (size?: number) => {
  if (!size) return '';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

export const getMetadata = (metadata?: Metadata): Metadata => {
  return {
    ...metadata,
    title: metadata?.title ? `${metadata.title} - ${siteName}` : siteName,
  };
};
