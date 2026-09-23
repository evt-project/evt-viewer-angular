import { FROM_ATTRIBUTE, TO_ATTRIBUTE } from "../models/constants"

// Can't figure how to add prototype methods to HTMLElement 
// so they are just helper functions for now.

/**
 * 
 * @param element the element that might contains the attribute
 * @returns the {@link FROM_ATTRIBUTE} value or default
 */
export function getFromAttributeOrDefault(element: HTMLElement): string | null {
    return element.getAttribute(FROM_ATTRIBUTE);
}

/**
 * 
 * @param element the element that might contains the attribute
 * @returns the {@link TO_ATTRIBUTE} value or default
 */
export function getToAttributeOrDefault(element: HTMLElement): string | null {
    return element.getAttribute(TO_ATTRIBUTE);
}