// Missing or malformed timestamps sort after all valid dates.
function normalizeType(value) { return typeof value === "string" ? value.trim().toLowerCase() : ""; }
function getPriority(type) { return ({ placement: 1, event: 2 })[normalizeType(type)] ?? 3; }
function timestamp(value) {
  const parsed = typeof value === "string" ? Date.parse(value.replace(" ", "T")) : NaN;
  return Number.isFinite(parsed) ? parsed : -Infinity;
}
function newestFirst(a, b) {
  const x = timestamp(a.Timestamp), y = timestamp(b.Timestamp);
  return x === y ? 0 : x > y ? -1 : 1;
}
module.exports = { normalizeType, getPriority, newestFirst };
