import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };


// Merge two objects while summing their numeric values.
export function mergeSum<T extends Record<string, any>>(a: T, b: T): T {
	return Object.fromEntries(Object.keys({ ...a, ...b }).map(k => {
		// only sum numbers
		if (typeof a[k] === 'number' && typeof b[k] === 'number') {
			return [k, a[k] + b[k]]
		}
		// b[k] takes precedence, a[k] is used if b[k] is undefined
		return [k, b[k] ?? a[k]]
	})) as T
}
