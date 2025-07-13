// Main JavaScript for VulnScan Pro
class VulnScanApp {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupPageTransitions();
        this.setupScrollEffects();
        this.setupContactForm();
        this.setupResizeHandler();
        this.loadInitialData();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const footerLinks = document.querySelectorAll('footer a[data-page]');
        const buttons = document.querySelectorAll('button[data-page]');

        // Combine all navigation elements
        const allNavElements = [...navLinks, ...footerLinks, ...buttons];

        allNavElements.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('data-page');
                if (targetPage) {
                    this.navigateToPage(targetPage);
                }
            });
        });
    }

    setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    setupPageTransitions() {
        // Add smooth transitions between pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
        });
    }

    setupScrollEffects() {
        // Navbar scroll effect with throttling
        const navbar = document.getElementById('navbar');
        let lastScrollTop = 0;
        let ticking = false;

        const updateNavbar = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                navbar.style.transform = 'translate3d(0, -100%, 0)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translate3d(0, 0, 0)';
            }
            
            lastScrollTop = scrollTop;

            // Add shadow to navbar when scrolled
            if (scrollTop > 10) {
                navbar.style.boxShadow = 'var(--shadow-lg)';
            } else {
                navbar.style.boxShadow = 'none';
            }
            
            ticking = false;
        };

        const requestNavbarTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestNavbarTick, { passive: true });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translate3d(0, 0, 0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.feature-card, .dashboard-card, .report-card, .stat-card');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translate3d(0, 20px, 0)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            el.style.willChange = 'transform, opacity';
            observer.observe(el);
        });
    }

    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmission(contactForm);
            });
        }
    }

    navigateToPage(pageName) {
        // Prevent navigation if already on the same page
        if (this.currentPage === pageName) return;

        const currentPageElement = document.querySelector('.page.active');
        const targetPageElement = document.getElementById(`${pageName}-page`);
        
        if (!targetPageElement) return;

        // Add fade-out class to current page
        if (currentPageElement) {
            currentPageElement.classList.add('fade-out');
            
            // Wait for fade-out animation to complete
            setTimeout(() => {
                currentPageElement.classList.remove('active', 'fade-out');
                
                // Show target page with smooth transition
                targetPageElement.classList.add('active');
                this.currentPage = pageName;
                
                // Update active nav link
                this.updateActiveNavLink(pageName);
                
                // Smooth scroll to top
                this.smoothScrollToTop();
                
                // Load page-specific data
                this.loadPageData(pageName);
                
                // Trigger entrance animations
                this.triggerPageAnimations(targetPageElement);
            }, 300);
        } else {
            // No current page, show target immediately
            targetPageElement.classList.add('active');
            this.currentPage = pageName;
            this.updateActiveNavLink(pageName);
            this.loadPageData(pageName);
            this.triggerPageAnimations(targetPageElement);
        }
    }

    smoothScrollToTop() {
        // Use requestAnimationFrame for smoother scrolling
        const scrollToTop = () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 0) {
                window.requestAnimationFrame(scrollToTop);
                window.scrollTo(0, currentScroll - (currentScroll / 8));
            }
        };
        scrollToTop();
    }

    triggerPageAnimations(pageElement) {
        // Reset and trigger AOS animations
        const animatedElements = pageElement.querySelectorAll('[data-aos]');
        animatedElements.forEach(el => {
            el.classList.remove('aos-animate');
            // Use requestAnimationFrame to ensure smooth animation
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    el.classList.add('aos-animate');
                });
            });
        });

        // Trigger counter animations if on home page
        if (pageElement.id === 'home-page') {
            setTimeout(() => {
                this.animateHeroStats();
            }, 200);
        }
    }

    updateActiveNavLink(pageName) {
        // Remove active class from all nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active class to current page link
        const activeLink = document.querySelector(`.nav-link[data-page="${pageName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    loadPageData(pageName) {
        switch (pageName) {
            case 'reports':
                this.loadReports();
                break;
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'scanner':
                this.initializeScanner();
                break;
        }
    }

    loadReports() {
        const reportsGrid = document.getElementById('reports-grid');
        if (!reportsGrid) return;

        // Simulate loading reports
        const mockReports = [
            {
                url: 'example.com',
                date: '2024-07-12',
                severity: 'high',
                vulnerabilities: 15,
                status: 'completed'
            },
            {
                url: 'testsite.org',
                date: '2024-07-11',
                severity: 'medium',
                vulnerabilities: 8,
                status: 'completed'
            },
            {
                url: 'webapp.net',
                date: '2024-07-10',
                severity: 'critical',
                vulnerabilities: 23,
                status: 'completed'
            },
            {
                url: 'secure-app.com',
                date: '2024-07-09',
                severity: 'low',
                vulnerabilities: 3,
                status: 'completed'
            }
        ];

        reportsGrid.innerHTML = mockReports.map(report => `
            <div class="report-card">
                <div class="report-header">
                    <div>
                        <div class="report-url">${report.url}</div>
                        <div class="report-date">${this.formatDate(report.date)}</div>
                    </div>
                    <span class="severity-badge severity-${report.severity}">${report.severity}</span>
                </div>
                <div class="report-content">
                    <p><strong>${report.vulnerabilities}</strong> vulnerabilities found</p>
                    <div class="report-actions">
                        <button class="btn btn-primary" onclick="app.viewReport('${report.url}')">
                            <i class="fas fa-eye"></i> View Report
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadDashboardData() {
        // Animate dashboard statistics
        this.animateCounters();
        this.updateSecurityScore();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 30);
        });
    }

    updateSecurityScore() {
        const scoreElement = document.querySelector('.score-number');
        if (scoreElement) {
            const score = parseInt(scoreElement.textContent);
            const circle = document.querySelector('.score-circle');
            if (circle) {
                circle.style.background = `conic-gradient(var(--primary-color) ${score}%, var(--border-color) ${score}%)`;
            }
        }
    }

    initializeScanner() {
        // Initialize scanner functionality
        const startScanBtn = document.getElementById('start-scan');
        if (startScanBtn) {
            startScanBtn.addEventListener('click', () => {
                this.startVulnerabilityScan();
            });
        }
    }

    startVulnerabilityScan() {
        const targetUrl = document.getElementById('target-url').value;
        const scanType = document.getElementById('scan-type').value;
        
        if (!targetUrl) {
            this.showNotification('Please enter a target URL', 'error');
            return;
        }

        if (!this.isValidUrl(targetUrl)) {
            this.showNotification('Please enter a valid URL', 'error');
            return;
        }

        // Show progress
        const progressContainer = document.getElementById('scan-progress');
        const resultsContainer = document.getElementById('results-content');
        
        progressContainer.style.display = 'block';
        resultsContainer.style.display = 'none';

        // Simulate scan progress
        this.simulateScanProgress(targetUrl, scanType);
    }

    simulateScanProgress(url, scanType) {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        const steps = [
            'Initializing scan...',
            'Checking SSL/TLS configuration...',
            'Testing for SQL injection...',
            'Scanning for XSS vulnerabilities...',
            'Checking security headers...',
            'Testing authentication mechanisms...',
            'Analyzing CSRF protection...',
            'Generating report...',
            'Scan completed!'
        ];

        let currentStep = 0;
        const interval = setInterval(() => {
            const progress = ((currentStep + 1) / steps.length) * 100;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = steps[currentStep];

            currentStep++;
            if (currentStep >= steps.length) {
                clearInterval(interval);
                setTimeout(() => {
                    this.showScanResults(url, scanType);
                }, 1000);
            }
        }, 1500);
    }

    showScanResults(url, scanType) {
        const progressContainer = document.getElementById('scan-progress');
        const resultsContainer = document.getElementById('results-content');
        
        progressContainer.style.display = 'none';
        resultsContainer.style.display = 'block';

        // Generate mock results
        const mockResults = this.generateMockResults(url, scanType);
        resultsContainer.innerHTML = mockResults;
    }

    generateMockResults(url, scanType) {
        const vulnerabilities = [
            {
                type: 'SQL Injection',
                severity: 'high',
                description: 'Potential SQL injection vulnerability found in login form',
                location: '/login.php',
                recommendation: 'Use parameterized queries and input validation'
            },
            {
                type: 'Missing Security Headers',
                severity: 'medium',
                description: 'X-Frame-Options header is missing',
                location: 'Global',
                recommendation: 'Add X-Frame-Options: DENY header'
            },
            {
                type: 'Weak SSL Configuration',
                severity: 'low',
                description: 'Server supports weak cipher suites',
                location: 'SSL/TLS',
                recommendation: 'Disable weak cipher suites and enable perfect forward secrecy'
            }
        ];

        return `
            <div class="scan-summary">
                <h3>Scan Results for ${url}</h3>
                <div class="summary-stats">
                    <div class="stat-item">
                        <span class="stat-number high">1</span>
                        <span class="stat-label">High</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number medium">1</span>
                        <span class="stat-label">Medium</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number low">1</span>
                        <span class="stat-label">Low</span>
                    </div>
                </div>
            </div>
            <div class="vulnerabilities-list">
                <h4>Vulnerabilities Found</h4>
                ${vulnerabilities.map(vuln => `
                    <div class="vulnerability-item">
                        <div class="vuln-header">
                            <h5>${vuln.type}</h5>
                            <span class="severity-badge severity-${vuln.severity}">${vuln.severity}</span>
                        </div>
                        <p><strong>Description:</strong> ${vuln.description}</p>
                        <p><strong>Location:</strong> ${vuln.location}</p>
                        <p><strong>Recommendation:</strong> ${vuln.recommendation}</p>
                    </div>
                `).join('')}
            </div>
            <div class="scan-actions">
                <button class="btn btn-primary" onclick="app.downloadReport()">
                    <i class="fas fa-download"></i> Download Report
                </button>
                <button class="btn btn-secondary" onclick="app.startVulnerabilityScan()">
                    <i class="fas fa-redo"></i> Scan Again
                </button>
            </div>
        `;
    }

    handleContactSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<div class="loading"></div> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            form.reset();
            this.showNotification('Message sent successfully!', 'success');
        }, 2000);
    }

    loadInitialData() {
        // Load any initial data needed for the application
        this.updateActiveNavLink('home');
        this.initializeHomePageAnimations();
    }

    initializeHomePageAnimations() {
        // Animate hero stats counters
        this.animateHeroStats();
        
        // Initialize AOS-like animations
        this.initializeScrollAnimations();
        
        // Add parallax effect to hero section
        this.initializeParallaxEffect();
    }

    animateHeroStats() {
        const statNumbers = document.querySelectorAll('.hero-stats .stat-number[data-count]');
        
        const animateCounter = (element) => {
            const target = parseFloat(element.getAttribute('data-count'));
            const duration = 2500; // 2.5 seconds for smoother animation
            let current = 0;
            const startTime = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Use easing function for smoother animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                current = target * easeOutQuart;
                
                if (progress < 1) {
                    element.textContent = current % 1 === 0 ? Math.floor(current).toLocaleString() : current.toFixed(1);
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target % 1 === 0 ? target.toLocaleString() : target.toFixed(1);
                }
            };
            
            requestAnimationFrame(updateCounter);
        };

        // Use Intersection Observer to trigger animation when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    // Add small delay for staggered effect
                    const delay = Array.from(statNumbers).indexOf(entry.target) * 100;
                    setTimeout(() => animateCounter(entry.target), delay);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => observer.observe(stat));
    }

    initializeScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    initializeParallaxEffect() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.3; // Reduced for smoother effect
            
            const heroImage = hero.querySelector('.hero-image');
            if (heroImage) {
                heroImage.style.transform = `translate3d(0, ${parallax}px, 0)`;
            }
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Utility functions
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    viewReport(url) {
        this.showNotification(`Opening detailed report for ${url}`, 'info');
        // In a real application, this would open a detailed report view
    }

    downloadReport() {
        // Generate a comprehensive report
        const reportData = this.generateComprehensiveReport();
        
        // Create and download the report file
        this.downloadFile(reportData.content, reportData.filename, reportData.mimeType);
        
        this.showNotification('Report downloaded successfully', 'success');
    }

    generateComprehensiveReport() {
        const timestamp = new Date().toISOString().split('T')[0];
        const scanData = this.getLastScanData();
        
        // Generate HTML report
        const htmlContent = this.generateHTMLReport(scanData);
        
        return {
            content: htmlContent,
            filename: `vulnerability-report-${timestamp}.html`,
            mimeType: 'text/html'
        };
    }

    getLastScanData() {
        // Get the most recent scan data or generate mock data
        return {
            url: document.getElementById('target-url')?.value || 'example.com',
            scanDate: new Date(),
            scanType: document.getElementById('scan-type')?.value || 'comprehensive',
            vulnerabilities: [
                {
                    name: 'SQL Injection',
                    severity: 'critical',
                    cvss: 9.8,
                    location: '/login.php',
                    description: 'SQL injection vulnerability found in login form parameter "username"',
                    impact: 'Complete database compromise, unauthorized access to sensitive data',
                    remediation: 'Use parameterized queries and input validation. Implement prepared statements.',
                    evidence: 'Error message: "You have an error in your SQL syntax near \'\\\' at line 1"'
                },
                {
                    name: 'Cross-Site Scripting (XSS)',
                    severity: 'high',
                    cvss: 7.4,
                    location: '/search.php',
                    description: 'Reflected XSS vulnerability in search parameter',
                    impact: 'Session hijacking, cookie theft, malicious script execution',
                    remediation: 'Implement proper input validation and output encoding. Use Content Security Policy.',
                    evidence: 'Payload <script>alert(1)</script> was reflected in the response'
                },
                {
                    name: 'Missing Security Headers',
                    severity: 'medium',
                    cvss: 5.3,
                    location: 'Global',
                    description: 'Critical security headers are missing from HTTP responses',
                    impact: 'Increased attack surface, clickjacking vulnerabilities',
                    remediation: 'Implement X-Frame-Options, X-Content-Type-Options, and X-XSS-Protection headers',
                    evidence: 'Headers X-Frame-Options, X-Content-Type-Options not present in response'
                },
                {
                    name: 'Weak SSL Configuration',
                    severity: 'low',
                    cvss: 3.7,
                    location: 'SSL/TLS',
                    description: 'Server supports weak cipher suites and protocols',
                    impact: 'Potential man-in-the-middle attacks, data interception',
                    remediation: 'Disable weak cipher suites, enable perfect forward secrecy, implement HSTS',
                    evidence: 'TLS 1.0 and weak cipher suites detected'
                }
            ],
            summary: {
                totalVulnerabilities: 4,
                critical: 1,
                high: 1,
                medium: 1,
                low: 1,
                securityScore: 72
            }
        };
    }

    generateHTMLReport(scanData) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VulnScan Pro - Security Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f8fafc;
        }
        .header {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            padding: 2rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5rem;
        }
        .header p {
            margin: 0.5rem 0 0 0;
            opacity: 0.9;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        .summary-card {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .summary-number {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        .critical { color: #dc2626; }
        .high { color: #ef4444; }
        .medium { color: #f59e0b; }
        .low { color: #10b981; }
        .vulnerability {
            background: white;
            margin: 1rem 0;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-left: 5px solid #ccc;
        }
        .vulnerability.critical { border-left-color: #dc2626; }
        .vulnerability.high { border-left-color: #ef4444; }
        .vulnerability.medium { border-left-color: #f59e0b; }
        .vulnerability.low { border-left-color: #10b981; }
        .vuln-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        .vuln-title {
            font-size: 1.25rem;
            font-weight: bold;
            margin: 0;
        }
        .severity-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
            text-transform: uppercase;
        }
        .severity-badge.critical {
            background: rgba(220, 38, 38, 0.1);
            color: #dc2626;
        }
        .severity-badge.high {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
        }
        .severity-badge.medium {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
        }
        .severity-badge.low {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
        }
        .vuln-detail {
            margin: 0.5rem 0;
        }
        .vuln-detail strong {
            color: #1f2937;
        }
        .footer {
            text-align: center;
            margin-top: 3rem;
            padding: 2rem;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        @media print {
            body { background: white; }
            .summary { grid-template-columns: repeat(4, 1fr); }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🛡️ VulnScan Pro Security Report</h1>
        <p>Comprehensive Vulnerability Assessment</p>
        <p><strong>Target:</strong> ${scanData.url} | <strong>Date:</strong> ${scanData.scanDate.toLocaleDateString()} | <strong>Type:</strong> ${scanData.scanType}</p>
    </div>

    <div class="summary">
        <div class="summary-card">
            <div class="summary-number">${scanData.summary.totalVulnerabilities}</div>
            <div>Total Vulnerabilities</div>
        </div>
        <div class="summary-card">
            <div class="summary-number critical">${scanData.summary.critical}</div>
            <div>Critical</div>
        </div>
        <div class="summary-card">
            <div class="summary-number high">${scanData.summary.high}</div>
            <div>High</div>
        </div>
        <div class="summary-card">
            <div class="summary-number medium">${scanData.summary.medium}</div>
            <div>Medium</div>
        </div>
        <div class="summary-card">
            <div class="summary-number low">${scanData.summary.low}</div>
            <div>Low</div>
        </div>
        <div class="summary-card">
            <div class="summary-number" style="color: #2563eb;">${scanData.summary.securityScore}</div>
            <div>Security Score</div>
        </div>
    </div>

    <h2>🔍 Vulnerability Details</h2>
    ${scanData.vulnerabilities.map(vuln => `
        <div class="vulnerability ${vuln.severity}">
            <div class="vuln-header">
                <h3 class="vuln-title">${vuln.name}</h3>
                <span class="severity-badge ${vuln.severity}">${vuln.severity}</span>
            </div>
            <div class="vuln-detail"><strong>CVSS Score:</strong> ${vuln.cvss}</div>
            <div class="vuln-detail"><strong>Location:</strong> ${vuln.location}</div>
            <div class="vuln-detail"><strong>Description:</strong> ${vuln.description}</div>
            <div class="vuln-detail"><strong>Impact:</strong> ${vuln.impact}</div>
            <div class="vuln-detail"><strong>Remediation:</strong> ${vuln.remediation}</div>
            <div class="vuln-detail"><strong>Evidence:</strong> <code>${vuln.evidence}</code></div>
        </div>
    `).join('')}

    <div class="footer">
        <h3>📊 Report Summary</h3>
        <p>This report was generated by VulnScan Pro on ${scanData.scanDate.toLocaleString()}.</p>
        <p>For questions about this report or remediation assistance, contact our security team.</p>
        <p><strong>VulnScan Pro</strong> - Securing the web, one scan at a time.</p>
    </div>
</body>
</html>`;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    setupResizeHandler() {
        let resizeTimeout;
        
        const handleResize = () => {
            // Clear existing timeout
            clearTimeout(resizeTimeout);
            
            // Set new timeout for debounced resize
            resizeTimeout = setTimeout(() => {
                // Recalculate animations and layouts
                this.recalculateAnimations();
            }, 250);
        };

        window.addEventListener('resize', handleResize, { passive: true });
    }

    recalculateAnimations() {
        // Reset any animations that depend on viewport size
        const animatedElements = document.querySelectorAll('[data-aos]');
        animatedElements.forEach(el => {
            if (el.classList.contains('aos-animate')) {
                el.classList.remove('aos-animate');
                requestAnimationFrame(() => {
                    el.classList.add('aos-animate');
                });
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new VulnScanApp();
});

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 90px;
        right: 20px;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 1001;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    }

    .notification-success {
        border-left: 4px solid var(--success-color);
    }

    .notification-error {
        border-left: 4px solid var(--error-color);
    }

    .notification-info {
        border-left: 4px solid var(--primary-color);
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }

    .notification-content i {
        font-size: 1.2rem;
    }

    .notification-success .notification-content i {
        color: var(--success-color);
    }

    .notification-error .notification-content i {
        color: var(--error-color);
    }

    .notification-info .notification-content i {
        color: var(--primary-color);
    }

    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-secondary);
        padding: 0.25rem;
        border-radius: 4px;
        transition: var(--transition);
    }

    .notification-close:hover {
        background-color: var(--border-color);
        color: var(--text-primary);
    }

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .vulnerability-item {
        background: var(--background-color);
        padding: 1rem;
        border-radius: var(--border-radius);
        margin-bottom: 1rem;
        border-left: 4px solid var(--border-color);
    }

    .vulnerability-item:last-child {
        margin-bottom: 0;
    }

    .vuln-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .vuln-header h5 {
        margin: 0;
        color: var(--text-primary);
        font-weight: 600;
    }

    .scan-summary {
        background: var(--background-color);
        padding: 1.5rem;
        border-radius: var(--border-radius);
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .summary-stats {
        display: flex;
        justify-content: space-around;
        margin-top: 1rem;
    }

    .scan-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
        justify-content: center;
    }

    @media (max-width: 767px) {
        .notification {
            right: 10px;
            left: 10px;
            min-width: auto;
        }

        .scan-actions {
            flex-direction: column;
        }

        .vuln-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);