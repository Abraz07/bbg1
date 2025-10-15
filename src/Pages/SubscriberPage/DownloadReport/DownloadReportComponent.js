import React, { useState } from 'react';
import './DownloadReport.css';
import { useNavigate, Routes, Route } from 'react-router-dom';

import PDFViewer from '../PDFViewer/PDFViewer';
const PDF_FILE = "http://localhost:3000/Database_Fundamentals.pdf";

const DownloadReportComponent = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterFormat, setFilterFormat] = useState('all');
    const [selectedReport, setSelectedReport] = useState(null);

    const [reports, setReports] = useState([
        { id: 1, fileName: 'Q4_2024_Equities_Market_Analysis', title: 'Q4 2024 Equities Market Analysis', description: 'Comprehensive quarterly equity market analysis with sector breakdowns', category: 'Equities', formats: ['pdf', 'xlsx', 'csv'], size: { pdf: '2.4 MB', xlsx: '1.8 MB', csv: '950 KB' }, publishedDate: '15 Dec 2024', downloads: 145, version: 'v1.2', recommendedFormat: 'pdf' },
        { id: 2, fileName: 'FX_Trading_Weekly_Summary', title: 'FX Trading Weekly Summary', description: 'Foreign exchange trading summary with currency pair analysis', category: 'FX', formats: ['xlsx', 'csv', 'pdf'], size: { pdf: '1.2 MB', xlsx: '856 KB', csv: '420 KB' }, publishedDate: '18 Dec 2024', downloads: 98, version: 'v2.0', recommendedFormat: 'xlsx' },
        { id: 3, fileName: 'Commodities_Outlook_2025', title: 'Commodities Outlook 2025', description: 'Annual commodities forecast covering energy, metals, and agriculture', category: 'Commodities', formats: ['pdf', 'xlsx'], size: { pdf: '3.1 MB', xlsx: '2.2 MB' }, publishedDate: '10 Dec 2024', downloads: 203, version: 'v1.0', recommendedFormat: 'pdf' }
    ]);

    const filteredReports = reports.filter(r => {
        const search = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.category.toLowerCase().includes(searchQuery.toLowerCase());
        const cat = filterCategory === 'all' || r.category === filterCategory;
        const fmt = filterFormat === 'all' || r.formats.includes(filterFormat);
        return search && cat && fmt;
    });

    const handleDownload = (url) => {
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                const blobURL = window.URL.createObjectURL(new Blob([blob]));
                const fileName = url.split("/").pop();
                const aTag = document.createElement("a");
                aTag.href = url;
                aTag.setAttribute("download", fileName);
                document.body.appendChild(aTag);
                aTag.click();
                aTag.remove();

            });
    };
    const handlePreview = (reportId) => {
        navigate(`dashboard/preview/${reportId}`);
    };
    const categoryColors = { 'Equities': 'primary', 'FX': 'purple', 'Commodities': 'warning' };
    const formatColors = { 'pdf': 'danger', 'xlsx': 'success', 'csv': 'info' };

    return (
        <>

            <div className="container-fluid py-5" style={{ background: '#e8f0f5' }}>
                <div className="container" style={{ maxWidth: '1200px' }}>
                    {/* Hero */}
                    <div className="text-center mb-5">
                        <h1 className="display-5 fw-bold text-dark mb-2">Download Reports</h1>
                        <p className="text-secondary mb-4">Access and download your approved reports in multiple formats</p>
                        <div className="d-flex justify-content-center gap-3 flex-wrap">
                            <div className="bg-white rounded-3 shadow-sm p-3 text-center" style={{ minWidth: '140px' }}>
                                <div className="display-6 fw-bold stat-number">{filteredReports.length}</div>
                                <small className="text-secondary">Available Reports</small>
                            </div>
                            <div className="bg-white rounded-3 shadow-sm p-3 text-center" style={{ minWidth: '140px' }}>
                                <div className="display-6 fw-bold stat-number">{reports.reduce((t, r) => t + r.downloads, 0)}</div>
                                <small className="text-secondary">Total Downloads</small>
                            </div>
                            <div className="bg-white rounded-3 shadow-sm p-3 text-center" style={{ minWidth: '140px' }}>
                                <div className="display-6 fw-bold stat-number">{new Set(reports.map(r => r.category)).size}</div>
                                <small className="text-secondary">Categories</small>
                            </div>
                        </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-semibold text-secondary">Category</label>
                                    <div className="btn-group d-flex" role="group">
                                        {['all', 'Equities', 'FX', 'Commodities'].map(cat => (
                                            <button key={cat} className={`btn btn-sm btn-outline-secondary filter-btn ${filterCategory === cat ? 'active' : ''}`} onClick={() => setFilterCategory(cat)}>
                                                {cat === 'all' ? 'All' : cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-semibold text-secondary">Format</label>
                                    <div className="btn-group d-flex" role="group">
                                        {['all', 'pdf', 'xlsx', 'csv'].map(fmt => (
                                            <button key={fmt} className={`btn btn-sm btn-outline-secondary filter-btn ${filterFormat === fmt ? 'active' : ''}`} onClick={() => setFilterFormat(fmt)}>
                                                {fmt === 'all' ? 'All' : fmt.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <input type="text" className="form-control form-control-lg border-0 bg-light" placeholder="Search by file name, title, or category..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                    </div>

                    {/* Reports */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-semibold text-dark mb-0">Your Reports</h5>
                        <small className="text-secondary">Showing {filteredReports.length} of {reports.length}</small>
                    </div>

                    {filteredReports.length === 0 ? (
                        <div className="text-center py-5"><p className="text-secondary mt-3 fs-5">No reports found</p></div>
                    ) : (
                        <div className="row g-3">
                            {filteredReports.map(r => (
                                <div key={r.id} className="col-12">
                                    <div className="card border-0 shadow-sm report-card">
                                        <div className="card-body p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div className="flex-grow-1">
                                                    <h5 className="fw-bold text-dark mb-2">{r.title}</h5>
                                                    <code className="small bg-light text-primary p-2 rounded">{r.fileName}</code>
                                                </div>
                                                <span className={`badge bg-${categoryColors[r.category]} ms-3`}>{r.category}</span>
                                            </div>
                                            <p className="text-secondary mb-3">{r.description}</p>
                                            <div className="d-flex gap-3 mb-3 pb-3 border-bottom flex-wrap">
                                                <small className="text-secondary">{r.publishedDate}</small>
                                                <small className="text-secondary">{r.version}</small>
                                                <small className="text-secondary">{r.downloads} downloads</small>
                                            </div>
                                            <div className="mb-3">
                                                <small className="text-secondary fw-semibold d-block mb-2">Available Formats:</small>
                                                <div className="d-flex gap-2 flex-wrap">
                                                    {r.formats.map(fmt => (
                                                        <span key={fmt} className={`badge bg-${formatColors[fmt]} bg-opacity-25 text-${formatColors[fmt]}`}>{fmt.toUpperCase()}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button className="btn-download-sm" onClick={() => setSelectedReport(r)}>Download</button>
                                                <button className="btn btn-outline-secondary"
                                                    onClick={() => handlePreview(r.id)}
                                                >Preview</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <Routes>
                    <Route
                        path="/preview/:reportId"
                        element={<PDFViewer />}
                    />
                </Routes>

                {/* Modal */}
                {selectedReport && (
                    <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedReport(null)}>
                        <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
                            <div className="modal-content border-0 shadow-lg">
                                <div className="modal-header border-0">
                                    <div>
                                        <h5 className="modal-title fw-bold">Select Download Format</h5>
                                        <p className="text-secondary small mb-0">Choose your preferred file format</p>
                                        <code className="small bg-light text-primary p-2 rounded d-inline-block mt-2">{selectedReport.fileName}</code>
                                    </div>
                                    <button type="button" className="btn-close" onClick={() => setSelectedReport(null)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="d-flex flex-column gap-2">
                                        {selectedReport.formats.map(fmt => (
                                            <div key={fmt} className={`border rounded-3 p-3 d-flex justify-content-between align-items-center ${fmt === selectedReport.recommendedFormat ? 'border-success border-2 bg-success bg-opacity-10' : ''}`}>
                                                <div>
                                                    <div className="fw-bold text-dark">
                                                        {fmt.toUpperCase()}
                                                        {fmt === selectedReport.recommendedFormat && <span className="badge bg-success ms-2 small">RECOMMENDED</span>}
                                                    </div>
                                                    <small className="text-secondary">Size: {selectedReport.size[fmt]}</small>
                                                </div>
                                                <button className="btn-download-sm" onClick={() => handleDownload(PDF_FILE)}>Download</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default DownloadReportComponent;