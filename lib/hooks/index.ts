export * from './MetamaskContext';
export * from './useInvokeSnap';
export * from './useRequest';
export * from './useRequestSnap';
export * from './useMetaMask';


/**
 * Check if a snap ID is a local snap ID.
 *
 * @param snapId - The snap ID.
 * @returns True if it's a local Snap, or false otherwise.
 */
export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
