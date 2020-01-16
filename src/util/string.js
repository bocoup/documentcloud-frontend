/**
 * Appropriately pluralizes a word based on the quantity.
 * @param {number} value The number of items
 * @param {string} str The base string name of a singular item
 * @param {boolean} allowZero If false, return an empty string on zero items
 */
export function handlePlural(value, str, allowZero = false) {
  if (!allowZero && value == 0) return "";
  return `${value} ${simplePlural(value, str)}`;
}

/**
 * Returns a word with an "s" after it if appropriate
 * @param {number} value The number of items
 * @param {string} string The base string name of a single item
 */
export function simplePlural(value, string) {
  return string + (value != 1 ? 's' : '');
}

/**
 * Pluralizes a word and puts the number before it only if non-singular,
 * e.g. for the "selected document" vs. for the "3 selected documents"
 * @param {number} value The number of items
 * @param {string} string The base string name of a single item
 */
export function nameSingularNumberPlural(value, string) {
  return `${(value == 1 ? '' : `${value} `)}${simplePlural(value, string)}`;
}

/**
 * Formats a size to a human-readable format
 * @param {number} bytes The number of bytes
 * @param {number} decimals Number of decimal places
 */
export function formatBytes(bytes, decimals = 0) {
  // from https://stackoverflow.com/a/18650828/1404888
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Strips the extension part of a filename
 * @param {string} filename The filename
 */
export function stripExtension(filename) {
  const parts = filename.split(".");
  return parts.slice(0, parts.length - 1).join(".");
}