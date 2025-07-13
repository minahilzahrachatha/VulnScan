// Reports and Analytics Module
class ReportsManager {
    constructor() {
        this.reports = [];
        this.filters = {
            dateRange: 7,
            severity: 'all',
            status: 'all'
        };
        this.init();
    }

    init() {
        this.loadMockReports();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Date range filter
        const dateRangeSelect = document.getElementById('date-range');
        if (dateRangeSelect) {
            dateRangeSelect.addEventListener('change', (e) => {
                this.filters.dateRange = parseInt(e.target.value);
                this.renderReports();
            });
        }

        // Severity filter
        const severityFilter = document.getElementById('severity-filter');
        if (severityFilter) {
            severityFilter.addEventListener('change', (e) => {
                this.filters.severity = e.target.value;
                this.renderReports();
            });
        }
    }

    loadMockReports() {
        // Generate mock reports for demonstration
        const mockData = [
            {
                id: 'rpt_001',
                url: 'example.com',
                scanDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                scanType: 'comprehensive',
                status: 'completed',
                vulnerabilities: {
                    critical: 2,
                    high: 5,
                    medium: 8,
                    low: 12
                },
                totalVulnerabilities: 27,
                securityScore: 65,
                duration: 180000 // 3 minutes
            },
            {
                id: 'rpt_002',
                url: 'testsite.org',
                scanDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                scanType: 'quick',
                status: 'completed',
                vulnerabilities: {
                    critical: 0,
                    high: 2,
                    medium: 4,
                    low: 6
                },
                totalVulnerabilities: 12,
                securityScore: 78,
                duration: 45000 // 45 seconds
            },
            {
                id: 'rpt_003',
                url: 'webapp.net',
                scanDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
                scanType: 'deep',
                status: 'completed',
                vulnerabilities: {
                    critical: 4,
                    high: 8,
                    medium: 15,
                    low: 20
                },
                totalVulnerabilities: 47,
                securityScore: 45,
                duration: 420000 // 7 minutes
            },
            {
                id: 'rpt_004',
                url: 'secure-app.com',
                scanDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
                scanType: 'comprehensive',
                status: 'completed',
                vulnerabilities: {
                    critical: 0,
                    high: 1,
                    medium: 2,
                    low: 3
                },
                totalVulnerabilities: 6,
                securityScore: 92,
                duration: 150000 // 2.5 minutes
            },
            {
                id: 'rpt_005',
                url: 'vulnerable-site.com',
                scanDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
                scanType: 'deep',
                status: 'failed',
                vulnerabilities: {
                    critical: 0,
                    high: 0,
                    medium: 0,
                    low: 0
                },
                totalVulnerabilities: 0,
                securityScore: 0,
                duration: 0,
                error: 'Connection timeout'
            }
        ];

        this.reports = mockData;
    }

    getFilteredReports() {
        const cutoffDate = new Date(Date.now() - this.filters.dateRange * 24 * 60 * 60 * 1000);
        
        return this.reports.filter(report => {
            // Date filter
            if (report.scanDate < cutoffDate) return false;
            
            // Severity filter
            if (this.filters.severity !== 'all') {
                const hasVulnOfSeverity = report.vulnerabilities[this.filters.severity] > 0;
                if (!hasVulnOfSeverity) return false;
            }
            
            // Status filter
            if (this.filters.status !== 'all' && report.status !== this.filters.status) {
                return false;
            }
            
            return true;
        });
    }

    renderReports() {
        const reportsGrid = document.getElementById('reports-grid');
        if (!reportsGrid) return;

        const filteredReports = this.getFilteredReports();
        
        if (filteredReports.length === 0) {
            reportsGrid.innerHTML = `
                <div class="no-reports">
                    <i class="fas fa-search"></i>
                    <h3>No reports found</h3>
                    <p>No reports match your current filters. Try adjusting the date range or severity filter.</p>
                </div>
            `;
            return;
        }

        reportsGrid.innerHTML = filteredReports.map(report => this.renderReportCard(report)).join('');
    }

