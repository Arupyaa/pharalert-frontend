import { useState, useEffect, useCallback } from "react";
import { Plus, Loader, MapPin, Tag } from "lucide-react";
import api from "../../api/api";

function AddModal({ open, onClose, title, label, fieldName, onSubmit }) {
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setValue("");
      setError(null);
    }
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ [fieldName]: value.trim() });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl"
        style={{ background: "var(--bg-neutral)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-1" style={{ color: "var(--text-heading)" }}>
          {title}
        </h2>
        <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>

        {error && (
          <div
            className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
            style={{
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.22)",
              color: "#dc2626",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={label}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-5"
            style={{
              background: "var(--color-bg-subtle)",
              color: "var(--text-heading)",
              border: "1px solid var(--border-gray)",
            }}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "var(--color-bg-subtle)",
                color: "var(--text-muted)",
                border: "1px solid var(--border-gray)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !value.trim()}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
              }}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader size={16} className="animate-spin" />
                  Saving…
                </span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionCard({ icon: Icon, title, items, loading, emptyMessage, renderItem, onAdd, addLabel }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--bg-neutral)",
        border: "1px solid var(--border-gray)",
        boxShadow: "0 1px 12px var(--color-shadow-4)",
      }}
    >
      <div
        className="px-5 py-4 border-b flex items-center justify-between"
        style={{ borderColor: "var(--border-gray)" }}
      >
        <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text-heading)" }}>
          <Icon size={18} style={{ color: "var(--brand-primary)" }} />
          {title}
        </h2>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, var(--brand-primary), var(--brand-linear))",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "var(--shadow-button-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "var(--shadow-button)";
          }}
        >
          <Plus size={14} />
          {addLabel}
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-12">
          <Loader size={24} className="animate-spin" style={{ color: "var(--brand-primary)" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading…</p>
        </div>
      ) : items.length === 0 ? (
        <div className="py-12 flex flex-col items-center gap-2">
          <Icon size={28} style={{ color: "var(--border-gray)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: "var(--border-gray)" }}>
          {items.map(renderItem)}
        </div>
      )}
    </div>
  );
}

export default function AdminLocationsCategories() {
  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [regionsLoading, setRegionsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const addToast = useCallback((type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchRegions = useCallback(async () => {
    setRegionsLoading(true);
    try {
      const { data } = await api.get("/regions");
      setRegions(data?.data ?? []);
    } catch {
      addToast("error", "Error", "Failed to load regions");
    } finally {
      setRegionsLoading(false);
    }
  }, [addToast]);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const { data } = await api.get("/categories");
      setCategories(data?.data ?? []);
    } catch {
      addToast("error", "Error", "Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchRegions();
    fetchCategories();
  }, []);

  async function handleAddRegion(body) {
    await api.post("/regions", body);
    addToast("success", "Created", "Region added successfully");
    await fetchRegions();
  }

  async function handleAddCategory(body) {
    await api.post("/categories", body);
    addToast("success", "Created", "Category added successfully");
    await fetchCategories();
  }

  return (
    <div className="p-6" style={{ background: "var(--color-bg-subtle)", minHeight: "100%" }}>
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[300] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-start gap-3 px-4 py-3.5 rounded-xl text-sm font-medium shadow-lg animate-in"
            style={{
              background:
                t.type === "success"
                  ? "rgba(0,171,121,0.12)"
                  : "rgba(239,68,68,0.08)",
              border:
                t.type === "success"
                  ? "1px solid rgba(0,171,121,0.3)"
                  : "1px solid rgba(239,68,68,0.22)",
              color:
                t.type === "success"
                  ? "var(--brand-primary)"
                  : "#dc2626",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="flex-1">
              <strong>{t.title}</strong> — {t.message}
            </span>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 opacity-60 hover:opacity-100"
              style={{ color: t.type === "success" ? "var(--brand-primary)" : "#dc2626" }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-heading)" }}>
          Regions & Categories
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Manage regions and medication categories
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regions */}
        <SectionCard
          icon={MapPin}
          title="Regions"
          items={regions}
          loading={regionsLoading}
          emptyMessage="No regions yet"
          addLabel="Add Region"
          onAdd={() => setRegionModalOpen(true)}
          renderItem={(r) => (
            <div key={r.id} className="flex items-center gap-4 px-5 py-4">
              <div
                className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                style={{ background: "rgba(0,171,121,0.08)" }}
              >
                <MapPin size={18} style={{ color: "var(--brand-primary)" }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-heading)" }}>
                {r.name}
              </p>
            </div>
          )}
        />

        {/* Categories */}
        <SectionCard
          icon={Tag}
          title="Categories"
          items={categories}
          loading={categoriesLoading}
          emptyMessage="No categories yet"
          addLabel="Add Category"
          onAdd={() => setCategoryModalOpen(true)}
          renderItem={(c) => (
            <div key={c.id} className="flex items-center gap-4 px-5 py-4">
              <div
                className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                style={{ background: "rgba(0,171,121,0.08)" }}
              >
                <Tag size={18} style={{ color: "var(--brand-primary)" }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-heading)" }}>
                {c.categoryName}
              </p>
            </div>
          )}
        />
      </div>

      <AddModal
        open={regionModalOpen}
        onClose={() => setRegionModalOpen(false)}
        title="Add Region"
        label="Region name"
        fieldName="name"
        onSubmit={handleAddRegion}
      />

      <AddModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title="Add Category"
        label="Category name"
        fieldName="categoryName"
        onSubmit={handleAddCategory}
      />
    </div>
  );
}
