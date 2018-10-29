// META: global=window,dedicatedworker,sharedworker,serviceworker
// META: script=./support-promises.js
// META: script=./reading-autoincrement-common.js

promise_test(async testCase => {
  const database = await setupDatabase(testCase);

  const transaction = database.transaction(['store'], 'readonly');
  const store = transaction.objectStore('store');
  const request = store.getAll();
  const eventWatcher = requestWatcher(testCase, request);
  await eventWatcher.wait_for('success');

  const result = request.result;
  assert_equals(result.length, 32);
  for (let i = 1; i <= 32; ++i) {
    assert_equals(result[i - 1].id, i, 'Incorrect autoincrement key');
    assert_equals(result[i - 1].name, `Object ${i}`,
                  'Incorrect string property');
  }

  database.close();
}, 'IDBObjectStore.getAll() returns correct result for an autoincrement store');

promise_test(async testCase => {
  const database = await setupDatabase(testCase);

  const transaction = database.transaction(['store'], 'readonly');
  const store = transaction.objectStore('store');
  const request = store.getAllKeys();
  const eventWatcher = requestWatcher(testCase, request);
  await eventWatcher.wait_for('success');

  const result = request.result;
  assert_equals(result.length, 32);
  for (let i = 1; i <= 32; ++i)
    assert_equals(result[i - 1], i, 'Incorrect autoincrement key');

  database.close();
}, 'IDBObjectStore.getAllKeys() returns correct result for an autoincrement ' +
   'store');

promise_test(async testCase => {
  const database = await setupDatabase(testCase);

  const transaction = database.transaction(['store'], 'readonly');
  const store = transaction.objectStore('store');

  for (let i = 1; i <= 32; ++i) {
    const request = store.get(i);
    const eventWatcher = requestWatcher(testCase, request);
    await eventWatcher.wait_for('success');

    const result = request.result;
    assert_equals(result.id, i, 'Incorrect autoincrement key');
    assert_equals(result.name, `Object ${i}`, 'Incorrect string property');
  }

  database.close();
}, 'IDBObjectStore.get() returns correct result for an autoincrement store');