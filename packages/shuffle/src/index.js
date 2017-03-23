import { randomInt32 } from '@provably-fair/core';

/**
 * Shuffles an array based on the given seeds, using the given HMAC algorithm.
 * @param {[]} arr Array to be shuffled.
 * @param {string} hmacAlgorithm Algorithm used for computing the HMAC of the given seed pair.
 * @param {string|Buffer} secretSeed Secret seed used as HMAC key.
 * @param {string|Buffer} [publicSeed] Public seed used as HMAC data. To prove fairness of random
 * outputs, the hash of `secretSeed` shall be known before revealing `publicSeed`.
 * @param {function} [hmacBufferUIntParser] Function to be used for parsing a UInt from the
 * generated HMAC buffer.
 * @param {function} [fallbackProvider] Function to provide a fallback value in a given range
 * whether no appropriate number can be parsed from the generated HMAC buffer.
 * @returns {[]} A new array instance containing every element of the input.
 */
export const shuffle = (
  arr,
  hmacAlgorithm,
  secretSeed,
  publicSeed,
  hmacBufferUIntParser,
  fallbackProvider,
) => {
  const result = [...arr];

  for (let i = arr.length - 1; i > 0; i -= 1) {
    // Generate a random integer within [0, i]
    const j = randomInt32(
      hmacAlgorithm,
      secretSeed,
      `${publicSeed}-${i}`,
      0,
      i + 1,
      hmacBufferUIntParser,
      fallbackProvider,
    );

    // Exchange `result[i]` and `result[j]`
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

export default shuffle;
