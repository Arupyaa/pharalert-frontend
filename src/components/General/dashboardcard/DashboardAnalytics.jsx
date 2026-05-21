import { useState, useEffect, useCallback } from "react";
import api from "../../../api/api";
import DbCard from "./dbcard/DbCard";
import DbCardHeader from "./dbcardheader/DbCardHeader";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EGP",
  }).format(value);
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function getDefaultDates() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return {
    from: from.toISOString().split("T")[0],
    to: to.toISOString().split("T")[0],
  };
}

export default function DashboardAnalytics() {
  const defaults = getDefaultDates();
  const [fromDate, setFromDate] = useState(defaults.from);
  const [toDate, setToDate] = useState(defaults.to);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/pharmacy/analytics/summary", {
        params: { from: fromDate, to: toDate },
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch analytics summary:", error);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const cards = [
    {
      title: "Customers",
      value: data ? formatNumber(data.customersCount) : "-",
    },
    {
      title: "Revenue",
      value: data ? formatCurrency(data.salesRevenue) : "-",
    },
    {
      title: "Critical Stock",
      value: data ? String(data.inventoryStatus.criticalStock) : "-",
    },
    {
      title: "Out of Stock",
      value: data ? String(data.inventoryStatus.outOfStock) : "-",
    },
  ];

  return (
    <div className="w-full min-w-0 pl-16 sm:pl-0">
      {/* Date filter row — stacks on xs/mobile, aligns on larger screens */}
      <div className="flex flex-col min-[480px]:flex-row justify-end items-stretch min-[480px]:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 min-w-0 w-full min-[480px]:w-auto">
          <label
            htmlFor="from-date"
            className="text-sm text-paragraph shrink-0 w-10 min-[480px]:w-auto"
          >
            From
          </label>
          <input
            id="from-date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-border-primary rounded-lg px-2 sm:px-3 py-1.5 text-sm bg-neutral-main min-w-0 flex-1 min-[480px]:flex-initial w-full min-[480px]:w-auto"
          />
        </div>
        <div className="flex items-center gap-2 min-w-0 w-full min-[480px]:w-auto">
          <label
            htmlFor="to-date"
            className="text-sm text-paragraph shrink-0 w-10 min-[480px]:w-auto"
          >
            To
          </label>
          <input
            id="to-date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-border-primary rounded-lg px-2 sm:px-3 py-1.5 text-sm bg-neutral-main min-w-0 flex-1 min-[480px]:flex-initial w-full min-[480px]:w-auto"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-paragraph py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {cards.map((card) => (
            <DbCard key={card.title}>
              <DbCardHeader propClassName="text-xs sm:text-sm font-medium text-muted">
                {card.title}
              </DbCardHeader>
              <h2 className="text-xl min-[480px]:text-2xl sm:text-3xl font-bold text-heading break-words min-w-0 mt-1">
                {card.value}
              </h2>
            </DbCard>
          ))}
        </div>
      )}
    </div>
  );
}

