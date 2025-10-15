import React, { useEffect, useState } from "react";
import "./ApproveRejectSubscription.css"

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
                domain: "finance",
                date: "15/01/2025",
                status: "Pending",
            },
            {
                id: 2,
                name: "Ram",
                email: "ram@gmail.com",
                domain: "investment",
                date: "12/01/2025",
                status: "Pending",
            },

            {
                name: "Rahuk",
                email: "rahuk@gmail.com",
                domain: "finance",
                date: "14/05/2025",
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

        const matchFilter = filter == "All" ? true : sub.status == filter;
        return matchSearch && matchFilter;

    });

    const pendingCount = subscriptions.filter((s) => s.status == "Pending").length;

    return (
        <div className="subscription-container">
            <div className="top-header">
                <div className="header-left">
                    <h2> Subscription Requests</h2>
                    <p> Manage and review employee subscription requests</p>
                </div>
                <div className="header-right">
                    <span className="pending-count"> ⏱ {pendingCount} Pending </span>
                </div>
            </div>

            <div className="search-filter-section">
                <input
                    type="text"
                    placeholder="Search by name,email, or domain..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} />

                <div className="filter-buttons">
                    {["All", "Pending", "Approved", "Rejected"].map((tab) => (
                        <button
                            key={tab}
                            className={`filter-tab ${filter == tab ? "active" : ""}`}
                            onClick={() => setFilter(tab)}
                        >
                            {tab}

                        </button>
                    ))}
                </div>
            </div>

            {filteredData.map((sub) => (
                <div key={sub.id} className="subscription-card">
                    <div className="sub-info">
                        <h5>{sub.name}</h5>
                        <p>{sub.email}</p>
                        <p className="org-date">Request Date: {sub.date}</p>
                        <p className="domain-info">
                            Requested Domain : <span>{sub.domain}</span>
                        </p>
                    </div>

                    <div className="sub-actions">
                        <span
                            className={`status-badge ${sub.status == "Pending"
                                    ? "status-pending"
                                    : sub.status == "Approved"
                                        ? "status-approved"
                                        : "status-rejected"
                                }`}
                        >
                            {sub.status}
                        </span>

                        {sub.status == "Pending" && (
                            <div className="btn-group">
                                <button
                                    className="action-btn approve"
                                    onClick={() => handleApprove(sub.id)}
                                >
                                    Approve
                                </button>

                                <button
                                    className="action-btn reject"
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
                <p className="no-data">No records found.</p>
            )}
        </div>
    );
};
export default ApproveRejectSubscription;


