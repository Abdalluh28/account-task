import React, { useEffect, useState } from 'react';
import StarRating from './StarRating';
import ReviewModal from './ReviewForm';
import { mockOrders } from '../../data/data';


const apiUrl = process.env.REACT_APP_API_URL;

export default function Orders({ user }) {
    const [orders, setOrders] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    useEffect(() => {
        const ordersLocalStorage = localStorage.getItem('orders');
        if (ordersLocalStorage) {
            setOrders(JSON.parse(ordersLocalStorage));
        } else {
            setOrders(mockOrders);
        }
    }, [])

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/orders/user/${user.id}`);
                const data = await response.json();
                if (response.ok) {
                    setOrders(data);
                } else {
                    setOrders(mockOrders)
                }
            } catch (error) {
                console.error("Error:", error);
                setOrders(mockOrders)
            }
        };

        fetchUserOrders();
    }, [user.id]);

    const openReviewModal = (order) => {
        setSelectedEvent(order);
        setIsReviewModalOpen(true);
    };

    const getReviewForEvent = (eventId) => {
        const order = orders.find(o => o.eventId === eventId);
        return order?.hasReview ? {
            rating: order.rating,
            comment: order.comment
        } : null;
    };

    return (
        <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Past Bookings</h2>
            {orders.length === 0 ? (
                <p className="text-gray-500">No bookings found.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => {
                        const review = getReviewForEvent(order.eventId);
                        return (
                            <div key={order.id} className="border rounded p-4">
                                <div className="flex flex-col md:flex-row justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg">{order.eventName}</h3>
                                        <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
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
                                        onClick={() => openReviewModal(order)}
                                    >
                                        Write a Review
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Review Modal */}
            {selectedEvent && isReviewModalOpen && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    eventId={selectedEvent.eventId}
                    eventName={selectedEvent.eventName}
                    updateOrderReview={(eventId, rating, comment) => {
                        setOrders(prevOrders =>
                            prevOrders.map(order =>
                                order.eventId === eventId
                                    ? { ...order, hasReview: true, rating, comment }
                                    : order
                            )
                        );
                    }}
                />
            )}

        </div>
    );
}
