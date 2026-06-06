export default function OpenNowBadge({ isOpen }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
        isOpen
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isOpen ? "bg-green-500" : "bg-red-500"
        }`}
      />
      {isOpen ? "Open" : "Closed"}
    </span>
  );
}
