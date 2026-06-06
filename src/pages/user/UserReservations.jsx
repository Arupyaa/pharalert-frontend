import { CalendarCheck } from "lucide-react";

export default function UserReservations() {
  return (
    <div className="p-6" style={{ background: "var(--color-bg-subtle)", minHeight: "100%" }}>
      <div className="mb-6">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--text-heading)" }}
        >
          My Reservations
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          View and manage your medicine reservations
        </p>
      </div>

      <div
        className="rounded-2xl p-12 flex flex-col items-center justify-center text-center"
        style={{
          background: "var(--bg-neutral)",
          border: "1px dashed var(--color-primary-25)",
        }}
      >
        <CalendarCheck size={40} className="mb-3" style={{ color: "var(--text-muted)" }} />
        <p className="font-semibold" style={{ color: "var(--text-heading)" }}>
          No reservations yet
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Search for medicine and reserve at a nearby pharmacy
        </p>
      </div>
    </div>
  );
}
