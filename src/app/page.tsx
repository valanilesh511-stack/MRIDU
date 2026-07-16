"use client";
import { useState, useCallback, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import LibraryModule from "@/components/LibraryModule";
import WriterModule from "@/components/WriterModule";
import ReaderModule from "@/components/ReaderModule";
import SearchModule from "@/components/SearchModule";
import BookmarksModule from "@/components/BookmarksModule";
import TimelineModule from "@/components/TimelineModule";
import CollectionsModule from "@/components/CollectionsModule";
import ImportExportModule from "@/components/ImportExportModule";
import SettingsModule from "@/components/SettingsModule";
import Toast, { type ToastMessage } from "@/components/Toast";
import { generateId } from "@/lib/utils";

type Module =
  | "library"
  | "writer"
  | "reader"
  | "search"
  | "bookmarks"
  | "timeline"
  | "collections"
  | "import"
  | "export"
  | "settings";

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>("library");
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [theme, setTheme] = useState("light");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const addToast = useCallback(
    (message: string, type: ToastMessage["type"] = "info") => {
      const id = generateId();
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const openWriter = useCallback((bookId: string) => {
    setActiveBookId(bookId);
    setActiveModule("writer");
  }, []);

  const openReader = useCallback((bookId: string) => {
    setActiveBookId(bookId);
    setActiveModule("reader");
  }, []);

  const handleModuleChange = useCallback((m: Module) => {
    setActiveModule(m);
    if (m !== "writer" && m !== "reader") {
      // Keep bookId for writer/reader
    }
  }, []);

  const renderModule = () => {
    switch (activeModule) {
      case "library":
        return (
          <LibraryModule
            onOpenWriter={openWriter}
            onOpenReader={openReader}
            addToast={addToast}
          />
        );
      case "writer":
        return (
          <WriterModule
            bookId={activeBookId}
            addToast={addToast}
            onClose={() => setActiveModule("library")}
          />
        );
      case "reader":
        return (
          <ReaderModule
            bookId={activeBookId}
            addToast={addToast}
            onClose={() => setActiveModule("library")}
          />
        );
      case "search":
        return (
          <SearchModule
            onOpenWriter={openWriter}
            onOpenReader={openReader}
            addToast={addToast}
          />
        );
      case "bookmarks":
        return (
          <BookmarksModule addToast={addToast} onOpenReader={openReader} />
        );
      case "timeline":
        return <TimelineModule addToast={addToast} />;
      case "collections":
        return <CollectionsModule addToast={addToast} />;
      case "import":
        return <ImportExportModule mode="import" addToast={addToast} />;
      case "export":
        return <ImportExportModule mode="export" addToast={addToast} />;
      case "settings":
        return (
          <SettingsModule
            theme={theme}
            onThemeChange={setTheme}
            addToast={addToast}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      {/* Mobile header */}
      <div
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "52px",
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border)",
          zIndex: 50,
          alignItems: "center",
          padding: "0 16px",
          gap: "12px",
        }}
        className="mobile-header"
      >
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.3rem",
            cursor: "pointer",
            color: "var(--text-primary)",
          }}
        >
          ☰
        </button>
        <div style={{ fontWeight: 800, color: "var(--accent)", fontSize: "1rem" }}>
          📚 MRIDU
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        activeModule={activeModule}
        onModuleChange={handleModuleChange}
        theme={theme}
        onThemeChange={setTheme}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <main
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {renderModule()}
      </main>

      {/* Toast notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
