export default function useLogger(name) {
  return (...s) =>
    console.log(`%c::${name}::`, 'font-weight: bold; color: orange', ...s);
}
