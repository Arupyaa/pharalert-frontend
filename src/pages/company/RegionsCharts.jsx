import { useEffect, useState, useCallback } from "react";
import api from "../../api/api";
import SimpleBarChart from "../../components/General/charts/SimpleBarChart.jsx";
import { useAuthStore } from "../../store/useAuthStore";

export default function RegionsCharts() {
  const [medicationId, setMedicationId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchChart = useCallback(async () => {
    setLoading(true);
    try {
      const params = { medicationId };
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const { data: res } = await api.get("/company/analytics/regions/charts", {
        params,
      });
      console.log("FULL RESPONSE:", res);
      console.log("RESPONSE DATA:", res?.data);
      setData(res?.data ?? []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [medicationId, fromDate, toDate]);

  useEffect(() => {
    if (!medicationId) return;

    fetchChart();
  }, [fetchChart, medicationId, fromDate, toDate]);

  useEffect(() => {
    const token = useAuthStore.getState().accessToken;
    let companyId = "";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      companyId = payload.id ?? "";
      console.log(`companyId is ${companyId}`);
    } catch {}

    api
      .get("/medications"
        // ,{ params: { companyId } }
      )
      .then((res) => {
        const meds = (res.data?.data ?? []).map((m) => ({
          value: m.id,
          label: m.brandName,
        }));
        setMedications(meds);

        if (meds.length > 0) {
          setMedicationId(meds[0].value);
        }
      })
      .catch(() => {});
  }, []);

  const barKeys =
    data.length > 0 ? Object.keys(data[0]).filter((k) => k !== "region") : [];

  return (
    <div className="bg-neutral-secondary min-h-screen p-4 sm:p-6">
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-heading tracking-tight">
          Regions Charts
        </h1>
        <p className="text-muted text-sm mt-0.5">
          Stock overview across regions
        </p>
      </div>

      <div className="bg-neutral-main rounded-2xl border border-border-primary shadow-sm p-4 mb-4">
        <div className="flex flex-wrap items-end gap-3">
          {medications.length > 0 && (
            <div className="flex-1 min-w-[140px] max-w-[200px]">
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted">
                Medication
              </label>
              <select
                value={medicationId}
                onChange={(e) => setMedicationId(e.target.value)}
                className="w-full appearance-none px-3 py-2 bg-neutral-main border border-border-primary text-paragraph text-sm rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all cursor-pointer"
              >
                {medications.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted">
              From
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-xl px-3 py-2 text-sm outline-none border border-border-primary bg-neutral-main text-paragraph"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-muted">
              To
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-xl px-3 py-2 text-sm outline-none border border-border-primary bg-neutral-main text-paragraph"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl p-10 flex items-center justify-center bg-neutral-main border border-border-primary">
          <div className="w-8 h-8 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-neutral-main border border-border-primary">
          <p className="text-muted text-sm">No chart data available.</p>
        </div>
      ) : (
        <SimpleBarChart
          data={data}
          xKey="region"
          bars={barKeys}
          title="Region Stock Overview"
          subtitle="Stock levels across all regions"
        />
      )}
    </div>
  );
}
