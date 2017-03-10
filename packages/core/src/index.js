import { createHmac } from 'crypto';

/**
 * Parses a buffer and tries returning the first unsigned integer which fits the given range.
 * @param {Buffer} buf Buffer to be parsed.
 * @param {number} max Maximum value of output (excluded).
 * @param {number} size Size of parsable chunks in bytes. Must be less than or equal to 6.
 * @param {number} [startOffset=0] Where to start reading the buffer.
 * @returns {number} An unsigned integer parsed from the given buffer. If no appropriate number can
 * be parsed, `NaN` is returned.
 */
export function parseRandomUInt(buf, max, size, startOffset = 0) {
  // No appropriate number can be parsed
  if (startOffset > buf.length - size) return NaN;

  // Parse next number of the buffer and check whether it fits the given range
  const r = buf.readUIntBE(startOffset, size, true);
  return r < max ? r : parseRandomUInt(buf, max, size, startOffset + 1);
}

/**
 * Generates a random integer based on the given seeds, using the given HMAC algorithm.
 * @param {number} size Size of output in bytes. Must be less than or equal to 6.
 * @param {string} hmacAlgorithm Algorithm used for computing the HMAC of the given seed pair.
 * @param {string|Buffer} secretSeed Secret seed used as HMAC key.
 * @param {string|Buffer} [publicSeed=] Public seed used as HMAC data. To prove fairness of random
 * outputs, the hash of `secretSeed` shall be known before revealing `publicSeed`.
 * @param {number} [min=0] Minimum value of output (included).
 * @param {number} [max=256 ** size] Maximum value of output (excluded).
 * @param {function} [randomUIntParser=parseRandomUInt] Function to be used for parsing a random
 * UInt from the generated HMAC buffer.
 * @param {function} [fallbackProvider=range => Math.floor(range / 2)] Function to provide a
 * fallback value in the given range whether no appropriate number can be parsed.
 * @returns {number} An integer within the given range.
 */
export function randomInt(
  size,
  hmacAlgorithm,
  secretSeed,
  publicSeed = '',
  min = 0,
  max = 256 ** size,
  randomUIntParser = parseRandomUInt,
  fallbackProvider = range => Math.floor(range / 2),
) {
  const range = max - min;
  const maxRange = 256 ** size;

  // Validate parameters
  if (size <= 0 || size > 6) throw new RangeError('Size must be non-negative and less than or equal to 6.');
  if (range <= 0 || range > maxRange) throw new RangeError('Max - min must be non-negative and less than or equal to 256 ** size.');

  // Create HMAC buffer
  const buf = createHmac(hmacAlgorithm, secretSeed).update(publicSeed).digest();

  // Try generating a random number in the uniform distribution range
  const threshold = maxRange - (maxRange % range);
  const r = randomUIntParser(buf, threshold, size);

  // Offset generated/fallback number by the given minimum and then fit it into the given range
  return min + (Number.isNaN(r) ? fallbackProvider(range) : r % range);
}

export const randomInt8 = randomInt.bind(null, 1);
export const randomInt16 = randomInt.bind(null, 2);
export const randomInt32 = randomInt.bind(null, 4);
