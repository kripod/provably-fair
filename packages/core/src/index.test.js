import test from 'ava';
import { randomInt, randomInt8, randomInt16, randomInt32 } from './index';

const DEFAULT_HMAC_ALGORITHM = 'sha512';
const DEFAULT_SEEDS = ['0123456789abcdef0123456789abcdef', '0123456789abcdef-0'];

test('randomInt parameter validation', (t) => {
  t.throws(() => randomInt(0, DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS), RangeError);
  t.throws(() => randomInt(7, DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS), RangeError);
  t.notThrows(() => randomInt(1, DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS));
  t.notThrows(() => randomInt(6, DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS));

  t.throws(() => randomInt(1, DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS, 0, 1000));
  t.notThrows(() => randomInt(2, DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS, 0, 1000));
});

test('randomInt output values', (t) => {
  // Least amount of parameters
  t.is(randomInt(1, DEFAULT_HMAC_ALGORITHM, DEFAULT_SEEDS[0]), 0xd1);
  t.is(randomInt(6, DEFAULT_HMAC_ALGORITHM, DEFAULT_SEEDS[0]), 0xd1db79e3c7d9);

  // Non-range-bound output
  t.is(randomInt(1, DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS), 0x8b);
  t.is(randomInt(2, DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS), 0x8b09);
  t.is(randomInt(3, DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS), 0x8b09d6);
  t.is(randomInt(4, DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS), 0x8b09d63f);
  t.is(randomInt(5, DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS), 0x8b09d63f8c);
  t.is(randomInt(6, DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS), 0x8b09d63f8c86);

  // Range-bound output
  t.is(randomInt(1, DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS, 0, 1), 0);
  t.is(randomInt(2, DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS, 0, 1), 0);
  t.is(randomInt(5, DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS, 1, 1000), 314);
  t.is(randomInt(6, DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS, 1, 1000), 343);

  // TODO: Range-bound output with custom parser
});

test('randomInt function aliases', (t) => {
  t.is(
    randomInt8(DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS),
    randomInt(1, DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS),
  );

  t.is(
    randomInt16(DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS),
    randomInt(2, DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS),
  );

  t.is(
    randomInt32(DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS),
    randomInt(4, DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS),
  );
});
