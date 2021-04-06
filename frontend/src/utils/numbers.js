/**
 * Format float on 4 digits after ,
 *
 * @param {*} n
 * @returns
 */

export const formatFloat = (n) => Math.round(n * 10000) / 10000;
