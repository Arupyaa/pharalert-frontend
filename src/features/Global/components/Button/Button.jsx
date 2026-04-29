export default function Button({
  btnName,
  bgColor = "bg-accent",
  textColor = "text-white",
}) {
  return (
    <button
      className={`cursor-pointer ${bgColor} ${textColor} my-6 px-6 py-3 rounded-[8px] text-base md:text-lg  md:h-[60px] md:w-[211.7px] transition hover:opacity-90`}
    >
      {btnName}
    </button>
  );
}
