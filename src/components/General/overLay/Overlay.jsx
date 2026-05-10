export default function Overlay({ onClose, isVisible = true }) {
    if (!isVisible) return null;

    return (
        <div
            onClick={onClose}
            className="
                fixed inset-0 
                bg-black/50 backdrop-blur-sm 
                z-40
                transition-opacity duration-300 ease-in-out
            "
        />
    );
}