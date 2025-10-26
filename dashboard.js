// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard data
    initializeDashboard();
    setupChartControls();
    setupQuickActions();
});

function initializeDashboard() {
    // Load user data from storage or use defaults
    const userData = storage.get('userData') || {
        currentWeight: 155,
        dailyCalories: 3200,
        proteinIntake: 180,
        muscleGained: 8.5,
        targetCalories: 3500,
        targetProtein: 175
    };

    // Update dashboard values
    updateMetric('currentWeight', userData.currentWeight);
    updateMetric('dailyCalories', userData.dailyCalories);
    updateMetric('proteinIntake', userData.proteinIntake);
    updateMetric('muscleGained', userData.muscleGained);

    // Initialize chart
    initializeChart();
}

function updateMetric(id, value) {
    const element = document.getElementById(id);
    if (element) {
        // Animate number change
        animateValue(element, 0, value, 1000);
    }
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current * 10) / 10;
    }, 16);
}

function initializeChart() {
    const canvas = document.getElementById('progressChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    // Sample data for weight progress
    const data = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'],
        values: [146.5, 147.8, 149.2, 150.5, 151.3, 152.0, 152.8, 153.5, 154.0, 154.6, 155.0, 155.0]
    };

    drawChart(ctx, canvas.width, canvas.height, data);
}

function drawChart(ctx, width, height, data) {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find min and max values
    const minValue = Math.min(...data.values) - 2;
    const maxValue = Math.max(...data.values) + 2;
    const valueRange = maxValue - minValue;

    // Draw grid lines
    ctx.strokeStyle = '#E5E5E5';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#D2D2D7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw data points and line
    ctx.strokeStyle = '#007AFF';
    ctx.fillStyle = '#007AFF';
    ctx.lineWidth = 3;

    const points = data.values.map((value, index) => {
        const x = padding + (chartWidth / (data.values.length - 1)) * index;
        const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
        return { x, y, value };
    });

    // Draw line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(0, 122, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 122, 255, 0.0)');
    ctx.fillStyle = gradient;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    ctx.lineTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw points
    points.forEach((point, index) => {
        ctx.fillStyle = '#007AFF';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw point outline
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // Draw labels
    ctx.fillStyle = '#6E6E73';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    
    // X-axis labels (every 2 weeks)
    data.labels.forEach((label, index) => {
        if (index % 2 === 0) {
            const x = padding + (chartWidth / (data.values.length - 1)) * index;
            ctx.fillText(label, x, height - padding + 20);
        }
    });

    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = minValue + (valueRange / 5) * (5 - i);
        const y = padding + (chartHeight / 5) * i;
        ctx.fillText(Math.round(value) + ' lbs', padding - 10, y + 4);
    }
}

function setupChartControls() {
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            chartBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // In a real app, you would load different data here
            const period = this.dataset.period;
            console.log('Loading chart data for period:', period);
        });
    });
}

function setupQuickActions() {
    const logWeightCard = document.getElementById('logWeightCard');
    if (logWeightCard) {
        logWeightCard.addEventListener('click', function() {
            const weight = prompt('Enter your current weight (lbs):');
            if (weight && !isNaN(weight)) {
                const userData = storage.get('userData') || {};
                userData.currentWeight = parseFloat(weight);
                storage.set('userData', userData);
                
                updateMetric('currentWeight', userData.currentWeight);
                showSuccessMessage('Weight logged successfully!');
                
                // Reload chart with new data
                initializeChart();
            }
        });
    }

    // Add click handlers for other action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        if (card.id !== 'logWeightCard' && !card.href) {
            card.addEventListener('click', function() {
                const title = this.querySelector('.action-title').textContent;
                console.log('Action clicked:', title);
                // In a real app, you would navigate to the appropriate page
            });
        }
    });
}

// Handle window resize for chart
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        initializeChart();
    }, 250);
});
