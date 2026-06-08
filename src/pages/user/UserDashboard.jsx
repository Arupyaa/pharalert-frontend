import { useMemo } from "react";
import { CalendarCheck, ShoppingBag, MapPin, Loader, Clock, CheckCircle } from "lucide-react";
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
    const pendingReservations = data.filter((r) => r.status === "pending").length;
    const totalSpent = data.reduce((sum, r) => sum + Number(r.totalPrice || 0), 0);
    const recentReservations = data.slice(0, 5);
    return { totalReservations, pendingReservations, totalSpent, recentReservations };
  }, [data]);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center" style={{ background: "var(--color-bg-subtle)", minHeight: "100%" }}>
        <Loader size={32} className="animate-spin" style={{ color: "var(--brand-primary)" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6" style={{ background: "var(--color-bg-subtle)", minHeight: "100%" }}>
        <div className="p-4 rounded-xl text-sm font-medium text-red-700 bg-red-50 border border-red-200">
          Failed to load dashboard data
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" style={{ background: "var(--color-bg-subtle)", minHeight: "100%" }}>
      <div className="mb-8">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
          style={{
            background: "linear-gradient(135deg, var(--color-primary-12), var(--color-primary-6))",
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

        <h1 className="text-3xl font-bold" style={{ color: "var(--text-heading)" }}>
          My Dashboard
        </h1>

        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Track your medicine orders and history
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          label="Total Reservations"
          value={dashboardData?.totalReservations ?? 0}
          icon={<CalendarCheck size={24} />}
        />
        <StatCard
          label="Pending Deliveries"
          value={dashboardData?.pendingReservations ?? 0}
          icon={<Clock size={24} />}
        />
        <StatCard
          label="Total Spent"
          value={`${Number(dashboardData?.totalSpent ?? 0).toFixed(2)} EGP`}
          icon={<ShoppingBag size={24} />}
        />
      </div>

      {dashboardData?.recentReservations?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-heading)" }}>
            Recent Reservations
          </h2>
          <div className="space-y-3">
            {dashboardData.recentReservations.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl p-4 flex items-center justify-between"
                style={{
                  background: "var(--bg-neutral)",
                  border: "1px solid var(--border-gray)",
                  boxShadow: "0 1px 12px var(--color-shadow-4)",
                }}
              >
                <div className="flex items-center gap-3">
                  {r.status === "pending" ? (
                    <Clock size={18} style={{ color: "var(--text-muted)" }} />
                  ) : (
                    <CheckCircle size={18} className="text-green-600" />
                  )}
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        r.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          r.status === "pending" ? "bg-yellow-500" : "bg-green-500"
                        }`}
                      />
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                    <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                      {r.items?.length} item{r.items?.length !== 1 ? "s" : ""} &middot;{" "}
                      {Number(r.totalPrice).toFixed(2)} EGP
                    </p>
                  </div>
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {new Date(r.deliveryDate).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!dashboardData?.recentReservations || dashboardData.recentReservations.length === 0) && (
        <div
          className="mt-8 rounded-2xl p-10 flex flex-col items-center justify-center text-center"
          style={{
            background: "var(--bg-neutral)",
            border: "1px dashed var(--color-primary-25)",
          }}
        >
          <MapPin size={40} className="mb-3" style={{ color: "var(--text-muted)" }} />
          <p className="font-semibold" style={{ color: "var(--text-heading)" }}>
            No reservations yet
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Search for medicines and create your first reservation
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--bg-neutral)",
        border: "1px solid var(--border-gray)",
        boxShadow: "0 1px 12px var(--color-shadow-4)",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span style={{ color: "var(--brand-primary)" }}>{icon}</span>
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </span>
      </div>

      <p
        className="text-3xl font-bold"
        style={{ color: "var(--brand-primary)" }}
      >
        {value}
      </p>
    </div>
  );
}
