// PDF Generation Utility
// This utility simulates PDF generation for the Ops Dashboard

export const generateRandomReport = (domain) => {
    const reportTypes = [
        'Financial Analysis',
        'Risk Assessment',
        'Operational Metrics',
        'Performance Review',
        'Compliance Report',
        'Audit Summary',
        'Budget Analysis',
        'Quality Assurance',
        'Security Report',
        'Compliance Audit',
        'Monthly Summary',
        'Quarterly Review'
    ];

    const reportType = reportTypes[Math.floor(Math.random() * reportTypes.length)];
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportName = `${domain}_${reportType.replace(/\s+/g, '_')}_${timestamp}.pdf`;

    // Generate random report data
    const reportData = {
        id: Date.now() + Math.random(),
        name: reportName,
        domain: domain,
        type: reportType,
        size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
        generatedAt: new Date().toLocaleString(),
        status: 'generated',
        content: generateReportContent(domain, reportType),
        pages: Math.floor(Math.random() * 20) + 5,
        author: 'System Generated',
        version: '1.0'
    };

    return reportData;
};

const generateReportContent = (domain, reportType) => {
    const contentTemplates = {
        'Financial Analysis': {
            sections: ['Executive Summary', 'Revenue Analysis', 'Cost Breakdown', 'Profit Margins', 'Financial Projections'],
            data: ['Revenue increased by 12%', 'Operating costs reduced by 8%', 'Net profit margin improved to 15%']
        },
        'Risk Assessment': {
            sections: ['Risk Overview', 'Identified Risks', 'Risk Mitigation', 'Monitoring Plan', 'Recommendations'],
            data: ['3 high-risk items identified', '5 medium-risk items monitored', 'Risk score: 7.2/10']
        },
        'Operational Metrics': {
            sections: ['KPI Overview', 'Performance Trends', 'Efficiency Metrics', 'Resource Utilization', 'Improvement Areas'],
            data: ['Overall efficiency: 87%', 'Resource utilization: 92%', 'Customer satisfaction: 4.3/5']
        },
        'Performance Review': {
            sections: ['Performance Summary', 'Key Achievements', 'Areas for Improvement', 'Goals Met', 'Next Quarter Targets'],
            data: ['95% of quarterly goals achieved', 'Team productivity up 15%', 'Customer retention: 94%']
        },
        'Compliance Report': {
            sections: ['Compliance Status', 'Regulatory Requirements', 'Audit Findings', 'Corrective Actions', 'Compliance Score'],
            data: ['100% regulatory compliance', '2 minor findings addressed', 'Compliance score: 98/100']
        }
    };

    const template = contentTemplates[reportType] || contentTemplates['Operational Metrics'];

    return {
        title: `${reportType} - ${domain}`,
        generatedAt: new Date().toLocaleString(),
        sections: template.sections,
        keyData: template.data,
        summary: `This ${reportType.toLowerCase()} report for ${domain} provides comprehensive insights into current performance metrics and operational status.`,
        recommendations: [
            'Continue current operational practices',
            'Monitor key performance indicators',
            'Review and update processes quarterly',
            'Maintain compliance standards'
        ]
    };
};

export const simulatePDFGeneration = async (reportData) => {
    // Simulate PDF generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real application, this would use a PDF library like jsPDF or PDFKit
    const pdfBlob = {
        name: reportData.name,
        size: reportData.size,
        type: 'application/pdf',
        content: reportData.content,
        metadata: {
            title: reportData.content.title,
            author: reportData.author,
            created: reportData.generatedAt,
            pages: reportData.pages,
            version: reportData.version
        }
    };

    return pdfBlob;
};

export const generateOneDriveFolderPath = (domain, reportType) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `/Reports/${domain}/${year}/${month}/${day}/`;
};

export const simulateOneDriveUpload = async (pdfBlob, domain) => {
    // Simulate OneDrive API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const folderPath = generateOneDriveFolderPath(domain, pdfBlob.metadata.title);

    return {
        success: true,
        folderPath: folderPath,
        oneDriveUrl: `https://onedrive.live.com/reports${folderPath}${pdfBlob.name}`,
        uploadedAt: new Date().toLocaleString(),
        fileId: `onedrive_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
};

export const generateNotification = (type, data) => {
    const notifications = {
        report_generated: {
            message: `New ${data.reportType} report generated for ${data.domain}`,
            type: 'success',
            icon: 'file-text'
        },
        onedrive_sync: {
            message: `Report successfully uploaded to OneDrive: ${data.folderPath}`,
            type: 'success',
            icon: 'cloud'
        },
        admin_notification: {
            message: `Admin has been notified about new reports in ${data.domain}`,
            type: 'info',
            icon: 'bell'
        },
        generation_error: {
            message: `Error generating report for ${data.domain}: ${data.error}`,
            type: 'error',
            icon: 'alert-circle'
        },
        sync_error: {
            message: `OneDrive sync failed for ${data.domain}: ${data.error}`,
            type: 'error',
            icon: 'cloud-off'
        }
    };

    return {
        id: Date.now() + Math.random(),
        type: type,
        message: notifications[type]?.message || 'Unknown notification',
        time: 'Just now',
        read: false,
        icon: notifications[type]?.icon || 'bell',
        severity: notifications[type]?.type || 'info'
    };
};

