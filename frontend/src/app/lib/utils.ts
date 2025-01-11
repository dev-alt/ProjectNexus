// src/app/lib/utils.ts 
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conditionally applies class names using clsx and merges them with Tailwind CSS classes using twMerge.
 *
 * @param {...ClassValue} inputs - Class values to be merged.
 * @returns {string} - The merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}