    renderReportCard(report) {
        const highestSeverity = this.getHighestSeverity(report.vulnerabilities);
        const formattedDate = this.formatDate(report.scanDate);
        const formattedDuration = this.formatDuration(report.duration);

        return `
            <div class="report-card" data-report-id="${report.id}">
                <div class="report-header">
                    <div class="report-info">
                        <div class="report-url">${report.url}</div>
                        <div class="report-meta">
                            <span class="report-date">${formattedDate}</span>
                            <span class="report-type">${report.scanType}</span>
                            <span class="report-duration">${formattedDuration}</span>
                        </div>
                    </div>
                    <div class="report-status">
                        <span class="status-badge status-${report.status}">${report.status}</span>
                        ${highestSeverity ? `<span class="severity-badge severity-${highestSeverity}">${highestSeverity}</span>` : ''}
                    </div>
                </div>
                
                <div class="report-content">
                    ${report.status === 'completed' ? this.renderCompletedReport(report) : this.renderFailedReport(report)}
                </div>
                
                <div class="report-actions">
                    ${report.status === 'completed' ? `
                        <button class="btn btn-primary btn-sm" onclick="reportsManager.viewReport('${report.id}')">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="reportsManager.downloadReport('${report.id}')">
                            <i class="fas fa-download"></i> Download
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="reportsManager.compareReport('${report.id}')">
                            <i class="fas fa-chart-line"></i> Compare
                        </button>
                    ` : `
                        <button class="btn btn-primary btn-sm" onclick="reportsManager.retryReport('${report.id}')">
                            <i class="fas fa-redo"></i> Retry Scan
                        </button>
                    `}
                </div>
            </div>
        `;
    }

    renderCompletedReport(report) {
        return `
            <div class="vulnerability-summary">
                <div class="summary-item">
                    <span class="summary-number">${report.totalVulnerabilities}</span>
                    <span class="summary-label">Total Issues</span>
                </div>
                <div class="summary-breakdown">
                    ${report.vulnerabilities.critical > 0 ? `<span class="vuln-count critical">${report.vulnerabilities.critical} Critical</span>` : ''}
                    ${report.vulnerabilities.high > 0 ? `<span class="vuln-count high">${report.vulnerabilities.high} High</span>` : ''}
                    ${report.vulnerabilities.medium > 0 ? `<span class="vuln-count medium">${report.vulnerabilities.medium} Medium</span>` : ''}
                    ${report.vulnerabilities.low > 0 ? `<span class="vuln-count low">${report.vulnerabilities.low} Low</span>` : ''}
                </div>
            </div>
            
            <div class="security-score-container">
                <div class="security-score-circle" data-score="${report.securityScore}">
                    <span class="score-value">${report.securityScore}</span>
                    <span class="score-label">Security Score</span>
                </div>
            </div>
        `;
    }

    renderFailedReport(report) {
        return `
            <div class="failed-report">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="error-details">
                    <h4>Scan Failed</h4>
                    <p>${report.error || 'Unknown error occurred during scanning'}</p>
                </div>
            </div>
        `;
    }

    getHighestSeverity(vulnerabilities) {
        if (vulnerabilities.critical > 0) return 'critical';
        if (vulnerabilities.high > 0) return 'high';
        if (vulnerabilities.medium > 0) return 'medium';
        if (vulnerabilities.low > 0) return 'low';
        return null;
    }

    formatDate(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatDuration(milliseconds) {
        if (milliseconds === 0) return 'N/A';
        
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }

    viewReport(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) return;

        // Create detailed report modal
        this.showReportModal(report);
    }

