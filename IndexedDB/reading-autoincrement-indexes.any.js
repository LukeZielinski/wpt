// META: global=window,dedicatedworker,sharedworker,serviceworker
// META: script=./support-promises.js
// META: script=./reading-autoincrement-common.js

promise_test(async testCase => {
  const database = await setupDatabase(testCase);

  const transaction = database.transaction(['store'], 'readonly');
  const store = transaction.objectStore('store');
  const index = store.index('by_id');
  const request = index.getAll();
  const eventWatcher = requestWatcher(testCase, request);
  await eventWatcher.wait_for('success');

  const result = request.result;
  assert_equals(result.length, 32);
  for (let i = 1; i <= 32; ++i) {
    assert_equals(result[i - 1].id, i, 'Incorrect autoincrement key');
    assert_equals(result[i - 1].name, `Object ${i}`, 'Incorrect string property');
  }

  database.close();
}, 'IDBIndex.getAll() returns correct result for an index on the ' +
   'autoincrement key');

promise_test(async testCase => {
  const database = await setupDatabase(testCase);

  const transaction = database.transaction(['store'], 'readonly');
  const store = transaction.objectStore('store');
  const index = store.index('by_id');
  const request = index.getAllKeys();
  const eventWatcher = requestWatcher(testCase, request);
  await eventWatcher.wait_for('success');

  const result = request.result;
  assert_equals(result.length, 32);
  for (let i = 1; i <= 32; ++i)
    assert_equals(result[i - 1], i, 'Incorrect autoincrement key');

  database.close();
}, 'IDBIndex.getAllKeys() returns correct result for an index on the ' +
   'autoincrement key');

promise_test(async testCase => {
  const database = await setupDatabase(testCase);

  const transaction = database.transaction(['store'], 'readonly');
  const store = transaction.objectStore('store');
  const index = store.index('by_id');

  for (let i = 1; i <= 32; ++i) {
    const request = index.get(i);
    const eventWatcher = requestWatcher(testCase, request);
    await eventWatcher.wait_for('success');

    const result = request.result;
    assert_equals(result.id, i, 'Incorrect autoincrement key');
    assert_equals(result.name, `Object ${i}`, 'Incorrect string property');
  }

  database.close();
}, 'IDBIndex.get() returns correct result for an index on the autoincrement ' +
   'key');

promise_test(async testCase => {
  const database = await setupDatabase(testCase);

  const transaction = database.transaction(['store'], 'readonly');
  const store = transaction.objectStore('store');
  const index = store.index('by_name');
  const request = index.getAll();
  const eventWatcher = requestWatcher(testCase, request);
  await eventWatcher.wait_for('success');

  const stringSortedIds = idsSortedByStringCompare();

  const result = request.result;
  assert_equals(result.length, 32);
  for (let i = 1; i <= 32; ++i) {
    assert_equals(result[i - 1].id, stringSortedIds[i - 1],
                  'Incorrect autoincrement key');
    assert_equals(result[i - 1].name, `Object ${stringSortedIds[i - 1]}`,
                  'Incorrect string property');
  }

  database.close();
}, 'IDBIndex.getAll() returns correct result for an index not covering ' +
   'the autoincrement key');

promise_test(async testCase => {
  const database = await setupDatabase(testCase);

  const transaction = database.transaction(['store'], 'readonly');
  const store = transaction.objectStore('store');
  const index = store.index('by_name');
  const request = index.getAllKeys();
  const eventWatcher = requestWatcher(testCase, request);
  await eventWatcher.wait_for('success');

  const stringSortedIds = idsSortedByStringCompare();

  const result = request.result;
  assert_equals(result.length, 32);
  for (let i = 1; i <= 32; ++i) {
    assert_equals(result[i - 1], stringSortedIds[i - 1],
                  'Incorrect string property');
  }

  database.close();
}, 'IDBIndex.getAllKeys() returns correct result for an index not covering ' +
   'the autoincrement key');

promise_test(async testCase => {
  const database = await setupDatabase(testCase);

  const transaction = database.transaction(['store'], 'readonly');
  const store = transaction.objectStore('store');
  const index = store.index('by_name');

  for (let i = 1; i <= 32; ++i) {
    const request = index.get(`Object ${i}`);
    const eventWatcher = requestWatcher(testCase, request);
    await eventWatcher.wait_for('success');

    const result = request.result;
    assert_equals(result.id, i, 'Incorrect autoincrement key');
    assert_equals(result.name, `Object ${i}`, 'Incorrect string property');
  }

  database.close();
}, 'IDBIndex.get() returns correct result for an index not covering the ' +
   'autoincrement key');
