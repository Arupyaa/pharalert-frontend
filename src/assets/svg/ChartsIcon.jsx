export default function ChartsIcon({ color, width, height }) {
  return (
    <svg
      className={`${color} ${width} ${height} `}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 19V9H8V19H5ZM10 19V5H13V19H10ZM15 19V13H18V19H15Z"
        fill="currentColor"
      />
    </svg>
  );
}
