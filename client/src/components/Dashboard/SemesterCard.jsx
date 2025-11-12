function SemesterCard({ semester, isActive, onClick, onDelete }) {
  return (
    <button
      onClick={onClick}
      className={`font-bold py-3 px-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all relative ${
        isActive ? 'bg-black text-white' : 'bg-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
      }`}
    >
      {semester.name}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs hover:bg-red-600 flex items-center justify-center"
        title="Delete semester"
      >
        🗑
      </button>
    </button>
  );
}

export default SemesterCard;