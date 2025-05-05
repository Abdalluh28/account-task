import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReviewModal from "../components/account/ReviewForm";
import StarRating from "../components/account/StarRating";
import EditProfileModal from "../components/account/EditProfileModal";

const userData = {
    id: "user123",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    membershipTier: "Premium",
    joinDate: "January 15, 2023"
};

const mockOrders = [
    {
        id: "order1",
        eventId: "event1",
        eventName: "Tech Conference 2024",
        date: "2024-04-15",
        price: "$199.99",
        tickets: 1,
        status: "completed",
        hasReview: false
    },
    {
        id: "order2",
        eventId: "event2",
        eventName: "Music Festival",
        date: "2024-03-10",
        price: "$89.99",
        tickets: 2,
        status: "completed",
        hasReview: true
    },
    {
        id: "order3",
        eventId: "event3",
        eventName: "Art Exhibition",
        date: "2024-02-20",
        price: "$45.00",
        tickets: 1,
        status: "completed",
        hasReview: false
    }
];

const mockReviews = [
    {
        id: "review1",
        eventId: "event2",
        rating: 4,
        comment: "Great event, would attend again!"
    }
];

const apiUrl = process.env.REACT_APP_API_URL;

const Account = () => {
    const [orders, setOrders] = useState(mockOrders);
    const [reviews, setReviews] = useState(mockReviews);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [user, setUser] = useState(userData);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);


    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/orders/user/${user.id}`);
                if (!response.ok) {
                    console.log("Error fetching user orders:", response.statusText);
                }
                const data = await response.json();
                if (response.ok) {
                    setOrders(data);
                    setReviews(
                        data
                            .map((order) => {
                                return order.hasReview
                                    ? {
                                        id: `review${order.eventId}`,
                                        eventId: order.eventId,
                                        rating: order.rating || 0,
                                        comment: order.comment || "",
                                    }
                                    : null;
                            })
                            .filter(Boolean)
                    );
                }
            } catch (error) {
                console.error("Error fetching user orders:", error);
            }
        };

        fetchUserOrders();
    }, [user.id]);


    const handleProfileSave = (updatedInfo) => {
        setUser({ ...user, ...updatedInfo });
    };



    const handleReviewSubmit = async (reviewData) => {
        const newReview = {
            id: `review${reviews.length + 1}`,
            eventId: reviewData.eventId,
            rating: reviewData.rating,
            comment: reviewData.comment
        };
        setReviews([...reviews, newReview]);

        await fetch(`${apiUrl}/api/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newReview)
        });

        setOrders(orders.map(order =>
            order.eventId === reviewData.eventId
                ? { ...order, hasReview: true }
                : order
        ));
    };

    const openReviewModal = (event) => {
        setSelectedEvent(event);
        setIsReviewModalOpen(true);
    };

    const getReviewForEvent = (eventId) => {
        return reviews.find(review => review.eventId === eventId);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <Link to="/" className="text-blue-600 hover:underline">&larr; Back to Home</Link>
                <h1 className="text-3xl font-bold my-4">My Account</h1>

                {/* Profile Section */}
                <div className="bg-white p-6 rounded shadow mb-8">
                    <h2 className="text-xl font-semibold mb-4">Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-500 text-sm">Name</p>
                            <p>{user.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Email</p>
                            <p>{user.email}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Membership</p>
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {user.membershipTier}
                            </span>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Member Since</p>
                            <p>{user.joinDate}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditProfileOpen(true)}
                        className="w-full border border-gray-300 rounded px-4 py-2 mt-2 hover:bg-gray-100 text-sm"
                    >
                        Edit Profile
                    </button>
                </div>

                {/* Orders Section */}
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
                </div>
            </div>

            {/* Modal */}
            {selectedEvent && isReviewModalOpen && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    eventId={selectedEvent.eventId}
                    eventName={selectedEvent.eventName}
                    onSubmit={handleReviewSubmit}
                />
            )}
            <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                user={user}
                onSave={handleProfileSave}
            />
        </div>
    );
};

export default Account;
