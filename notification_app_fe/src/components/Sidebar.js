/**
 * Sidebar Component
 * Navigation sidebar with page links and type filters.
 */

import React from "react";
import "../styles/Sidebar.css";

const TYPE_COLORS = {
  placement: "#f59e0b",
  event: "#10b981",
  result: "#3b82f6",
};

const NAV_ITEMS = [
  { id: "all", label: "All Notifications", icon: "🔔" },
  { id: "priority", label: "Priority View", icon: "⚡" },
  { id: "latest", label: "Latest (Top 5)", icon: "🕐" },
];

const TYPE_FILTERS = [
  { id: "placement", label: "Placement" },
  { id: "event", label: "Event" },
  { id: "result", label: "Result" },
];

export default function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
  const handleNavClick = (pageId) => {
    onNavigate(pageId);
    onClose(); // close on mobile after navigation
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="sidebar__overlay"
          onClick={onClose}
          role="button"
          aria-label="Close sidebar"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onClose()}
        />
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`} aria-label="Main navigation">
        {/* Brand */}
        <div className="sidebar__brand">
          <div className="sidebar__logo" aria-hidden="true">🏫</div>
          <div>
            <div className="sidebar__title">CampusNotify</div>
            <div className="sidebar__subtitle">SRM Institute</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav" aria-label="Pages">
          <div className="sidebar__section-label">Pages</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className={`sidebar__nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => handleNavClick(item.id)}
              aria-current={activePage === item.id ? "page" : undefined}
            >
              <span className="sidebar__nav-icon" aria-hidden="true">{item.icon}</span>
              {item.label}
              {activePage === item.id && (
                <span className="sidebar__nav-dot" aria-hidden="true" />
              )}
            </button>
          ))}

          {/* Type filters */}
          <div className="sidebar__section-label sidebar__filter-section">
            Filter by Type
          </div>
          {TYPE_FILTERS.map((t) => (
            <button
              key={t.id}
              id={`filter-${t.id}`}
              className={`sidebar__type-btn ${activePage === `type-${t.id}` ? "active" : ""}`}
              onClick={() => handleNavClick(`type-${t.id}`)}
              aria-current={activePage === `type-${t.id}` ? "page" : undefined}
            >
              <span
                className="sidebar__type-dot"
                style={{ background: TYPE_COLORS[t.id] }}
                aria-hidden="true"
              />
              {t.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <footer className="sidebar__footer">
          <div className="sidebar__footer-name">Mohammad Hamza Khan</div>
          <div>RA2311003010914</div>
          <div>mk8690@srmist.edu.in</div>
        </footer>
      </aside>
    </>
  );
}
