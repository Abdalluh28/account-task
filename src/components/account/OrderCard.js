import React from "react";
import StarRating from "./StarRating";

const OrderCard = ({ order, review, onReviewClick }) => {
  return (
    <div className="border rounded p-4 shadow-sm bg-white">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <h3 className="font-semibold text-lg">{order.eventName}</h3>
          <p className="text-sm text-gray-500">
            {new Date(order.date).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right mt-2 md:mt-0">
          <p className="font-medium">{order.price}</p>
          <p className="text-sm text-gray-500">{order.tickets} ticket(s)</p>
        </div>
      </div>

      {review ? (
        <div className="mt-3 p-3 bg-gray-50 rounded">
          <p className="text-sm font-medium">Your Review</p>
          <StarRating rating={review.rating} readOnly />
          {review.comment && <p className="text-sm mt-1">{review.comment}</p>}
        </div>
      ) : (
        <button
          className="mt-3 text-sm text-blue-600 border border-blue-600 rounded px-3 py-1 hover:bg-blue-50"
          onClick={() => onReviewClick(order)}
        >
          Write a Review
        </button>
      )}
    </div>
  );
};

export default OrderCard;
