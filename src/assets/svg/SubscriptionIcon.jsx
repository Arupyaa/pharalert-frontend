export default function SubscriptionIcon({ color, width, height }) {
  return (
    <svg
      className={`${color} ${width} ${height}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 12V8C20 6.89543 19.1046 6 18 6H6C4.89543 6 4 6.89543 4 8V12M20 12V18C20 19.1046 19.1046 20 18 20H6C4.89543 6 4 6.89543 4 8V12M20 12H4M7 14H10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="2" y="9" width="20" height="3" rx="1" stroke="currentColor" strokeWidth="2" />
      <circle cx="19" cy="17" r="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M20 16L19 17L18 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
