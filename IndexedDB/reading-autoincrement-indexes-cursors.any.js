// META: global=window,dedicatedworker,sharedworker,serviceworker
// META: script=./support-promises.js
// META: script=./reading-autoincrement-common.js

promise_test(async testCase => {
  const database = await setupDatabase(testCase);

  const transaction = database.transaction(['store'], 'readonly');
  const store = transaction.objectStore('store');
  const index = store.index('by_id');

  const result = await getAllViaCursor(testCase, index);
  assert_equals(result.length, 32);
  for (let i = 1; i <= 32; ++i) {
    assert_equals(result[i - 1].key, i, 'Incorrect (autoincrement) index key');
    assert_equals(result[i - 1].primaryKey, i,
                  'Incorrect (autoincrement) primary key');
    assert_equals(result[i - 1].value.id, i,
                  'Incorrect autoincrement key in value');
    assert_equals(result[i - 1].value.name, `Object ${i}`,
                  'Incorrect string property in value');
  }

  database.close();
}, 'IDBIndex.openCursor() returns a cursor that correctly iterates over an ' +
   'index on the autoincrement key');

promise_test(async testCase => {
  const database = await setupDatabase(testCase);

  const transaction = database.transaction(['store'], 'readonly');
  const store = transaction.objectStore('store');
  const index = store.index('by_id');

  const result = await getAllKeysViaCursor(testCase, index);
  assert_equals(result.length, 32);
  for (let i = 1; i <= 32; ++i) {
    assert_equals(result[i - 1].key, i, 'Incorrect (autoincrement) index key');
    assert_equals(result[i - 1].primaryKey, i,
                  'Incorrect (autoincrement) primary key');
  }

  database.close();
}, 'IDBIndex.openKeyCursor() returns a cursor that correctly iterates over ' +
   'an index on the autoincrement key');

promise_test(async testCase => {
  const database = await setupDatabase(testCase);

  const transaction = database.transaction(['store'], 'readonly');
  const store = transaction.objectStore('store');
  const index = store.index('by_name');

  const stringSortedIds = idsSortedByStringCompare();

  const result = await getAllViaCursor(testCase, index);
  assert_equals(result.length, 32);
  for (let i = 1; i <= 32; ++i) {
    assert_equals(result[i - 1].key, `Object ${stringSortedIds[i - 1]}`,
                  'Incorrect index key');
    assert_equals(result[i - 1].primaryKey, stringSortedIds[i - 1],
                  'Incorrect (autoincrement) primary key');
    assert_equals(result[i - 1].value.id, stringSortedIds[i - 1],
                  'Incorrect autoincrement key in value');
    assert_equals(result[i - 1].value.name, `Object ${stringSortedIds[i - 1]}`,
                  'Incorrect string property in value');
  }

  database.close();
}, 'IDBIndex.openCursor() returns a cursor that correctly iterates over an ' +
   'index not covering the autoincrement key');

promise_test(async testCase => {
  const database = await setupDatabase(testCase);

  const transaction = database.transaction(['store'], 'readonly');
  const store = transaction.objectStore('store');
  const index = store.index('by_name');

  const stringSortedIds = idsSortedByStringCompare();

  const result = await getAllKeysViaCursor(testCase, index);
  assert_equals(result.length, 32);
  for (let i = 1; i <= 32; ++i) {
    assert_equals(result[i - 1].key, `Object ${stringSortedIds[i - 1]}`,
                  'Incorrect index key');
    assert_equals(result[i - 1].primaryKey, stringSortedIds[i - 1],
                  'Incorrect (autoincrement) primary key');
  }

  database.close();
}, 'IDBIndex.openKeyCursor() returns a cursor that correctly iterates over ' +
   'an index not covering the autoincrement key');