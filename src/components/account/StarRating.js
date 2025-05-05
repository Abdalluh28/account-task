import React from "react";

const StarRating = ({ rating, setRating, readOnly = false }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex space-x-1">
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => setRating && setRating(star)}
          className={`text-xl cursor-${readOnly ? "default" : "pointer"} ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
