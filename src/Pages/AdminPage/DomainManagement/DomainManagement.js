import React, { useState } from "react";
import "./DomainManagement.css";

function DomainManagement() {
    const [domains, setDomains] = useState([
        {
            name: "Financial Report",
            description: "Financial and accounting report",
            created: "15/01/2024"
        },
        {
            name: "Operation",
            description: "Operational metrics and performance report",
            created: "15/01/2024"
        },
        {
            name: "HR Analytic",
            description: "Human Resource and workforce analytics",
            created: "10/01/2024"
        },
    ]);

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "" });

    const openModal = (index = null) => {
        if (index !== null) {
            setEditIndex(index);
            setFormData({
                name: domains[index].name,
                description: domains[index].description,

            });
        }
        else {
            setEditIndex(null);
            setFormData({ name: "", description: " " });
        }
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.description.trim()) return;

        if (editIndex !== null) {
            const updated = [...domains];
            updated[editIndex] = {
                ...updated[editIndex],
                name: formData.name,
                description: formData.description,
            };
            setDomains(updated);
        }
        else {
            setDomains([
                ...domains,
                {
                    name: formData.name,
                    description: formData.description,
                    created: new Date().toLocaleDateString(),
                },
            ]);
        }
        closeModal();
    };

    const deleteDomain = (index) => {
        setDomains(domains.filter((_, i) => i !== index));
    };

    const filtered = domains.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="domain-container">
            <div className="header-block">
                <h2> Domain Management</h2>
                <p className="subtitle">
                    Your central control for structuring reports and aligning user subscriptions
                    with your organizations operational framework
                </p>
            </div>

            <div className="top-bar">
                <button className="add-btn" onClick={() => openModal()}>
                    + Add Domain
                </button>
                <input
                    type="text"
                    placeholder="Search domains.."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="table-container">
                <table className="domain-table">
                    <thead>
                        <tr>
                            <th>Domain Name</th>
                            <th>Description</th>
                            <th>Created Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((d, i) => (
                            <tr key={i}>
                                <td><span className="icon"></span>{d.name}</td>
                                <td>{d.description}</td>
                                <td className="center">{d.created}</td>
                                <td className="center">
                                    <button className="edit-btn" onClick={() => openModal(i)}>Edit</button>
                                    <button className="delete-btn" onClick={() => deleteDomain(i)}>Delete</button>
                                </td>
                            </tr>

                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan="5" className="no-data">No domains found.</td>
                            </tr>

                        )}

                    </tbody>
                </table>
            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{editIndex !== null ? "Edit Domain" : "Add Domain"}</h3>
                        <form onSubmit={handleSubmit}>

                            <label> Domain Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                required
                            />
                            <label> Description</label>
                            <textarea
                                rows="3"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                required
                            />
                            <div className="modal-actions">
                                <button type="submit" className="save-btn">
                                    {editIndex !== null ? "Save Changes" : "Add Domain"}
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>);
}
export default DomainManagement;