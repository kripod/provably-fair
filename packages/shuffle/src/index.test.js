import test from 'ava';
import { shuffle } from './index';

const DEFAULT_HMAC_ALGORITHM = 'sha512';
const DEFAULT_SEEDS = ['0123456789abcdef0123456789abcdef', '0123456789abcdef'];

test('shuffle', (t) => {
  t.deepEqual(
    shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS),
    [8, 6, 7, 4, 5, 9, 2, 1, 3],
  );

  t.deepEqual(
    shuffle(['lorem', 'ipsum', 'dolor', 'sit', 'amet'], DEFAULT_HMAC_ALGORITHM, ...DEFAULT_SEEDS),
    ['lorem', 'dolor', 'ipsum', 'sit', 'amet'],
  );
});
