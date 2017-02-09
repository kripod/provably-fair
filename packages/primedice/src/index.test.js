import test from 'ava';
import { generateServerSeed, roll } from './index';

const DEFAULT_SEEDS = ['7d10b69471a00583fd88a5ac9fd7ea90', '522622526861'];

test('generateServerSeed output values', (t) => {
  const serverSeed = generateServerSeed();
  t.is(serverSeed.length, 32);
  t.falsy(serverSeed.match(/[^0-9a-f]+/));

  t.is(generateServerSeed(8).length, 16);
  t.is(generateServerSeed(32).length, 64);
});

test('roll output values', (t) => {
  t.is(roll(...DEFAULT_SEEDS, 0), 23.26);
  t.is(roll(...DEFAULT_SEEDS, 1), 39.79);
  t.is(roll(...DEFAULT_SEEDS, 2), 16.82);
  t.is(roll(...DEFAULT_SEEDS, 3), 33.44);
  t.is(roll(...DEFAULT_SEEDS, 4), 6.07);
});
