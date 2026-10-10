function SummaryCard({ title, amount }) {
  let bgColor = "bg-indigo-600";
  let icon = "💰";

  switch (title) {
    case "Income":
      bgColor = "bg-green-600";
      icon = "💵";
      break;

    case "Expense":
      bgColor = "bg-red-600";
      icon = "💸";
      break;

    case "Highest Expense":
      bgColor = "bg-orange-500";
      icon = "🔥";
      break;

    case "Highest Income":
      bgColor = "bg-emerald-500";
      icon = "🏆";
      break;

    case "Transactions":
      bgColor = "bg-purple-600";
      icon = "📊";
      break;

    default:
      break;
  }

  return (
    <div
      className={`${bgColor} text-white rounded-2xl shadow-xl p-6 hover:scale-105 transition-all duration-300`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg">{title}</p>
          <h2 className="text-3xl font-bold mt-2">
            ₹ {Number(amount || 0).toLocaleString("en-IN")}
          </h2>
        </div>
        <div className="text-5xl">{icon}</div>
      </div>
    </div>
  );
}

export default SummaryCard;
