/**
 * Shared Sub-Components:
 * - LoadingSkeleton
 * - ErrorBanner
 * - EmptyState
 * - Pagination
 */

import React from "react";
import "../styles/Page.css";

/* ─── Loading Skeleton ──────────────────────────────────── */
export function LoadingSkeleton({ count = 5 }) {
  return (
    <div className="skeleton-list" aria-busy="true" aria-label="Loading notifications">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card" aria-hidden="true">
          <div className="skeleton-line skeleton-line--short" />
          <div className="skeleton-line skeleton-line--long" />
          <div className="skeleton-line skeleton-line--medium" />
        </div>
      ))}
    </div>
  );
}

/* ─── Error Banner ──────────────────────────────────────── */
export function ErrorBanner({ message, onRetry }) {
  return (
    <div className="error-banner" role="alert">
      <span className="error-banner__icon">⚠️</span>
      <div>
        <div className="error-banner__title">Failed to load notifications</div>
        <div>{message}</div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="refetch-btn"
            style={{ marginTop: "12px" }}
            id="retry-btn"
          >
            🔄 Try Again
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Empty State ───────────────────────────────────────── */
export function EmptyState({ icon = "🔕", title = "No notifications", message }) {
  return (
    <div className="empty-state" aria-live="polite">
      <span className="empty-state__icon" aria-hidden="true">{icon}</span>
      <h2 className="empty-state__title">{title}</h2>
      {message && <p className="empty-state__message">{message}</p>}
    </div>
  );
}

/* ─── Pagination ────────────────────────────────────────── */
export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="pagination" aria-label="Notification pages">
      {/* Prev */}
      <button
        id="pagination-prev"
        className="pagination__btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ←
      </button>

      {/* First page shortcut */}
      {start > 1 && (
        <>
          <button className="pagination__btn" onClick={() => onPageChange(1)}>1</button>
          {start > 2 && <span className="pagination__info">…</span>}
        </>
      )}

      {/* Page buttons */}
      {pages.map((p) => (
        <button
          key={p}
          id={`pagination-page-${p}`}
          className={`pagination__btn ${p === currentPage ? "active" : ""}`}
          onClick={() => onPageChange(p)}
          aria-label={`Page ${p}`}
          aria-current={p === currentPage ? "page" : undefined}
        >
          {p}
        </button>
      ))}

      {/* Last page shortcut */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="pagination__info">…</span>}
          <button className="pagination__btn" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        id="pagination-next"
        className="pagination__btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        →
      </button>

      <span className="pagination__info">
        Page {currentPage} of {totalPages}
      </span>
    </nav>
  );
}
