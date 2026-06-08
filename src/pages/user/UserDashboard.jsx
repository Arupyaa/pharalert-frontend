import { useMemo } from "react";
import {
  CalendarCheck,
  ShoppingBag,
  MapPin,
  Loader,
  Clock,
  CheckCircle,
  TrendingUp,
  Pill,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/api";

export default function UserDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-reservations"],
    queryFn: async () => {
      try {
        const res = await api.get("/user/reservations");
        return res.data.data || [];
      } catch (err) {
        if (err.response?.status === 403) return [];
        throw err;
      }
    },
  });

  const dashboardData = useMemo(() => {
    if (!data || data.length === 0) return null;
    const totalReservations = data.length;
    const pendingReservations = data.filter(
      (r) => r.status === "pending",
    ).length;
    const totalSpent = data.reduce(
      (sum, r) => sum + Number(r.totalPrice || 0),
      0,
    );
    const recentReservations = data.slice(0, 5);
    return {
      totalReservations,
      pendingReservations,
      totalSpent,
      recentReservations,
    };
  }, [data]);

  if (isLoading) {
    return (
      <div
        className="p-6 flex items-center justify-center"
        style={{ background: "var(--color-bg-subtle)", minHeight: "100%" }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader
            size={32}
            className="animate-spin"
            style={{ color: "var(--brand-primary)" }}
          />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-6"
        style={{ background: "var(--color-bg-subtle)", minHeight: "100%" }}
      >
        <div className="p-4 rounded-xl text-sm font-medium text-red-700 bg-red-50 border border-red-200">
          Failed to load dashboard data
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-6"
      style={{ background: "var(--color-bg-subtle)", minHeight: "100%" }}
    >
      {/* Header */}
      <div className="mb-8">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-3"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary-12), var(--color-primary-6))",
            border: "1px solid var(--color-primary-25)",
            color: "var(--brand-dark)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "var(--brand-primary)" }}
          />
          User Portal
        </div>
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--text-heading)" }}
        >
          My Dashboard
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Track your medicine orders and reservation history
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Reservations"
          value={dashboardData?.totalReservations ?? 0}
          icon={<CalendarCheck size={20} />}
          accent="var(--brand-primary)"
          bg="var(--color-primary-6)"
        />
        <StatCard
          label="Pending Deliveries"
          value={dashboardData?.pendingReservations ?? 0}
          icon={<Clock size={20} />}
          accent="#d97706"
          bg="#fefce8"
        />
        <StatCard
          label="Total Spent"
          value={`${Number(dashboardData?.totalSpent ?? 0).toFixed(2)} EGP`}
          icon={<ShoppingBag size={20} />}
          accent="var(--accent)"
          bg="var(--blue-50)"
          small
        />
      </div>

      {/* Recent Reservations */}
      {dashboardData?.recentReservations?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} style={{ color: "var(--brand-primary)" }} />
            <h2
              className="text-base font-semibold"
              style={{ color: "var(--text-heading)" }}
            >
              Recent Reservations
            </h2>
          </div>
          <div className="space-y-2">
            {dashboardData.recentReservations.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl p-4 flex items-center justify-between transition-all duration-200 hover:shadow-sm"
                style={{
                  background: "var(--bg-neutral)",
                  border: "1px solid var(--border-gray)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background:
                        r.status === "pending"
                          ? "#fef9c3"
                          : "var(--color-primary-6)",
                    }}
                  >
                    {r.status === "pending" ? (
                      <Clock size={16} style={{ color: "#ca8a04" }} />
                    ) : (
                      <CheckCircle
                        size={16}
                        style={{ color: "var(--brand-primary)" }}
                      />
                    )}
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        r.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${r.status === "pending" ? "bg-yellow-500" : "bg-green-500"}`}
                      />
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {r.items?.length} item{r.items?.length !== 1 ? "s" : ""}{" "}
                      &middot; {Number(r.totalPrice).toFixed(2)} EGP
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {new Date(r.deliveryDate).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!dashboardData?.recentReservations ||
        dashboardData.recentReservations.length === 0) && (
        <EmptyState
          icon={<Pill size={40} />}
          title="No reservations yet"
          description="Search for medicines and create your first reservation"
        />
      )}
    </div>
  );
}

function StatCard({ label, value, icon, accent, bg, small }) {
  return (
    <div
      className="rounded-2xl p-5 transition-all duration-200 hover:shadow-md"
      style={{
        background: "var(--bg-neutral)",
        border: "1px solid var(--border-gray)",
        boxShadow: "0 1px 12px var(--color-shadow-4)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: bg, color: accent }}
        >
          {icon}
        </div>
      </div>
      <p
        className={`font-bold mb-1 ${small ? "text-xl" : "text-3xl"}`}
        style={{ color: "var(--text-heading)" }}
      >
        {value}
      </p>
      <p
        className="text-xs font-medium uppercase tracking-wider"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </p>
    </div>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <div
      className="rounded-2xl p-12 flex flex-col items-center justify-center text-center"
      style={{
        background: "var(--bg-neutral)",
        border: "1px dashed var(--color-primary-25)",
      }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: "var(--color-primary-6)",
          color: "var(--text-muted)",
        }}
      >
        {icon}
      </div>
      <p className="font-semibold" style={{ color: "var(--text-heading)" }}>
        {title}
      </p>
      <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
        {description}
      </p>
    </div>
  );
}
