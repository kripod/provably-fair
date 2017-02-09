import { randomInt } from '@provably-fair/core';
import { randomBytes } from 'crypto';

/**
 * Generates a random server seed.
 * @param {number} [size=16] Size of random buffer in bytes.
 * @returns {string} A server seed of the given size.
 */
export function generateServerSeed(size = 16) {
  return randomBytes(size).toString('hex');
}

/**
 * Parses a buffer and tries returning the first unsigned integer which fits the given range.
 * @param {Buffer} buf Buffer to be parsed.
 * @param {number} max Maximum value of output (excluded).
 * @param {number} size Size of parsable chunks in bytes. Must be less than or equal to 6.
 * @param {number} [startOffset=0] Where to start reading the buffer.
 * @returns {number} An integer number parsed from the given buffer. If no appropriate number can be
 * parsed, `NaN` is returned.
 */
export function parseRandomUInt(buf, max, size, startOffset = 0) {
  // No appropriate number can be parsed
  if (startOffset > buf.length - size) return NaN;

  // Parse next number of the buffer and check whether it fits the given range
  let r = buf.readUIntBE(startOffset, size, true);

  const isStartOffsetMultipleOf5 = startOffset % 5 === 0;
  if (isStartOffsetMultipleOf5) {
    r = Math.floor(r / 0x10);
  } else {
    r %= 0x100000;
  }

  return r * 0x10 < max ?
    r :
    parseRandomUInt(buf, max, size, startOffset + (isStartOffsetMultipleOf5 ? 2 : 3));
}

/**
 * Generates a random roll number based on the given seeds.
 * @param {string} serverSeed Server seed used as HMAC key.
 * @param {string} clientSeed Client seed used as HMAC data. To prove fairness of random outputs,
 * the hash of `serverSeed` shall be known before revealing `clientSeed`.
 * @param {number} nonce Number of bets made with the given seed pair (excluding current roll).
 * @returns {number} A number within the range [0.00, 99.99].
 */
export function roll(serverSeed, clientSeed, nonce) {
  const r = randomInt(
    3,
    'sha512',
    serverSeed,
    `${clientSeed}-${nonce}`,
    0,
    10 ** 6,
    parseRandomUInt,
    () => (10 ** 6) - 1,
  );

  // Return only the last 4 decimal digits scaled from 0.00 to 99.99
  return (r % (10 ** 4)) / (10 ** 2);
}
