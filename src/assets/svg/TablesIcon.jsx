export default function TablesIcon({ color, width, height }) {
  return (
    <svg
      className={`${color} ${width} ${height} `}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 3H21V21H3V3ZM5 5V9H19V5H5ZM5 11V13H11V11H5ZM13 11V13H19V11H13ZM5 15V17H11V15H5ZM13 15V17H19V15H13Z"
        fill="currentColor"
      />
    </svg>
  );
}
