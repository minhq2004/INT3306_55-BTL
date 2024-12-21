function GetFullFlights({ onClick }) {
  return (
    <div>
      <button
        className="mb-auto bg-cyan-500 shadow-lg shadow-cyan-500/50 rounded-full p-3 text-white text-md"
        onClick={onClick}
      >
        Xem tất cả các chuyến bay
      </button>
    </div>
  );
}

export default GetFullFlights;
