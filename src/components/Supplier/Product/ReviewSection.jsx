import { Star, User, CalendarDays } from "lucide-react";

function ReviewSection({ product }) {
  const reviews = product?.reviews || [];

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  const ratingCount = [5, 4, 3, 2, 1].map((num) => ({
    star: num,
    count: reviews.filter((r) => r.rating === num).length,
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">

      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Customer Reviews
        </h2>
        <span className="text-sm text-gray-500">
          {reviews.length} total
        </span>
      </div>

      {/* 🔥 SUMMARY */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* LEFT: AVG */}
        <div className="flex flex-col items-center justify-center border rounded-xl p-5 bg-gray-50">
          <p className="text-4xl font-bold text-[#0a5183]">
            {avgRating}
          </p>

          {/* ⭐ STARS */}
          <div className="flex mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={20}
                className={`${
                  i <= Math.round(avgRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Based on {reviews.length} reviews
          </p>
        </div>

        {/* RIGHT: BREAKDOWN */}
        <div className="space-y-3">
          {ratingCount.map((r, i) => {
            const percent =
              reviews.length > 0
                ? (r.count / reviews.length) * 100
                : 0;

            return (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="w-8 flex items-center gap-1 text-gray-600">
                  {r.star}
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                </span>

                <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0a5183] h-2 rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <span className="w-6 text-right text-gray-600">
                  {r.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔥 REVIEW LIST */}
      {reviews.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          No reviews yet
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="border rounded-xl p-4 hover:shadow-md transition bg-white"
            >
              {/* TOP */}
              <div className="flex justify-between items-center mb-2">

                {/* USER */}
                <div className="flex items-center gap-2">
                  <User size={16} className="text-[#0a5183]" />
                  <p className="font-medium text-gray-800">
                    {rev.name || "Anonymous"}
                  </p>
                </div>

                {/* RATING */}
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={`${
                        s <= rev.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* COMMENT */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {rev.comment}
              </p>

              {/* DATE */}
              {rev.createdAt && (
                <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                  <CalendarDays size={14} />
                  {new Date(rev.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewSection;