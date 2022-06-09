import { v4 as generateUuid } from 'uuid';

export function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export function uuid(num?: number): string {
  if (num === undefined) {
    return generateUuid();
  }

  const suffix = num.toString().padStart(12, '0');

  return `00000000-0000-0000-0000-${suffix}`;
}
