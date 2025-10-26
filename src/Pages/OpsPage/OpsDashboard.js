import React, { useState, useEffect } from 'react';
import {
    LogOut,
    RefreshCw,
    Database,
    AlertCircle,
    FileText,
    Shield,
    Calendar,
    Download,
    Cloud,
    Bell,
    Settings,
    Play,
    Pause,
    Clock,
    Folder,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import './OpsDashboard.css';

const OpsDashboard = ({ navigate }) => {
    const user = { name: 'Ramesh', role: 'operations' };
    const logout = () => navigate('landing');

    const [activeFilter, setActiveFilter] = useState('Today');
    const [selectedOrganization, setSelectedOrganization] = useState('All Organizations');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('monitoring');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // New state for report generation and OneDrive integration
    const [reportGeneration, setReportGeneration] = useState({
        isRunning: false,
        frequency: 'hourly', // hourly, daily, weekly
        domains: ['Finance', 'Risk Management', 'Operations', 'IT', 'HR'],
        lastGenerated: null,
        nextScheduled: null
    });

    const [oneDriveStatus, setOneDriveStatus] = useState({
        connected: true,
        lastSync: '2 mins ago',
        totalReports: 0,
        folders: {}
    });

    // Dummy reports for each domain
    const [domainReports, setDomainReports] = useState({
        'Finance': [
            { id: 1, name: 'Q4_Financial_Analysis_2024.pdf', type: 'Financial Analysis', size: '2.4 MB', generated: '2 hours ago', status: 'published' },
            { id: 2, name: 'Budget_Review_January_2024.pdf', type: 'Budget Analysis', size: '1.8 MB', generated: '1 day ago', status: 'published' },
            { id: 3, name: 'Revenue_Projections_Q1_2024.pdf', type: 'Financial Analysis', size: '3.2 MB', generated: '3 days ago', status: 'published' },
            { id: 4, name: 'Cost_Optimization_Report.pdf', type: 'Financial Analysis', size: '1.5 MB', generated: '1 week ago', status: 'published' }
        ],
        'Risk Management': [
            { id: 1, name: 'Risk_Assessment_January_2024.pdf', type: 'Risk Assessment', size: '2.1 MB', generated: '4 hours ago', status: 'published' },
            { id: 2, name: 'Compliance_Audit_Report.pdf', type: 'Compliance Report', size: '2.8 MB', generated: '2 days ago', status: 'published' },
            { id: 3, name: 'Security_Threat_Analysis.pdf', type: 'Security Report', size: '1.9 MB', generated: '5 days ago', status: 'published' },
            { id: 4, name: 'Operational_Risk_Review.pdf', type: 'Risk Assessment', size: '2.3 MB', generated: '1 week ago', status: 'published' }
        ],
        'Operations': [
            { id: 1, name: 'Operational_Metrics_January_2024.pdf', type: 'Operational Metrics', size: '2.7 MB', generated: '1 hour ago', status: 'published' },
            { id: 2, name: 'Performance_Review_Q4_2023.pdf', type: 'Performance Review', size: '3.1 MB', generated: '1 day ago', status: 'published' },
            { id: 3, name: 'Efficiency_Analysis_Report.pdf', type: 'Operational Metrics', size: '2.0 MB', generated: '4 days ago', status: 'published' },
            { id: 4, name: 'Quality_Assurance_Summary.pdf', type: 'Quality Assurance', size: '1.6 MB', generated: '1 week ago', status: 'published' }
        ],
        'IT': [
            { id: 1, name: 'IT_Infrastructure_Report.pdf', type: 'Operational Metrics', size: '2.5 MB', generated: '3 hours ago', status: 'published' },
            { id: 2, name: 'System_Performance_Analysis.pdf', type: 'Performance Review', size: '2.2 MB', generated: '1 day ago', status: 'published' },
            { id: 3, name: 'Security_Compliance_Check.pdf', type: 'Compliance Report', size: '1.8 MB', generated: '3 days ago', status: 'published' },
            { id: 4, name: 'Network_Optimization_Report.pdf', type: 'Operational Metrics', size: '2.1 MB', generated: '1 week ago', status: 'published' }
        ],
        'HR': [
            { id: 1, name: 'Employee_Performance_Review.pdf', type: 'Performance Review', size: '2.3 MB', generated: '2 hours ago', status: 'published' },
            { id: 2, name: 'HR_Metrics_Dashboard.pdf', type: 'Operational Metrics', size: '1.9 MB', generated: '2 days ago', status: 'published' },
            { id: 3, name: 'Training_Compliance_Report.pdf', type: 'Compliance Report', size: '2.4 MB', generated: '4 days ago', status: 'published' },
            { id: 4, name: 'Workforce_Analytics.pdf', type: 'Operational Metrics', size: '2.6 MB', generated: '1 week ago', status: 'published' }
        ]
    });

    // Calculate total reports from all domains
    const totalReports = Object.values(domainReports).reduce((total, reports) => total + reports.length, 0);

    const [notifications, setNotifications] = useState([
        { id: 1, type: 'report_generated', message: 'New reports generated for Finance domain', time: '5 mins ago', read: false },
        { id: 2, type: 'onedrive_sync', message: 'Reports successfully uploaded to OneDrive', time: '3 mins ago', read: false },
        { id: 3, type: 'admin_notification', message: 'Admin notified about new reports', time: '2 mins ago', read: true },
    ]);

    // State for dynamic data
    const [storageConnections, setStorageConnections] = useState([
        { id: 1, name: 'OneDrive', organization: 'Finance Dept', status: 'active', lastSync: oneDriveStatus.lastSync, reports: domainReports['Finance'].length },
        { id: 2, name: 'OneDrive', organization: 'Risk Management', status: 'active', lastSync: oneDriveStatus.lastSync, reports: domainReports['Risk Management'].length },
        { id: 3, name: 'OneDrive', organization: 'Operations', status: 'syncing', lastSync: 'Running', reports: domainReports['Operations'].length },
        { id: 4, name: 'OneDrive', organization: 'IT', status: 'active', lastSync: oneDriveStatus.lastSync, reports: domainReports['IT'].length },
        { id: 5, name: 'OneDrive', organization: 'HR', status: 'active', lastSync: oneDriveStatus.lastSync, reports: domainReports['HR'].length },
    ]);

    const [pendingValidation, setPendingValidation] = useState([
        { id: 1, name: 'Q4_Financial_Report.pdf', organization: 'Finance', source: 'OneDrive', size: '2.4 MB', uploaded: '10 Oct, 11:32', status: 'validating', format: 'PDF', integrity: 'Pass' },
        { id: 2, name: 'Risk_Assessment_2024.xlsx', organization: 'Risk', source: 'OneDrive', size: '856 KB', uploaded: '10 Oct, 10:21', status: 'pending', format: 'Excel', integrity: 'Checking' },
        { id: 3, name: 'Operations_Summary.pdf', organization: 'Operations', source: 'OneDrive', size: '1.8 MB', uploaded: '10 Oct, 10:02', status: 'validating', format: 'PDF', integrity: 'Pass' },
    ]);

    const [syncJobs, setSyncJobs] = useState([
        { id: 1, source: 'OneDrive', organization: 'Finance', status: 'completed', progress: 100, files: 12, time: '2 mins ago' },
        { id: 2, source: 'OneDrive', organization: 'Operations', status: 'in-progress', progress: 67, files: 8, time: 'Running' },
        { id: 3, source: 'OneDrive', organization: 'Risk', status: 'pending', progress: 0, files: 15, time: 'Scheduled' },
        { id: 4, source: 'OneDrive', organization: 'Archive', status: 'failed', progress: 45, files: 5, time: '10 mins ago' },
    ]);

    const [publishedReports, setPublishedReports] = useState([
        { id: 1, name: 'Q4_Financial_Report.pdf', organization: 'Finance', publishedAt: '10 Oct, 11:32', subscribers: 45, notifications: 'Sent', downloads: 38 },
        { id: 2, name: 'Risk_Assessment_2024.xlsx', organization: 'Risk', publishedAt: '10 Oct, 10:21', subscribers: 32, notifications: 'Sent', downloads: 28 },
        { id: 3, name: 'Operations_Summary.pdf', organization: 'Operations', publishedAt: '10 Oct, 10:02', subscribers: 28, notifications: 'Pending', downloads: 0 },
    ]);

    const failedOperations = syncJobs.filter((job) => job.status === 'failed');

    // Generate random PDF report function
    const generateRandomReport = (domain) => {
        const reportTypes = [
            'Financial Analysis',
            'Risk Assessment',
            'Operational Metrics',
            'Performance Review',
            'Compliance Report',
            'Audit Summary',
            'Budget Analysis',
            'Quality Assurance'
        ];

        const reportType = reportTypes[Math.floor(Math.random() * reportTypes.length)];
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportName = `${domain}_${reportType.replace(/\s+/g, '_')}_${timestamp}.pdf`;

        // Simulate PDF generation (in real app, this would use a PDF library)
        const reportData = {
            id: Date.now(),
            name: reportName,
            domain: domain,
            type: reportType,
            size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
            generatedAt: new Date().toLocaleString(),
            status: 'generated',
            content: `This is a sample ${reportType} report for ${domain} domain. Generated at ${new Date().toLocaleString()}.`
        };

        return reportData;
    };

    // Simulate OneDrive upload
    const uploadToOneDrive = async (report) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const folderPath = `/Reports/${report.domain}/${new Date().getFullYear()}/${new Date().getMonth() + 1}/`;

        return {
            success: true,
            folderPath: folderPath,
            oneDriveUrl: `https://onedrive.live.com/reports/${report.domain}/${report.name}`,
            uploadedAt: new Date().toLocaleString()
        };
    };

    // Generate reports for all domains
    const generateReportsForAllDomains = async () => {
        setReportGeneration(prev => ({ ...prev, isRunning: true }));

        const newReports = [];
        const uploadResults = [];

        // Generate reports for each domain
        for (const domain of reportGeneration.domains) {
            const report = generateRandomReport(domain);
            newReports.push(report);

            // Upload to OneDrive
            const uploadResult = await uploadToOneDrive(report);
            uploadResults.push({ report, uploadResult });
        }

        // Add notifications
        setNotifications(prev => [
            {
                id: Date.now(),
                type: 'report_generated',
                message: `Generated ${newReports.length} new reports across all domains`,
                time: 'Just now',
                read: false
            },
            {
                id: Date.now() + 1,
                type: 'onedrive_sync',
                message: 'All reports successfully uploaded to OneDrive',
                time: 'Just now',
                read: false
            },
            {
                id: Date.now() + 2,
                type: 'admin_notification',
                message: 'Admin has been notified about new reports',
                time: 'Just now',
                read: false
            }
        ]);

        setReportGeneration(prev => ({
            ...prev,
            isRunning: false,
            lastGenerated: new Date().toLocaleString(),
            nextScheduled: calculateNextScheduled(prev.frequency)
        }));

        // Update OneDrive status
        setOneDriveStatus(prev => ({
            ...prev,
            lastSync: 'Just now',
            totalReports: prev.totalReports + newReports.length
        }));
    };

    // Calculate next scheduled generation
    const calculateNextScheduled = (frequency) => {
        const now = new Date();
        switch (frequency) {
            case 'hourly':
                return new Date(now.getTime() + 60 * 60 * 1000).toLocaleString();
            case 'daily':
                return new Date(now.getTime() + 24 * 60 * 60 * 1000).toLocaleString();
            case 'weekly':
                return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleString();
            default:
                return new Date(now.getTime() + 60 * 60 * 1000).toLocaleString();
        }
    };

    // Auto-generate reports based on frequency
    useEffect(() => {
        if (reportGeneration.isRunning) return;

        const interval = setInterval(() => {
            generateReportsForAllDomains();
        }, getFrequencyInterval(reportGeneration.frequency));

        return () => clearInterval(interval);
    }, [reportGeneration.frequency, reportGeneration.isRunning]);

    const getFrequencyInterval = (frequency) => {
        switch (frequency) {
            case 'hourly': return 60 * 60 * 1000; // 1 hour
            case 'daily': return 24 * 60 * 60 * 1000; // 24 hours
            case 'weekly': return 7 * 24 * 60 * 60 * 1000; // 7 days
            default: return 60 * 60 * 1000;
        }
    };

    // Button handlers
    const handleCheckForUpdates = (connectionId) => {
        setStorageConnections(prev =>
            prev.map(conn =>
                conn.id === connectionId
                    ? { ...conn, status: 'syncing', lastSync: 'Checking...' }
                    : conn
            )
        );

        // Simulate checking for updates
        setTimeout(() => {
            setStorageConnections(prev =>
                prev.map(conn =>
                    conn.id === connectionId
                        ? { ...conn, status: 'active', lastSync: 'Just now' }
                        : conn
                )
            );
            addNotification('onedrive_sync', { message: 'OneDrive connection updated successfully' });
        }, 2000);
    };

    const handleSyncAll = () => {
        setStorageConnections(prev =>
            prev.map(conn => ({ ...conn, status: 'syncing', lastSync: 'Syncing...' }))
        );

        // Simulate sync all
        setTimeout(() => {
            setStorageConnections(prev =>
                prev.map(conn => ({ ...conn, status: 'active', lastSync: 'Just now' }))
            );
            addNotification('onedrive_sync', { message: 'All OneDrive connections synced successfully' });
        }, 3000);
    };

    const handleRetryFailed = (jobId) => {
        setSyncJobs(prev =>
            prev.map(job =>
                job.id === jobId
                    ? { ...job, status: 'in-progress', progress: 0 }
                    : job
            )
        );

        // Simulate retry
        setTimeout(() => {
            setSyncJobs(prev =>
                prev.map(job =>
                    job.id === jobId
                        ? { ...job, status: 'completed', progress: 100 }
                        : job
                )
            );
            addNotification('onedrive_sync', { message: 'Failed operation retried successfully' });
        }, 2000);
    };

    const handleRetryAllFailed = () => {
        setSyncJobs(prev =>
            prev.map(job =>
                job.status === 'failed'
                    ? { ...job, status: 'in-progress', progress: 0 }
                    : job
            )
        );

        // Simulate retry all
        setTimeout(() => {
            setSyncJobs(prev =>
                prev.map(job =>
                    job.status === 'in-progress'
                        ? { ...job, status: 'completed', progress: 100 }
                        : job
                )
            );
            addNotification('onedrive_sync', { message: 'All failed operations retried successfully' });
        }, 3000);
    };

    const handleCancelJob = (jobId) => {
        setSyncJobs(prev =>
            prev.map(job =>
                job.id === jobId
                    ? { ...job, status: 'pending', progress: 0 }
                    : job
            )
        );
        addNotification('generation_error', { message: 'Sync operation cancelled' });
    };

    const handleApproveReport = (reportId) => {
        setPendingValidation(prev =>
            prev.map(report =>
                report.id === reportId
                    ? { ...report, status: 'completed' }
                    : report
            )
        );

        // Move to published reports
        const report = pendingValidation.find(r => r.id === reportId);
        if (report) {
            setPublishedReports(prev => [...prev, {
                ...report,
                publishedAt: new Date().toLocaleString(),
                subscribers: Math.floor(Math.random() * 50) + 20,
                notifications: 'Sent',
                downloads: 0
            }]);
            addNotification('admin_notification', { message: `Report ${report.name} approved and published` });
        }
    };

    const handleRejectReport = (reportId) => {
        setPendingValidation(prev => prev.filter(report => report.id !== reportId));
        addNotification('generation_error', { message: 'Report rejected and removed from queue' });
    };

    const handleSendNotifications = (reportId) => {
        setPublishedReports(prev =>
            prev.map(report =>
                report.id === reportId
                    ? { ...report, notifications: 'Sent' }
                    : report
            )
        );
        addNotification('admin_notification', { message: 'Notifications sent to all subscribers' });
    };

    const handleViewDetails = (reportId) => {
        const report = publishedReports.find(r => r.id === reportId);
        if (report) {
            alert(`Report Details:\n\nName: ${report.name}\nOrganization: ${report.organization}\nPublished: ${report.publishedAt}\nSubscribers: ${report.subscribers}\nDownloads: ${report.downloads}\nNotifications: ${report.notifications}`);
        }
    };

    const addNotification = (type, data) => {
        const newNotification = {
            id: Date.now() + Math.random(),
            type: type,
            message: data.message || 'New notification',
            time: 'Just now',
            read: false
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const unreadNotifications = notifications.filter(n => !n.read).length;

    const getStatusBadge = (status) => {
        const styles = {
            base: { padding: '6px 14px', borderRadius: 16, fontSize: 12, fontWeight: 500, border: '1px solid' },
            completed: { background: '#d1fae5', color: '#065f46', borderColor: '#a7f3d0' },
            'in-progress': { background: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' },
            failed: { background: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' },
            pending: { background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' },
            validating: { background: '#e0e7ff', color: '#3730a3', borderColor: '#c7d2fe' },
            generated: { background: '#d1fae5', color: '#065f46', borderColor: '#a7f3d0' },
        };
        return <span style={{ ...styles.base, ...(styles[status] || styles.pending) }}>{status}</span>;
    };

    const progressBar = (value, status) => {
        let barColor = '#10b981';
        if (status === 'in-progress') barColor = '#0473EA';
        if (status === 'failed') barColor = '#dc2626';
        return (
            <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${value}%`, background: barColor }} />
            </div>
        );
    };

    return (
        <div className="dash">
            {/* Sidebar */}
            <div className={`side ${sidebarOpen ? 'open' : ''}`}>
                <div className="side-head">
                    <span className="logo-icon"></span>
                    <div>
                        <h2>RW Tool</h2>
                        <p>Operations Panel</p>
                    </div>
                </div>
                <div className="side-nav">
                    <p className="nav-label">Operations</p>
                    {[
                        { id: 'monitoring', label: 'Remote Monitoring', icon: <Database style={{ width: 18, height: 18 }} /> },
                        { id: 'sync', label: 'Sync Operations', icon: <RefreshCw style={{ width: 18, height: 18 }} /> },
                        { id: 'validation', label: 'Validation Queue', icon: <Shield style={{ width: 18, height: 18 }} /> },
                        { id: 'published', label: 'Published Reports', icon: <FileText style={{ width: 18, height: 18 }} /> },
                        { id: 'generation', label: 'Report Generation', icon: <FileText style={{ width: 18, height: 18 }} /> },
                        { id: 'domain-reports', label: 'Domain Reports', icon: <Folder style={{ width: 18, height: 18 }} /> },
                        { id: 'notifications', label: 'Notifications', icon: <Bell style={{ width: 18, height: 18 }} />, badge: unreadNotifications },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                            {item.badge && item.badge > 0 && (
                                <span style={{
                                    background: '#dc2626',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    fontSize: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginLeft: 'auto'
                                }}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main */}
            <div className="main">
                <div className="top">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="menu">☰</button>
                    <div className="actions">
                        <button onClick={logout} className="logout-btn">
                            <LogOut style={{ width: 16, height: 16 }} />
                            Logout
                        </button>
                    </div>
                </div>

                <div className="content">
                    {/* Header Actions */}
                    <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, color: '#111' }}>Operations Dashboard</h2>
                            <p style={{ margin: 0, color: '#6b7280', fontSize: 15 }}>
                                Automated report generation and OneDrive synchronization
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={() => generateReportsForAllDomains()}
                                disabled={reportGeneration.isRunning}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '10px 18px',
                                    borderRadius: 8,
                                    border: '1px solid #e5e7eb',
                                    background: reportGeneration.isRunning ? '#f3f4f6' : '#fff',
                                    color: reportGeneration.isRunning ? '#9ca3af' : '#333',
                                    cursor: reportGeneration.isRunning ? 'not-allowed' : 'pointer',
                                    fontWeight: 600,
                                    fontSize: 14,
                                }}
                            >
                                <FileText style={{ width: 16, height: 16 }} />
                                {reportGeneration.isRunning ? 'Generating...' : 'Generate Reports'}
                            </button>
                            <button
                                onClick={handleSyncAll}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '10px 18px',
                                    borderRadius: 8,
                                    border: 'none',
                                    background: '#0473EA',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: 14,
                                }}
                            >
                                <RefreshCw style={{ width: 16, height: 16 }} />
                                Sync All
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 24 }}>
                        {[
                            {
                                label: 'OneDrive Connections',
                                value: storageConnections.filter((s) => s.status === 'active').length,
                                icon: <Cloud style={{ width: 20, height: 20, color: '#0473EA' }} />,
                            },
                            { label: 'Pending Validation', value: pendingValidation.length, icon: <Shield style={{ width: 20, height: 20, color: '#f59e0b' }} /> },
                            { label: 'Total Reports', value: totalReports, icon: <FileText style={{ width: 20, height: 20, color: '#10b981' }} /> },
                            { label: 'Published Reports', value: publishedReports.length, icon: <FileText style={{ width: 20, height: 20, color: '#8b5cf6' }} /> },
                            { label: 'Unread Notifications', value: unreadNotifications, icon: <Bell style={{ width: 20, height: 20, color: '#dc2626' }} /> },
                        ].map((stat) => (
                            <div key={stat.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                    <p style={{ margin: 0, color: '#6b7280', fontSize: 13, fontWeight: 500 }}>{stat.label}</p>
                                    {stat.icon}
                                </div>
                                <h3 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#111' }}>{stat.value}</h3>
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div style={{ marginBottom: 24, borderBottom: '2px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {[
                                { id: 'monitoring', label: 'Remote Monitoring', icon: <Database style={{ width: 16, height: 16 }} /> },
                                { id: 'sync', label: 'Sync Operations', icon: <RefreshCw style={{ width: 16, height: 16 }} /> },
                                { id: 'validation', label: 'Validation Queue', icon: <Shield style={{ width: 16, height: 16 }} /> },
                                { id: 'published', label: 'Published Reports', icon: <FileText style={{ width: 16, height: 16 }} /> },
                                { id: 'generation', label: 'Report Generation', icon: <FileText style={{ width: 16, height: 16 }} /> },
                                { id: 'domain-reports', label: 'Domain Reports', icon: <Folder style={{ width: 16, height: 16 }} /> },
                                { id: 'notifications', label: 'Notifications', icon: <Bell style={{ width: 16, height: 16 }} />, badge: unreadNotifications },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: '12px 20px',
                                        border: 'none',
                                        background: 'transparent',
                                        color: activeTab === tab.id ? '#0473EA' : '#6b7280',
                                        cursor: 'pointer',
                                        fontWeight: activeTab === tab.id ? 600 : 500,
                                        fontSize: 14,
                                        borderBottom: activeTab === tab.id ? '3px solid #0473EA' : '3px solid transparent',
                                        marginBottom: '-2px',
                                        transition: 'all 0.2s',
                                        position: 'relative'
                                    }}
                                >
                                    {tab.icon}
                                    {tab.label}
                                    {tab.badge && tab.badge > 0 && (
                                        <span style={{
                                            background: '#dc2626',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '16px',
                                            height: '16px',
                                            fontSize: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginLeft: '4px'
                                        }}>
                                            {tab.badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filters */}
                    <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                        {['Today', 'Last 7 days', 'Last 30 days'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 8,
                                    border: activeFilter === filter ? '2px solid #0473EA' : '1px solid #e5e7eb',
                                    background: activeFilter === filter ? '#eff6ff' : '#fff',
                                    color: activeFilter === filter ? '#0473EA' : '#6b7280',
                                    cursor: 'pointer',
                                    fontWeight: activeFilter === filter ? 600 : 500,
                                    fontSize: 14,
                                }}
                            >
                                {filter}
                            </button>
                        ))}
                        <select
                            value={selectedOrganization}
                            onChange={(e) => setSelectedOrganization(e.target.value)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: 8,
                                border: '1px solid #e5e7eb',
                                background: '#fff',
                                color: '#333',
                                cursor: 'pointer',
                                fontSize: 14,
                                fontWeight: 500,
                            }}
                        >
                            <option>All Organizations</option>
                            <option>Finance</option>
                            <option>Risk Management</option>
                            <option>Operations</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Search reports or sources..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: 8,
                                border: '1px solid #e5e7eb',
                                background: '#fff',
                                fontSize: 14,
                                flex: 1,
                                minWidth: 200,
                            }}
                        />
                    </div>

                    {/* Report Generation Tab */}
                    {activeTab === 'generation' && (
                        <div className="tab-content" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>Report Generation Settings</h3>
                                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>
                                    Configure automated report generation and OneDrive synchronization
                                </p>
                            </div>
                            <div style={{ padding: '20px' }}>
                                {/* Generation Status */}
                                <div style={{
                                    background: reportGeneration.isRunning ? '#fef3c7' : '#d1fae5',
                                    border: `1px solid ${reportGeneration.isRunning ? '#fde68a' : '#a7f3d0'}`,
                                    borderRadius: 12,
                                    padding: '20px',
                                    marginBottom: '24px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            {reportGeneration.isRunning ? (
                                                <RefreshCw style={{ width: 24, height: 24, color: '#f59e0b', animation: 'spin 1s linear infinite' }} />
                                            ) : (
                                                <CheckCircle style={{ width: 24, height: 24, color: '#10b981' }} />
                                            )}
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#111' }}>
                                                    {reportGeneration.isRunning ? 'Generating Reports...' : 'Report Generation Active'}
                                                </h4>
                                                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>
                                                    {reportGeneration.isRunning ? 'Please wait while reports are being generated' : 'Automated report generation is running'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setReportGeneration(prev => ({ ...prev, isRunning: !prev.isRunning }))}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 8,
                                                padding: '8px 16px',
                                                borderRadius: 8,
                                                border: '1px solid #e5e7eb',
                                                background: '#fff',
                                                color: '#333',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                fontSize: 14,
                                            }}
                                        >
                                            {reportGeneration.isRunning ? <Pause style={{ width: 16, height: 16 }} /> : <Play style={{ width: 16, height: 16 }} />}
                                            {reportGeneration.isRunning ? 'Pause' : 'Resume'}
                                        </button>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                        <div>
                                            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Frequency</p>
                                            <select
                                                value={reportGeneration.frequency}
                                                onChange={(e) => setReportGeneration(prev => ({
                                                    ...prev,
                                                    frequency: e.target.value,
                                                    nextScheduled: calculateNextScheduled(e.target.value)
                                                }))}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 12px',
                                                    borderRadius: 8,
                                                    border: '1px solid #e5e7eb',
                                                    background: '#fff',
                                                    fontSize: 14,
                                                    fontWeight: 500
                                                }}
                                            >
                                                <option value="hourly">Hourly</option>
                                                <option value="daily">Daily</option>
                                                <option value="weekly">Weekly</option>
                                            </select>
                                        </div>
                                        <div>
                                            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Last Generated</p>
                                            <p style={{ margin: 0, fontSize: 14, color: '#111', fontWeight: 500 }}>
                                                {reportGeneration.lastGenerated || 'Never'}
                                            </p>
                                        </div>
                                        <div>
                                            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Next Scheduled</p>
                                            <p style={{ margin: 0, fontSize: 14, color: '#111', fontWeight: 500 }}>
                                                {reportGeneration.nextScheduled || 'Not scheduled'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Domains Configuration */}
                                <div style={{ marginBottom: '24px' }}>
                                    <h4 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#111' }}>Configure Domains</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                        {reportGeneration.domains.map((domain, index) => (
                                            <div key={domain} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '12px',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: 8,
                                                background: '#fff'
                                            }}>
                                                <Folder style={{ width: 20, height: 20, color: '#0473EA' }} />
                                                <span style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{domain}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* OneDrive Status */}
                                <div style={{
                                    background: oneDriveStatus.connected ? '#d1fae5' : '#fee2e2',
                                    border: `1px solid ${oneDriveStatus.connected ? '#a7f3d0' : '#fecaca'}`,
                                    borderRadius: 12,
                                    padding: '20px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Cloud style={{ width: 24, height: 24, color: oneDriveStatus.connected ? '#10b981' : '#dc2626' }} />
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#111' }}>
                                                    OneDrive Integration
                                                </h4>
                                                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>
                                                    {oneDriveStatus.connected ? 'Connected and syncing' : 'Connection failed'}
                                                </p>
                                            </div>
                                        </div>
                                        <span style={{
                                            padding: '6px 14px',
                                            borderRadius: 16,
                                            fontSize: 12,
                                            fontWeight: 600,
                                            background: oneDriveStatus.connected ? '#d1fae5' : '#fee2e2',
                                            color: oneDriveStatus.connected ? '#065f46' : '#991b1b',
                                        }}>
                                            {oneDriveStatus.connected ? 'Connected' : 'Disconnected'}
                                        </span>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                        <div>
                                            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Last Sync</p>
                                            <p style={{ margin: 0, fontSize: 14, color: '#111', fontWeight: 500 }}>
                                                {oneDriveStatus.lastSync}
                                            </p>
                                        </div>
                                        <div>
                                            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Total Reports</p>
                                            <p style={{ margin: 0, fontSize: 14, color: '#111', fontWeight: 500 }}>
                                                {totalReports}
                                            </p>
                                        </div>
                                        <div>
                                            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Folder Structure</p>
                                            <p style={{ margin: 0, fontSize: 14, color: '#111', fontWeight: 500 }}>
                                                /Reports/Domain/Year/Month/
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="tab-content" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>Notifications</h3>
                                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>
                                    System notifications and alerts
                                </p>
                            </div>
                            <div style={{ padding: '20px' }}>
                                {notifications.map((notification) => (
                                    <div key={notification.id} className="notification-item" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '16px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 8,
                                        marginBottom: '12px',
                                        background: notification.read ? '#fff' : '#f8fafc',
                                        cursor: 'pointer'
                                    }} onClick={() => {
                                        setNotifications(prev =>
                                            prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
                                        );
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: notification.type === 'report_generated' ? '#dbeafe' :
                                                notification.type === 'onedrive_sync' ? '#d1fae5' : '#fef3c7',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {notification.type === 'report_generated' && <FileText style={{ width: 20, height: 20, color: '#1e40af' }} />}
                                            {notification.type === 'onedrive_sync' && <Cloud style={{ width: 20, height: 20, color: '#10b981' }} />}
                                            {notification.type === 'admin_notification' && <Bell style={{ width: 20, height: 20, color: '#f59e0b' }} />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: '#111' }}>
                                                {notification.message}
                                            </p>
                                            <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
                                                {notification.time}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: '#dc2626'
                                            }} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Domain Reports Tab */}
                    {activeTab === 'domain-reports' && (
                        <div className="tab-content" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>Domain Reports</h3>
                                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>
                                    View reports organized by domain
                                </p>
                            </div>
                            <div style={{ padding: '20px' }}>
                                {Object.entries(domainReports).map(([domain, reports]) => (
                                    <div key={domain} style={{ marginBottom: '24px' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            marginBottom: '16px',
                                            padding: '12px',
                                            background: '#f8fafc',
                                            borderRadius: '8px',
                                            border: '1px solid #e5e7eb'
                                        }}>
                                            <Folder style={{ width: 24, height: 24, color: '#0473EA' }} />
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#111' }}>{domain}</h4>
                                                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>
                                                    {reports.length} reports available
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
                                            {reports.map((report) => (
                                                <div key={report.id} className="report-card" style={{
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    padding: '16px',
                                                    background: '#fff',
                                                    cursor: 'pointer'
                                                }} onClick={() => {
                                                    alert(`Report Details:\n\nName: ${report.name}\nType: ${report.type}\nSize: ${report.size}\nGenerated: ${report.generated}\nStatus: ${report.status}`);
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                        <h5 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#111' }}>
                                                            {report.name}
                                                        </h5>
                                                        <span style={{
                                                            padding: '4px 8px',
                                                            borderRadius: '12px',
                                                            fontSize: '11px',
                                                            fontWeight: '600',
                                                            background: report.status === 'published' ? '#d1fae5' : '#fef3c7',
                                                            color: report.status === 'published' ? '#065f46' : '#92400e',
                                                        }}>
                                                            {report.status}
                                                        </span>
                                                    </div>
                                                    <p style={{ margin: '0 0 8px', fontSize: 13, color: '#6b7280' }}>
                                                        {report.type}
                                                    </p>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6b7280' }}>
                                                        <span>{report.size}</span>
                                                        <span>{report.generated}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Monitoring Tab */}
                    {activeTab === 'monitoring' && (
                        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>OneDrive Storage Connections</h3>
                                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>
                                    Monitor OneDrive connections and detect new reports
                                </p>
                            </div>
                            <div style={{ padding: '20px' }}>
                                {storageConnections.map((conn) => (
                                    <div
                                        key={conn.id}
                                        style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: 10,
                                            padding: '16px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: 16,
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <div
                                                style={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 10,
                                                    background: '#eff6ff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Cloud style={{ width: 24, height: 24, color: '#0473EA' }} />
                                            </div>
                                            <div>
                                                <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600, color: '#111' }}>{conn.name}</p>
                                                <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
                                                    {conn.organization} • {conn.reports} reports • Last sync: {conn.lastSync}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                            <span
                                                style={{
                                                    padding: '6px 14px',
                                                    borderRadius: 16,
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    background: conn.status === 'active' ? '#d1fae5' : '#fef3c7',
                                                    color: conn.status === 'active' ? '#065f46' : '#92400e',
                                                }}
                                            >
                                                {conn.status === 'active' ? 'Active' : 'Syncing'}
                                            </span>
                                            <button
                                                onClick={() => handleCheckForUpdates(conn.id)}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: 6,
                                                    border: '1px solid #e5e7eb',
                                                    background: '#fff',
                                                    color: '#333',
                                                    cursor: 'pointer',
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Check for Updates
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sync Tab */}
                    {activeTab === 'sync' && (
                        <div>
                            {failedOperations.length > 0 && (
                                <div
                                    style={{
                                        background: '#fef2f2',
                                        border: '1px solid #fecaca',
                                        borderRadius: 12,
                                        padding: '20px',
                                        marginBottom: 24,
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#991b1b' }}>
                                            {failedOperations.length} failed operation
                                        </p>
                                        <button
                                            onClick={handleRetryAllFailed}
                                            style={{
                                                padding: '6px 14px',
                                                borderRadius: 6,
                                                border: '1px solid #dc2626',
                                                background: '#fff',
                                                color: '#dc2626',
                                                cursor: 'pointer',
                                                fontSize: 13,
                                                fontWeight: 600,
                                            }}
                                        >
                                            Retry all failed
                                        </button>
                                    </div>
                                    {failedOperations.map((op) => (
                                        <div
                                            key={op.id}
                                            style={{
                                                background: '#fff',
                                                border: '1px solid #fecaca',
                                                borderRadius: 8,
                                                padding: '16px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div>
                                                <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#111' }}>
                                                    {op.source} – {op.organization}
                                                </p>
                                                <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
                                                    {op.files} files · {op.time}
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                {getStatusBadge('failed')}
                                                <button
                                                    onClick={() => handleRetryFailed(op.id)}
                                                    style={{
                                                        padding: '6px 14px',
                                                        borderRadius: 6,
                                                        border: '1px solid #e5e7eb',
                                                        background: '#fff',
                                                        color: '#333',
                                                        cursor: 'pointer',
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Retry
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                                <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
                                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>Sync Operations</h3>
                                    <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>Fetch and transfer reports from OneDrive</p>
                                </div>
                                <div style={{ padding: '20px' }}>
                                    {syncJobs.map((job) => (
                                        <div key={job.id} style={{ marginBottom: 20 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                                <div>
                                                    <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#111' }}>
                                                        {job.source} – {job.organization}
                                                    </p>
                                                    <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
                                                        {job.files} files · {job.time}
                                                    </p>
                                                </div>
                                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                    {getStatusBadge(job.status)}
                                                    {job.status === 'in-progress' && (
                                                        <button
                                                            onClick={() => handleCancelJob(job.id)}
                                                            style={{
                                                                padding: '6px 14px',
                                                                borderRadius: 6,
                                                                border: '1px solid #e5e7eb',
                                                                background: '#fff',
                                                                color: '#333',
                                                                cursor: 'pointer',
                                                                fontSize: 13,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                    {job.status === 'failed' && (
                                                        <button
                                                            onClick={() => handleRetryFailed(job.id)}
                                                            style={{
                                                                padding: '6px 14px',
                                                                borderRadius: 6,
                                                                border: '1px solid #e5e7eb',
                                                                background: '#fff',
                                                                color: '#333',
                                                                cursor: 'pointer',
                                                                fontSize: 13,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Retry
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            {job.status !== 'pending' && progressBar(job.progress, job.status)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Validation Tab */}
                    {activeTab === 'validation' && (
                        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>Validation Queue</h3>
                                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>
                                    Validate file integrity, format, and metadata before publishing
                                </p>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Report Name</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Organization</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Source</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Format</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Integrity</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Status</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingValidation.map((report) => (
                                            <tr key={report.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#111', fontWeight: 500 }}>{report.name}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{report.organization}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{report.source}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{report.format}</td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <span
                                                        style={{
                                                            padding: '4px 10px',
                                                            borderRadius: 12,
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                            background: report.integrity === 'Pass' ? '#d1fae5' : '#fef3c7',
                                                            color: report.integrity === 'Pass' ? '#065f46' : '#92400e',
                                                        }}
                                                    >
                                                        {report.integrity}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 20px' }}>{getStatusBadge(report.status)}</td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        <button
                                                            onClick={() => handleApproveReport(report.id)}
                                                            style={{
                                                                padding: '6px 12px',
                                                                borderRadius: 6,
                                                                border: 'none',
                                                                background: '#0473EA',
                                                                color: '#fff',
                                                                cursor: 'pointer',
                                                                fontSize: 13,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Approve & Publish
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectReport(report.id)}
                                                            style={{
                                                                padding: '6px 12px',
                                                                borderRadius: 6,
                                                                border: '1px solid #e5e7eb',
                                                                background: '#fff',
                                                                color: '#dc2626',
                                                                cursor: 'pointer',
                                                                fontSize: 13,
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Published Tab */}
                    {activeTab === 'published' && (
                        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>Published Reports</h3>
                                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>Reports available to subscribers with notification status</p>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Report Name</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Organization</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Published At</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Subscribers</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Downloads</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Notifications</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {publishedReports.map((report) => (
                                            <tr key={report.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#111', fontWeight: 500 }}>{report.name}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{report.organization}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{report.publishedAt}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{report.subscribers}</td>
                                                <td style={{ padding: '16px 20px', fontSize: 14, color: '#6b7280' }}>{report.downloads}</td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <span
                                                        style={{
                                                            padding: '4px 10px',
                                                            borderRadius: 12,
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                            background: report.notifications === 'Sent' ? '#d1fae5' : '#fef3c7',
                                                            color: report.notifications === 'Sent' ? '#065f46' : '#92400e',
                                                        }}
                                                    >
                                                        {report.notifications}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <button
                                                        onClick={() => report.notifications === 'Pending' ? handleSendNotifications(report.id) : handleViewDetails(report.id)}
                                                        style={{
                                                            padding: '6px 12px',
                                                            borderRadius: 6,
                                                            border: 'none',
                                                            background: 'transparent',
                                                            color: '#0473EA',
                                                            cursor: 'pointer',
                                                            fontSize: 13,
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {report.notifications === 'Pending' ? 'Send Notifications' : 'View Details'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OpsDashboard;
