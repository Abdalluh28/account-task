import React, { useState } from "react";
import { Link } from "react-router-dom";
import EditProfileModal from "../components/account/EditProfileModal";
import Orders from "../components/account/Orders";
import { userData } from "../data/data";

const Account = () => {

    const [user, setUser] = useState(userData);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const handleProfileSave = (updatedInfo) => {
        setUser({ ...user, ...updatedInfo });
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
                <Orders user={user} />
            </div>

            {/* Modal */}

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
