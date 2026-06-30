/**
 * Shared Framer Motion utilities.
 * EASE is typed as a 4-tuple so TypeScript accepts it as a BezierDefinition
 * (Framer Motion's Easing type) rather than widening it to number[].
 */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
