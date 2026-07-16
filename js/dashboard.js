// Stackly Dashboard JavaScript File
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Sidebar Toggle
    const dbMenuToggle = document.querySelector('.db-menu-toggle');
    const dbSidebar = document.querySelector('.db-sidebar');
    if (dbMenuToggle && dbSidebar) {
        dbMenuToggle.addEventListener('click', () => {
            dbSidebar.classList.toggle('active');
            const icon = dbMenuToggle.querySelector('i');
            if (icon) {
                if (dbSidebar.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    }

    // 1.5 Update User Profile Details from login email
    const savedEmail = localStorage.getItem('stackly_user_email');
    if (savedEmail) {
        const usernamePart = savedEmail.split('@')[0];
        const capitalizedName = usernamePart
            .split(/[\._-]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
            
        const nameWords = capitalizedName.split(' ');
        const initials = nameWords.map(w => w.charAt(0)).join('').substring(0, 2).toUpperCase();

        const dbUserH5 = document.querySelector('.db-user-details h5');
        const dbAvatar = document.querySelector('.db-user-avatar');
        
        if (dbUserH5) dbUserH5.innerText = capitalizedName;
        if (dbAvatar && initials) dbAvatar.innerText = initials;
    }

    // 2. Sidebar Redirection to Section (Smooth Scroll + Active highlights)
    const menuItems = document.querySelectorAll('.db-menu-item');
    const sections = document.querySelectorAll('.db-section');
    
    if (menuItems.length > 0 && sections.length > 0) {
        menuItems.forEach(item => {
            const link = item.querySelector('a');
            if (link) {
                link.addEventListener('click', (e) => {
                    if (link.getAttribute('href') === 'index.html') {
                        return;
                    }
                    
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        
                        menuItems.forEach(i => i.classList.remove('active'));
                        item.classList.add('active');
                        
                        if (dbSidebar) {
                            dbSidebar.classList.remove('active');
                            const toggleIcon = dbMenuToggle ? dbMenuToggle.querySelector('i') : null;
                            if (toggleIcon) toggleIcon.className = 'fas fa-bars';
                        }
                    }
                });
            }
        });

        // Highlight sidebar items as user scrolls
        const mainContent = document.querySelector('.db-content');
        if (mainContent) {
            window.addEventListener('scroll', () => {
                let currentSectionId = '';
                sections.forEach(sec => {
                    const secTop = sec.offsetTop;
                    if (window.pageYOffset >= secTop - 120) {
                        currentSectionId = sec.getAttribute('id');
                    }
                });

                if (currentSectionId) {
                    menuItems.forEach(item => {
                        const linkElement = item.querySelector('a');
                        if (linkElement) {
                            const href = linkElement.getAttribute('href');
                            if (href === '#' + currentSectionId) {
                                item.classList.add('active');
                            } else {
                                item.classList.remove('active');
                            }
                        }
                    });
                }
            });
        }
    }

    // 3. Canvas-based Premium Chart Renderers
    renderDashboardCharts();

    function renderDashboardCharts() {
        const usageCanvas = document.getElementById('clientUsageChart');
        if (usageCanvas) {
            drawAreaChart(usageCanvas, 
                ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], 
                [120, 250, 480, 390, 720, 850, 1100],
                'rgba(0, 255, 255, 0.4)',
                '#00ffff'
            );
        }

        const rateCanvas = document.getElementById('clientSuccessChart');
        if (rateCanvas) {
            drawBarChart(rateCanvas,
                ['Task Automations', 'API Inquiries', 'Data Scrapes', 'Webhooks'],
                [99.4, 98.7, 95.2, 100.0],
                'rgba(157, 78, 221, 0.5)',
                '#9d4edd'
            );
        }

        const growthCanvas = document.getElementById('adminGrowthChart');
        if (growthCanvas) {
            drawMultiLineChart(growthCanvas,
                ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                [
                    [150, 280, 450, 680, 890, 1200],
                    [12, 25, 45, 78, 112, 185]
                ],
                ['#00ffff', '#ff007f']
            );
        }

        const serverCanvas = document.getElementById('adminServerChart');
        if (serverCanvas) {
            drawAreaChart(serverCanvas,
                ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                [22, 15, 65, 88, 74, 91, 35],
                'rgba(255, 0, 127, 0.3)',
                '#ff007f'
            );
        }
    }

    function drawAreaChart(canvas, labels, data, fillColor, strokeColor) {
        const ctx = canvas.getContext('2d');
        const parent = canvas.parentElement;
        let width = parent.clientWidth;
        let height = parent.clientHeight;
        if (height < 50) height = 250;
        if (width < 50) width = canvas.clientWidth || 300;
        canvas.width = width;
        canvas.height = height;
        
        ctx.clearRect(0, 0, width, height);

        const paddingLeft = 45;
        const paddingRight = 20;
        const paddingTop = 20;
        const paddingBottom = 40;

        const chartWidth = width - paddingLeft - paddingRight;
        const chartHeight = height - paddingTop - paddingBottom;

        const maxVal = Math.max(...data) * 1.15;
        const minVal = 0;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = paddingTop + (chartHeight * i / 4);
            ctx.beginPath();
            ctx.moveTo(paddingLeft, y);
            ctx.lineTo(width - paddingRight, y);
            ctx.stroke();

            ctx.fillStyle = '#a49fc6';
            ctx.font = '10px Inter';
            ctx.fillText(Math.round(maxVal - (maxVal * i / 4)), 10, y + 3);
        }

        const points = [];
        for (let i = 0; i < data.length; i++) {
            const x = paddingLeft + (chartWidth * i / (data.length - 1));
            const y = paddingTop + chartHeight - (chartHeight * (data[i] - minVal) / (maxVal - minVal));
            points.push({ x, y });

            ctx.fillStyle = '#a49fc6';
            ctx.font = '10px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(labels[i], x, height - 15);
        }

        ctx.beginPath();
        ctx.moveTo(points[0].x, paddingTop + chartHeight);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, paddingTop + chartHeight);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + chartHeight);
        grad.addColorStop(0, fillColor);
        grad.addColorStop(1, 'rgba(6, 3, 18, 0)');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        points.forEach((p, idx) => {
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        points.forEach((p, idx) => {
            ctx.fillStyle = strokeColor;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();
            
            if (idx === data.length - 1) {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 11px Inter';
                ctx.fillText(data[idx], p.x, p.y - 10);
            }
        });
    }

    function drawBarChart(canvas, labels, data, fillColor, strokeColor) {
        const ctx = canvas.getContext('2d');
        const parent = canvas.parentElement;
        let width = parent.clientWidth;
        let height = parent.clientHeight;
        if (height < 50) height = 250;
        if (width < 50) width = canvas.clientWidth || 300;
        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);

        const paddingLeft = 40;
        const paddingRight = 20;
        const paddingTop = 20;
        const paddingBottom = 40;

        const chartWidth = width - paddingLeft - paddingRight;
        const chartHeight = height - paddingTop - paddingBottom;

        const maxVal = 100;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 0; i <= 4; i++) {
            const y = paddingTop + (chartHeight * i / 4);
            ctx.beginPath();
            ctx.moveTo(paddingLeft, y);
            ctx.lineTo(width - paddingRight, y);
            ctx.stroke();

            ctx.fillStyle = '#a49fc6';
            ctx.font = '10px Inter';
            ctx.fillText(Math.round(100 - (100 * i / 4)) + '%', 10, y + 3);
        }

        const barWidth = (chartWidth / data.length) * 0.55;
        const spacing = (chartWidth / data.length) * 0.45;

        for (let i = 0; i < data.length; i++) {
            const x = paddingLeft + (i * (barWidth + spacing)) + spacing/2;
            const barHeight = chartHeight * data[i] / maxVal;
            const y = paddingTop + chartHeight - barHeight;

            ctx.fillStyle = fillColor;
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 1.5;
            
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barHeight, [8, 8, 0, 0]);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#a49fc6';
            ctx.font = '9px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(labels[i], x + barWidth/2, height - 15);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px Inter';
            ctx.fillText(data[i] + '%', x + barWidth/2, y - 8);
        }
    }

    function drawMultiLineChart(canvas, labels, datasets, colors) {
        const ctx = canvas.getContext('2d');
        const parent = canvas.parentElement;
        let width = parent.clientWidth;
        let height = parent.clientHeight;
        if (height < 50) height = 250;
        if (width < 50) width = canvas.clientWidth || 300;
        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);

        const paddingLeft = 45;
        const paddingRight = 20;
        const paddingTop = 25;
        const paddingBottom = 40;

        const chartWidth = width - paddingLeft - paddingRight;
        const chartHeight = height - paddingTop - paddingBottom;

        const allData = [...datasets[0], ...datasets[1]];
        const maxVal = Math.max(...allData) * 1.15;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 0; i <= 4; i++) {
            const y = paddingTop + (chartHeight * i / 4);
            ctx.beginPath();
            ctx.moveTo(paddingLeft, y);
            ctx.lineTo(width - paddingRight, y);
            ctx.stroke();

            ctx.fillStyle = '#a49fc6';
            ctx.font = '10px Inter';
            ctx.fillText(Math.round(maxVal - (maxVal * i / 4)), 10, y + 3);
        }

        datasets.forEach((data, datasetIdx) => {
            const points = [];
            const color = colors[datasetIdx];

            for (let i = 0; i < data.length; i++) {
                const x = paddingLeft + (chartWidth * i / (data.length - 1));
                const y = paddingTop + chartHeight - (chartHeight * data[i] / maxVal);
                points.push({ x, y });

                if (datasetIdx === 0) {
                    ctx.fillStyle = '#a49fc6';
                    ctx.font = '10px Inter';
                    ctx.textAlign = 'center';
                    ctx.fillText(labels[i], x, height - 15);
                }
            }

            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            points.forEach((p, idx) => {
                if (idx === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();

            points.forEach(p => {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                ctx.fill();
            });
        });
    }

    // 4. Redirection validation in Dashboard Forms
    const dbForms = document.querySelectorAll('.db-section form');
    dbForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;
            const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]');
            
            requiredFields.forEach(field => {
                const parent = field.parentElement;
                let errorMsg = parent.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    parent.appendChild(errorMsg);
                }

                if (!field.value.trim()) {
                    valid = false;
                    field.style.borderColor = 'var(--accent)';
                    errorMsg.textContent = `${field.placeholder || 'Field'} is required.`;
                    errorMsg.style.display = 'block';
                } else {
                    field.style.borderColor = 'var(--border-color)';
                    errorMsg.style.display = 'none';
                }

                field.addEventListener('input', () => {
                    field.style.borderColor = 'var(--border-color)';
                    errorMsg.style.display = 'none';
                });
            });

            if (valid) {
                window.location.href = '404.html';
            }
        });
    });

    // 5. Redraw charts on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            renderDashboardCharts();
        }, 250);
    });
});
