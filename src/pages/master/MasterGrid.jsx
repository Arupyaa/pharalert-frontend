import { Outlet } from "react-router-dom";

export default function MasterGrid() {
  return (
    <div className="bg-[var(--bg-neutral)] text-[var(--text-heading)]">
      <Outlet />
    </div>
  );
}
