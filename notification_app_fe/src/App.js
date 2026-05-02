/**
 * App.js — Root Application Component
 * Manages:
 *  - Client-side routing (no react-router, uses simple state)
 *  - Sidebar navigation
 *  - Responsive mobile menu
 *  - NotificationContext provider
 *
 * Author: Mohammad Hamza Khan (RA2311003010914)
 */

import React, { useState, useCallback } from "react";
import { NotificationProvider } from "./context/NotificationContext";
import Sidebar from "./components/Sidebar";
import AllNotificationsPage from "./pages/AllNotificationsPage";
import PriorityNotificationsPage from "./pages/PriorityNotificationsPage";
import LatestNotificationsPage from "./pages/LatestNotificationsPage";
import FilterByTypePage from "./pages/FilterByTypePage";
import "./styles/App.css";

/**
 * Returns the breadcrumb label for the active page.
 */
function getBreadcrumb(activePage) {
  const map = {
    all: "All Notifications",
    priority: "Priority View",
    latest: "Latest (Top 5)",
    "type-placement": "Filter › Placement",
    "type-event": "Filter › Event",
    "type-result": "Filter › Result",
  };
  return map[activePage] || "Notifications";
}

/**
 * Renders the correct page component based on activePage state.
 */
function PageRouter({ activePage }) {
  if (activePage === "all") return <AllNotificationsPage />;
  if (activePage === "priority") return <PriorityNotificationsPage />;
  if (activePage === "latest") return <LatestNotificationsPage />;

  // Type filter pages: "type-placement", "type-event", "type-result"
  if (activePage.startsWith("type-")) {
    const type = activePage.replace("type-", "");
    return <FilterByTypePage type={type} />;
  }

  // Fallback
  return <AllNotificationsPage />;
}

export default function App() {
  const [activePage, setActivePage] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = useCallback((pageId) => {
    setActivePage(pageId);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const breadcrumb = getBreadcrumb(activePage);

  return (
    <NotificationProvider>
      <div className="app-shell">
        {/* Sidebar */}
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
        />

        {/* Main Content */}
        <div className="main-content">
          {/* Top Bar */}
          <header className="topbar" role="banner">
            <div className="topbar__left">
              {/* Mobile hamburger */}
              <button
                className="topbar__menu-btn"
                id="topbar-menu-btn"
                onClick={() => setSidebarOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                aria-expanded={sidebarOpen}
              >
                {sidebarOpen ? "✕" : "☰"}
              </button>

              {/* Breadcrumb */}
              <nav className="topbar__breadcrumb" aria-label="Breadcrumb">
                <span>Campus</span>
                <span aria-hidden="true">›</span>
                <span className="topbar__breadcrumb-current">{breadcrumb}</span>
              </nav>
            </div>

            <div className="topbar__right">
              <div className="topbar__badge" aria-label="Live feed active">
                <span className="topbar__live-dot" aria-hidden="true" />
                Live Feed
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="content-wrapper">
            <PageRouter activePage={activePage} />
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}
