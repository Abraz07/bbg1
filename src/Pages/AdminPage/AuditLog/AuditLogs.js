import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AuditLogs.css';

const AuditLogs = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAction, setFilterAction] = useState('All Actions');

    const auditData = [
        { id: 1, timestamp: '2024-01-10 14:32:15', user: 'admin@rwtool.com', action: 'USER_APPROVED', details: 'Approved subscription request for john.doe@ex...', ipAddress: '192.168.1.100', status: 'success' },
        { id: 2, timestamp: '2024-01-10 14:28:43', user: 'admin@rwtool.com', action: 'REPORT_UPLOAD', details: 'Uploaded Q4 Financial Report', ipAddress: '192.168.1.100', status: 'success' },
        { id: 3, timestamp: '2024-01-10 14:15:22', user: 'jane.smith@rwtool.com', action: 'USER_LOGIN', details: 'Admin login successful', ipAddress: '192.168.1.105', status: 'success' },
        { id: 4, timestamp: '2024-01-10 13:45:11', user: 'unknown', action: 'LOGIN_FAILED', details: 'Failed login attempt for admin account', ipAddress: '203.45.67.89', status: 'failed' }
    ];

    const filteredData = auditData.filter(log => {
        const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || log.details.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterAction === 'All Actions' || log.action === filterAction;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="audit-logs-container">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
                <div>
                    <h2 className="audit-title">Audit Logs</h2>
                    <p className="audit-subtitle">Track all system activities and user actions</p>
                </div>
                <button className="btn btn-export">
                    Export Logs
                </button>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="stats-card">
                        <div className="stats-label">Total Events</div>
                        <div className="stats-value">1,248</div>
                        <div className="stats-period">Last 30 days</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stats-card">
                        <div className="stats-label">User Actions</div>
                        <div className="stats-value">892</div>
                        <div className="stats-period">71.5% of total</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stats-card">
                        <div className="stats-label">Failed Attempts</div>
                        <div className="stats-value stats-value-danger">23</div>
                        <div className="stats-period stats-period-danger">Security alerts</div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stats-card">
                        <div className="stats-label">Report Changes</div>
                        <div className="stats-value">156</div>
                        <div className="stats-period">Uploads & deletions</div>
                    </div>
                </div>
            </div>

            {/* Activity Log Section */}
            <div className="activity-section">
                <div className="mb-4">
                    <h4 className="activity-title">Activity Log</h4>
                    <p className="activity-subtitle mb-0">Detailed record of all system activities</p>
                </div>

                {/* Filters */}
                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <select className="form-select" value={filterAction} onChange={e => setFilterAction(e.target.value)}>
                            <option>All Actions</option>
                            <option>USER_APPROVED</option>
                            <option>REPORT_UPLOAD</option>
                            <option>USER_LOGIN</option>
                            <option>LOGIN_FAILED</option>
                        </select>
                    </div>
                    <div className="col-md-7">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                🔍
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0"
                                placeholder="Search logs..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-outline-secondary w-100">
                            ⚙️
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="table-responsive">
                    <table className="table audit-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>User</th>
                                <th>Action</th>
                                <th>Details</th>
                                <th>IP Address</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map(log => (
                                <tr key={log.id}>
                                    <td className="text-muted">{log.timestamp}</td>
                                    <td className="fw-semibold">{log.user}</td>
                                    <td><span className="action-badge">{log.action}</span></td>
                                    <td>{log.details}</td>
                                    <td className="text-muted">{log.ipAddress}</td>
                                    <td><span className={`status-badge status-${log.status}`}>{log.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;