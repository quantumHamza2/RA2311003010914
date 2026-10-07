const { test } = require("node:test");
const assert = require("node:assert/strict");
const { getPriority, newestFirst } = require("../src/services/notificationOrdering");
test("malformed types remain low priority", () => { for (const type of [null, 42, {}, undefined]) assert.equal(getPriority(type), 3); assert.equal(getPriority(" PLACEMENT "), 1); });
test("invalid dates sort last without NaN comparators", () => {
 const rows = [{Timestamp: null}, {Timestamp: "bad"}, {Timestamp: "2026-10-06 10:00:00"}, {Timestamp: "2026-10-07T10:00:00"}];
 assert.deepEqual([...rows].sort(newestFirst).map(n => n.Timestamp), ["2026-10-07T10:00:00", "2026-10-06 10:00:00", null, "bad"]);
 assert.equal(newestFirst(rows[0], rows[1]), 0);
});
