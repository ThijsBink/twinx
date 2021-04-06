/**
 * Simple helper logger function to make the console output more eye catching
 *
 * @param {*} name
 * @returns
 */
export default function useLogger(name) {
  return (...s) =>
    console.log(`%c::${name}::`, 'font-weight: bold; color: orange', ...s);
}