    showReportModal(report) {
        const modal = document.createElement('div');
        modal.className = 'report-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Detailed Report - ${report.url}</h2>
                    <button class="modal-close" onclick="this.closest('.report-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${this.generateDetailedReportContent(report)}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.report-modal').remove()">Close</button>
                    <button class="btn btn-primary" onclick="reportsManager.downloadReport('${report.id}')">
                        <i class="fas fa-download"></i> Download Report
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    generateDetailedReportContent(report) {
        if (report.status !== 'completed') {
            return `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Scan Failed</h3>
                    <p>${report.error}</p>
                </div>
            `;
        }

        // Generate detailed vulnerabilities for this report
        const detailedVulns = this.generateDetailedVulnerabilities(report);

        return `
            <div class="report-overview">
                <div class="overview-grid">
                    <div class="overview-item">
                        <h4>Scan Information</h4>
                        <ul>
                            <li><strong>Target:</strong> ${report.url}</li>
                            <li><strong>Type:</strong> ${report.scanType}</li>
                            <li><strong>Date:</strong> ${report.scanDate.toLocaleString()}</li>
                            <li><strong>Duration:</strong> ${this.formatDuration(report.duration)}</li>
                        </ul>
                    </div>
                    <div class="overview-item">
                        <h4>Security Score</h4>
                        <div class="large-score">
                            <span class="score-number">${report.securityScore}</span>
                            <span class="score-max">/100</span>
                        </div>
                        <div class="score-description">
                            ${this.getScoreDescription(report.securityScore)}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="vulnerability-details">
                <h4>Vulnerability Breakdown</h4>
                <div class="vuln-chart">
                    <div class="chart-bar">
                        <div class="bar-segment critical" style="width: ${(report.vulnerabilities.critical / report.totalVulnerabilities) * 100}%"></div>
                        <div class="bar-segment high" style="width: ${(report.vulnerabilities.high / report.totalVulnerabilities) * 100}%"></div>
                        <div class="bar-segment medium" style="width: ${(report.vulnerabilities.medium / report.totalVulnerabilities) * 100}%"></div>
                        <div class="bar-segment low" style="width: ${(report.vulnerabilities.low / report.totalVulnerabilities) * 100}%"></div>
                    </div>
                    <div class="chart-legend">
                        <span class="legend-item critical">${report.vulnerabilities.critical} Critical</span>
                        <span class="legend-item high">${report.vulnerabilities.high} High</span>
                        <span class="legend-item medium">${report.vulnerabilities.medium} Medium</span>
                        <span class="legend-item low">${report.vulnerabilities.low} Low</span>
                    </div>
                </div>
            </div>

            <div class="detailed-vulnerabilities">
                <h4>Detailed Vulnerability Analysis</h4>
                ${detailedVulns.map(vuln => `
                    <div class="detailed-vuln-card ${vuln.severity}">
                        <div class="vuln-header">
                            <div class="vuln-title">
                                <h5>${vuln.name}</h5>
                                <span class="severity-badge severity-${vuln.severity}">${vuln.severity}</span>
                            </div>
                            <div class="cvss-score">
                                <span class="cvss-label">CVSS</span>
                                <span class="cvss-value">${vuln.cvss}</span>
                            </div>
                        </div>
                        <div class="vuln-content">
                            <div class="vuln-section">
                                <strong>Location:</strong> ${vuln.location}
                            </div>
                            <div class="vuln-section">
                                <strong>Description:</strong> ${vuln.description}
                            </div>
                            <div class="vuln-section">
                                <strong>Impact:</strong> ${vuln.impact}
                            </div>
                            <div class="vuln-section">
                                <strong>Evidence:</strong> <code>${vuln.evidence}</code>
                            </div>
                            <div class="vuln-section">
                                <strong>Remediation:</strong> ${vuln.remediation}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="recommendations">
                <h4>Priority Recommendations</h4>
                ${this.generateRecommendations(report)}
            </div>
        `;
    }

    generateDetailedVulnerabilities(report) {
        // Generate realistic vulnerabilities based on the report data
        const vulnerabilities = [];
        
        // Add critical vulnerabilities
        for (let i = 0; i < report.vulnerabilities.critical; i++) {
            vulnerabilities.push({
                name: 'SQL Injection',
                severity: 'critical',
                cvss: 9.8,
                location: '/login.php',
                description: 'SQL injection vulnerability found in login form parameter "username". The application directly concatenates user input into SQL queries without proper sanitization.',
                impact: 'Complete database compromise, unauthorized access to sensitive data, potential for remote code execution.',
                evidence: 'Error message: "You have an error in your SQL syntax near \'\\\' at line 1"',
                remediation: 'Use parameterized queries and prepared statements. Implement input validation and sanitization. Apply principle of least privilege to database connections.'
            });
        }

        // Add high vulnerabilities
        for (let i = 0; i < report.vulnerabilities.high; i++) {
            vulnerabilities.push({
                name: 'Cross-Site Scripting (XSS)',
                severity: 'high',
                cvss: 7.4,
                location: '/search.php',
                description: 'Reflected XSS vulnerability in search parameter. User input is directly reflected in the HTML response without proper encoding.',
                impact: 'Session hijacking, cookie theft, malicious script execution, phishing attacks.',
                evidence: 'Payload <script>alert(1)</script> was reflected in the response',
                remediation: 'Implement proper input validation and output encoding. Use Content Security Policy (CSP) headers. Sanitize all user inputs.'
            });
        }

        // Add medium vulnerabilities
        for (let i = 0; i < report.vulnerabilities.medium; i++) {
            vulnerabilities.push({
                name: 'Missing Security Headers',
                severity: 'medium',
                cvss: 5.3,
                location: 'Global',
                description: 'Critical security headers are missing from HTTP responses, leaving the application vulnerable to various attacks.',
                impact: 'Increased attack surface, clickjacking vulnerabilities, MIME sniffing attacks.',
                evidence: 'Headers X-Frame-Options, X-Content-Type-Options, X-XSS-Protection not present in response',
                remediation: 'Implement security headers: X-Frame-Options: DENY, X-Content-Type-Options: nosniff, X-XSS-Protection: 1; mode=block, Content-Security-Policy.'
            });
        }

        // Add low vulnerabilities
        for (let i = 0; i < report.vulnerabilities.low; i++) {
            vulnerabilities.push({
                name: 'Information Disclosure',
                severity: 'low',
                cvss: 3.7,
                location: '/robots.txt',
                description: 'Server version and technology stack information is disclosed in HTTP headers and error pages.',
                impact: 'Information leakage that could aid attackers in reconnaissance and targeted attacks.',
                evidence: 'Server: Apache/2.4.41 (Ubuntu) disclosed in response headers',
                remediation: 'Remove or obfuscate server version information. Configure web server to hide technology details. Implement custom error pages.'
            });
        }

        return vulnerabilities;
    }

    getScoreDescription(score) {
        if (score >= 90) return 'Excellent security posture';
        if (score >= 80) return 'Good security with minor issues';
        if (score >= 70) return 'Moderate security, some improvements needed';
        if (score >= 60) return 'Below average security, attention required';
        if (score >= 50) return 'Poor security, immediate action needed';
        return 'Critical security issues, urgent attention required';
    }

    generateRecommendations(report) {
        const recommendations = [];
        
        if (report.vulnerabilities.critical > 0) {
            recommendations.push({
                priority: 'Critical',
                action: 'Address critical vulnerabilities immediately',
                description: 'Critical vulnerabilities pose immediate risk to your application security.'
            });
        }
        
        if (report.vulnerabilities.high > 0) {
            recommendations.push({
                priority: 'High',
                action: 'Fix high-severity vulnerabilities within 24-48 hours',
                description: 'High-severity issues should be prioritized in your next security update.'
            });
        }
        
        if (report.vulnerabilities.medium > 0) {
            recommendations.push({
                priority: 'Medium',
                action: 'Plan remediation for medium-severity issues',
                description: 'Include these fixes in your regular maintenance cycle.'
            });
        }

        if (recommendations.length === 0) {
            recommendations.push({
                priority: 'Maintenance',
                action: 'Continue regular security monitoring',
                description: 'Maintain current security practices and schedule regular scans.'
            });
        }

        return recommendations.map(rec => `
            <div class="recommendation-item">
                <div class="rec-priority priority-${rec.priority.toLowerCase()}">${rec.priority}</div>
                <div class="rec-content">
                    <h5>${rec.action}</h5>
                    <p>${rec.description}</p>
                </div>
            </div>
        `).join('');
    }

    downloadReport(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) return;

        // Generate and download report
        const reportData = this.generateReportData(report);
        this.downloadFile(reportData, `security-report-${report.url}-${report.id}.json`, 'application/json');
        
        if (window.app) {
            window.app.showNotification('Report downloaded successfully', 'success');
        }
    }

    generateReportData(report) {
        return JSON.stringify({
            metadata: {
                reportId: report.id,
                generatedAt: new Date().toISOString(),
                target: report.url,
                scanType: report.scanType,
                scanDate: report.scanDate.toISOString(),
                duration: report.duration,
                status: report.status
            },
            summary: {
                securityScore: report.securityScore,
                totalVulnerabilities: report.totalVulnerabilities,
                vulnerabilityBreakdown: report.vulnerabilities
            },
            recommendations: this.generateRecommendations(report),
            rawData: report
        }, null, 2);
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    compareReport(reportId) {
        if (window.app) {
            window.app.showNotification('Report comparison feature coming soon', 'info');
        }
    }

    retryReport(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) return;

        if (window.app) {
            window.app.showNotification(`Retrying scan for ${report.url}`, 'info');
            // Navigate to scanner page with pre-filled URL
            window.app.navigateToPage('scanner');
            setTimeout(() => {
                const urlInput = document.getElementById('target-url');
                if (urlInput) {
                    urlInput.value = report.url;
                }
            }, 500);
        }
    }

    getAnalytics() {
        const analytics = {
            totalScans: this.reports.length,
            completedScans: this.reports.filter(r => r.status === 'completed').length,
            failedScans: this.reports.filter(r => r.status === 'failed').length,
            averageSecurityScore: 0,
            totalVulnerabilities: 0,
            vulnerabilityTrends: {}
        };

        const completedReports = this.reports.filter(r => r.status === 'completed');
        
        if (completedReports.length > 0) {
            analytics.averageSecurityScore = Math.round(
                completedReports.reduce((sum, r) => sum + r.securityScore, 0) / completedReports.length
            );
            
            analytics.totalVulnerabilities = completedReports.reduce(
                (sum, r) => sum + r.totalVulnerabilities, 0
            );
        }

        return analytics;
    }
}

// Initialize reports manager
document.addEventListener('DOMContentLoaded', () => {
    window.reportsManager = new ReportsManager();
});

// Add modal styles
const modalStyles = `
    .report-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
    }

    .modal-content {
        position: relative;
        background: var(--surface-color);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-xl);
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-color);
        background: var(--primary-color);
        color: white;
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.5rem;
    }

    .modal-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 4px;
        transition: var(--transition);
    }

    .modal-close:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .modal-body {
        padding: 1.5rem;
        overflow-y: auto;
        flex: 1;
    }

    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 1.5rem;
        border-top: 1px solid var(--border-color);
        background: var(--background-color);
    }

    .report-overview {
        margin-bottom: 2rem;
    }

    .overview-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }

    .overview-item h4 {
        margin-bottom: 1rem;
        color: var(--text-primary);
    }

    .overview-item ul {
        list-style: none;
        padding: 0;
    }

    .overview-item li {
        padding: 0.25rem 0;
        color: var(--text-secondary);
    }

    .large-score {
        text-align: center;
        margin-bottom: 1rem;
    }

    .score-number {
        font-size: 3rem;
        font-weight: 700;
        color: var(--primary-color);
    }

    .score-max {
        font-size: 1.5rem;
        color: var(--text-secondary);
    }

    .score-description {
        text-align: center;
        color: var(--text-secondary);
        font-style: italic;
    }

    .vulnerability-details {
        margin-bottom: 2rem;
    }

    .vuln-chart {
        margin-top: 1rem;
    }

    .chart-bar {
        height: 20px;
        background: var(--border-color);
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        margin-bottom: 1rem;
    }

    .bar-segment {
        height: 100%;
    }

    .bar-segment.critical {
        background: var(--critical-color);
    }

    .bar-segment.high {
        background: var(--error-color);
    }

    .bar-segment.medium {
        background: var(--warning-color);
    }

    .bar-segment.low {
        background: var(--success-color);
    }

    .chart-legend {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
    }

    .legend-item::before {
        content: '';
        width: 12px;
        height: 12px;
        border-radius: 2px;
    }

    .legend-item.critical::before {
        background: var(--critical-color);
    }

    .legend-item.high::before {
        background: var(--error-color);
    }

    .legend-item.medium::before {
        background: var(--warning-color);
    }

    .legend-item.low::before {
        background: var(--success-color);
    }

    .recommendation-item {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        padding: 1rem;
        background: var(--background-color);
        border-radius: var(--border-radius);
    }

    .rec-priority {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: uppercase;
        white-space: nowrap;
        height: fit-content;
    }

    .priority-critical {
        background: rgba(220, 38, 38, 0.1);
        color: var(--critical-color);
    }

    .priority-high {
        background: rgba(239, 68, 68, 0.1);
        color: var(--error-color);
    }

    .priority-medium {
        background: rgba(245, 158, 11, 0.1);
        color: var(--warning-color);
    }

    .priority-maintenance {
        background: rgba(16, 185, 129, 0.1);
        color: var(--success-color);
    }

    .rec-content h5 {
        margin: 0 0 0.5rem 0;
        color: var(--text-primary);
    }

    .rec-content p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .no-reports {
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-secondary);
    }

    .no-reports i {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }

    .no-reports h3 {
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }

    .btn-sm {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }

    .report-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    .report-status {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-end;
    }

    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: uppercase;
    }

    .status-completed {
        background: rgba(16, 185, 129, 0.1);
        color: var(--success-color);
    }

    .status-failed {
        background: rgba(239, 68, 68, 0.1);
        color: var(--error-color);
    }

    .vulnerability-summary {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .summary-item {
        text-align: center;
    }

    .summary-number {
        display: block;
        font-size: 2rem;
        font-weight: 700;
        color: var(--primary-color);
    }

    .summary-label {
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    .summary-breakdown {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .vuln-count {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
    }

    .vuln-count.critical {
        background: rgba(220, 38, 38, 0.1);
        color: var(--critical-color);
    }

    .vuln-count.high {
        background: rgba(239, 68, 68, 0.1);
        color: var(--error-color);
    }

    .vuln-count.medium {
        background: rgba(245, 158, 11, 0.1);
        color: var(--warning-color);
    }

    .vuln-count.low {
        background: rgba(16, 185, 129, 0.1);
        color: var(--success-color);
    }

    .security-score-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .security-score-circle {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: conic-gradient(var(--primary-color) var(--score-percentage, 0%), var(--border-color) var(--score-percentage, 0%));
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .security-score-circle::before {
        content: '';
        position: absolute;
        width: 60px;
        height: 60px;
        background: var(--surface-color);
        border-radius: 50%;
    }

    .score-value {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--primary-color);
        z-index: 1;
    }

    .score-label {
        font-size: 0.7rem;
        color: var(--text-secondary);
        z-index: 1;
    }

    .failed-report {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: rgba(239, 68, 68, 0.1);
        border-radius: var(--border-radius);
        color: var(--error-color);
    }

    .error-icon {
        font-size: 2rem;
    }

    .error-details h4 {
        margin: 0 0 0.5rem 0;
    }

    .error-details p {
        margin: 0;
        font-size: 0.9rem;
    }

    .detailed-vulnerabilities {
        margin-top: 2rem;
    }

    .detailed-vuln-card {
        background: var(--surface-color);
        border-radius: var(--border-radius);
        margin-bottom: 1.5rem;
        border-left: 4px solid var(--border-color);
        overflow: hidden;
        transition: var(--transition);
    }

    .detailed-vuln-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
    }

    .detailed-vuln-card.critical {
        border-left-color: var(--critical-color);
    }

    .detailed-vuln-card.high {
        border-left-color: var(--error-color);
    }

    .detailed-vuln-card.medium {
        border-left-color: var(--warning-color);
    }

    .detailed-vuln-card.low {
        border-left-color: var(--success-color);
    }

    .detailed-vuln-card .vuln-header {
        background: var(--background-color);
        padding: 1rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--border-color);
    }

    .vuln-title {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .vuln-title h5 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-primary);
    }

    .cvss-score {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
    }

    .cvss-label {
        font-size: 0.8rem;
        color: var(--text-secondary);
        text-transform: uppercase;
        font-weight: 500;
    }

    .cvss-value {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--primary-color);
        background: rgba(37, 99, 235, 0.1);
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
    }

    .vuln-content {
        padding: 1.5rem;
    }

    .vuln-section {
        margin-bottom: 1rem;
        line-height: 1.6;
    }

    .vuln-section:last-child {
        margin-bottom: 0;
    }

    .vuln-section strong {
        color: var(--text-primary);
        display: inline-block;
        min-width: 100px;
    }

    .vuln-section code {
        background: var(--background-color);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        color: var(--error-color);
        border: 1px solid var(--border-color);
    }

    @media (max-width: 767px) {
        .modal-content {
            margin: 0;
            max-height: 100vh;
            border-radius: 0;
        }

        .overview-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .vulnerability-summary {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
        }

        .chart-legend {
            justify-content: center;
        }

        .report-meta {
            flex-direction: column;
            gap: 0.25rem;
        }

        .report-status {
            align-items: flex-start;
        }

        .detailed-vuln-card .vuln-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
        }

        .vuln-title {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }

        .cvss-score {
            align-self: flex-end;
        }

        .vuln-section strong {
            display: block;
            margin-bottom: 0.25rem;
        }
    }
`;

// Inject modal styles
const modalStyleSheet = document.createElement('style');
modalStyleSheet.textContent = modalStyles;
document.head.appendChild(modalStyleSheet);