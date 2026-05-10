import React, { useState } from "react";
import TabsLinks from "../components/General/tabslink/Tabslink";
import Badge from "../components/General/badge/Badge";
export default function Regions() {
  const [showBadge, setShowBadge] = useState(true);

  return (
    <>
      <h2 className="text-xl font-bold">Regions Page</h2>

      <TabsLinks />

      <div className="mt-4">
        {showBadge && (
          <Badge label="panadol" onRemove={() => setShowBadge(false)} />
        )}
      </div>
    </>
  );
}
