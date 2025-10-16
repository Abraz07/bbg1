import React, { useEffect, useState } from "react";
import "./ApproveRejectSubscription.css";

const ApproveRejectSubscription = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        const dummyData = [
            {
                id: 1,
                name: "Bhavesh",
                email: "bhavesh@gmail.com",
                domain: "Finance",
                date: "15/01/2025",
                status: "Pending",
            },
            {
                id: 2,
                name: "Ram",
                email: "ram@gmail.com",
                domain: "Investment",
                date: "12/01/2025",
                status: "Pending",
            },
            {
                id: 3,
                name: "Rahul",
                email: "rahul@gmail.com",
                domain: "Finance",
                date: "14/01/2025",
                status: "Pending",
            },
        ];
        setSubscriptions(dummyData);
    }, []);

    const handleApprove = (id) => {
        setSubscriptions((prev) =>
            prev.map((sub) =>
                sub.id === id ? { ...sub, status: "Approved" } : sub
            )
        );
    };

    const handleReject = (id) => {
        setSubscriptions((prev) =>
            prev.map((sub) =>
                sub.id === id ? { ...sub, status: "Rejected" } : sub
            )
        );
    };

    const filteredData = subscriptions.filter((sub) => {
        const matchSearch =
            sub.name.toLowerCase().includes(search.toLowerCase()) ||
            sub.email.toLowerCase().includes(search.toLowerCase()) ||
            sub.domain.toLowerCase().includes(search.toLowerCase());

        const matchFilter = filter === "All" ? true : sub.status === filter;
        return matchSearch && matchFilter;
    });

    const pendingCount = subscriptions.filter((s) => s.status === "Pending").length;

    return (
        <div className="ar-container">
            <div className="ar-top-header">
                <div className="ar-header-left">
                    <h2 className="ar-title">Subscription Requests</h2>
                    <p className="ar-subtitle">Manage and review employee subscription requests</p>
                </div>
                <div className="ar-header-right">
                    <span className="ar-pending-count">
                        
                        {pendingCount} Pending
                    </span>
                </div>
            </div>

            <div className="ar-search-filter-section">
                <input
                    type="text"
                    className="ar-search-input"
                    placeholder="Search by name, email, or domain..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="ar-filter-buttons">
                    {["All", "Pending", "Approved", "Rejected"].map((tab) => (
                        <button
                            key={tab}
                            className={`ar-filter-tab ${filter === tab ? "ar-active" : ""}`}
                            onClick={() => setFilter(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="ar-cards-container">
                {filteredData.map((sub) => (
                    <div key={sub.id} className="ar-subscription-card">
                        <div className="ar-sub-info">
                            <h5 className="ar-name">{sub.name}</h5>
                            <p className="ar-email">{sub.email}</p>
                            <p className="ar-date">Request Date: {sub.date}</p>
                            <p className="ar-domain">
                                Requested Domain: <span className="ar-domain-value">{sub.domain}</span>
                            </p>
                        </div>

                        <div className="ar-sub-actions">
                            <span
                                className={`ar-status-badge ${
                                    sub.status === "Pending"
                                        ? "ar-status-pending"
                                        : sub.status === "Approved"
                                        ? "ar-status-approved"
                                        : "ar-status-rejected"
                                }`}
                            >
                                {sub.status}
                            </span>

                            {sub.status === "Pending" && (
                                <div className="ar-btn-group">
                                    <button
                                        className="ar-action-btn ar-approve"
                                        onClick={() => handleApprove(sub.id)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="ar-action-btn ar-reject"
                                        onClick={() => handleReject(sub.id)}
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {filteredData.length === 0 && (
                    <p className="ar-no-data">No records found.</p>
                )}
            </div>
        </div>
    );
};

export default ApproveRejectSubscription;