// Nutrition Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const nutritionForm = document.getElementById('nutritionForm');
    const cancelBtn = document.getElementById('cancelBtn');

    // Initialize form
    initializeNutritionPage();
    setupFormHandlers();

    // Form submission
    if (nutritionForm) {
        nutritionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit();
        });
    }

    // Cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel? Any unsaved data will be lost.')) {
                window.location.href = 'dashboard.html';
            }
        });
    }

    // Auto-calculate calories from macros
    setupMacroCalculation();
});

function initializeNutritionPage() {
    // Load today's nutrition data
    const todayData = getTodayNutrition();
    updateDailySummary(todayData);

    // Set default time to current time
    const timeInput = document.getElementById('mealTime');
    if (timeInput) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeInput.value = `${hours}:${minutes}`;
    }
}

function setupFormHandlers() {
    // Add real-time validation
    const requiredInputs = document.querySelectorAll('input[required], select[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });

        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('error');
            }
        });
    });
}

function setupMacroCalculation() {
    const proteinInput = document.getElementById('protein');
    const carbsInput = document.getElementById('carbs');
    const fatsInput = document.getElementById('fats');
    const caloriesInput = document.getElementById('calories');

    function updateCaloriesFromMacros() {
        const protein = parseFloat(proteinInput.value) || 0;
        const carbs = parseFloat(carbsInput.value) || 0;
        const fats = parseFloat(fatsInput.value) || 0;

        // Calculate calories: protein(4) + carbs(4) + fats(9)
        const calculatedCalories = Math.round(protein * 4 + carbs * 4 + fats * 9);
        
        if (calculatedCalories > 0 && !caloriesInput.value) {
            caloriesInput.value = calculatedCalories;
        }
    }

    [proteinInput, carbsInput, fatsInput].forEach(input => {
        if (input) {
            input.addEventListener('input', updateCaloriesFromMacros);
        }
    });
}

function handleFormSubmit() {
    const formData = {
        mealType: document.getElementById('mealType').value,
        mealName: document.getElementById('mealName').value,
        calories: parseFloat(document.getElementById('calories').value),
        protein: parseFloat(document.getElementById('protein').value),
        carbs: parseFloat(document.getElementById('carbs').value),
        fats: parseFloat(document.getElementById('fats').value),
        time: document.getElementById('mealTime').value,
        notes: document.getElementById('notes').value,
        timestamp: new Date().toISOString()
    };

    // Validate form data
    if (!formData.mealType || !formData.mealName || !formData.calories) {
        alert('Please fill in all required fields');
        return;
    }

    // Save meal data
    saveMeal(formData);

    // Show success message
    showSuccessMessage('Meal logged successfully!');

    // Update summary
    const todayData = getTodayNutrition();
    updateDailySummary(todayData);

    // Reset form
    document.getElementById('nutritionForm').reset();

    // Reset time to current
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('mealTime').value = `${hours}:${minutes}`;

    // Smooth scroll to summary
    document.querySelector('.daily-summary').scrollIntoView({ behavior: 'smooth' });
}

function saveMeal(mealData) {
    // Get existing meals
    let meals = storage.get('meals') || [];
    
    // Add new meal
    meals.push(mealData);
    
    // Save to storage
    storage.set('meals', meals);
}

function getTodayNutrition() {
    const meals = storage.get('meals') || [];
    const today = new Date().toDateString();

    // Filter meals from today
    const todayMeals = meals.filter(meal => {
        const mealDate = new Date(meal.timestamp).toDateString();
        return mealDate === today;
    });

    // Calculate totals
    const totals = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
    };

    todayMeals.forEach(meal => {
        totals.calories += meal.calories;
        totals.protein += meal.protein;
        totals.carbs += meal.carbs;
        totals.fats += meal.fats;
    });

    return totals;
}

function updateDailySummary(data) {
    const targetCalories = 3500;
    
    // Update values
    document.getElementById('totalCalories').textContent = `${Math.round(data.calories)} kcal`;
    document.getElementById('totalProtein').textContent = `${Math.round(data.protein)}g`;
    document.getElementById('totalCarbs').textContent = `${Math.round(data.carbs)}g`;
    document.getElementById('totalFats').textContent = `${Math.round(data.fats)}g`;

    // Update progress bar
    const progressPercentage = Math.min((data.calories / targetCalories) * 100, 100);
    const progressFill = document.getElementById('caloriesProgress');
    const progressText = document.querySelector('.progress-text');

    if (progressFill) {
        progressFill.style.width = `${progressPercentage}%`;
    }

    if (progressText) {
        progressText.textContent = `${Math.round(progressPercentage)}% of ${targetCalories} kcal goal`;
    }

    // Add animation to values
    animateSummaryValues(data);
}

function animateSummaryValues(data) {
    const elements = [
        { id: 'totalCalories', value: data.calories, suffix: ' kcal' },
        { id: 'totalProtein', value: data.protein, suffix: 'g' },
        { id: 'totalCarbs', value: data.carbs, suffix: 'g' },
        { id: 'totalFats', value: data.fats, suffix: 'g' }
    ];

    elements.forEach(item => {
        const element = document.getElementById(item.id);
        if (element) {
            const startValue = 0;
            const endValue = Math.round(item.value);
            const duration = 1000;
            const increment = (endValue - startValue) / (duration / 16);
            let current = startValue;

            const timer = setInterval(() => {
                current += increment;
                if (current >= endValue) {
                    current = endValue;
                    clearInterval(timer);
                }
                element.textContent = Math.round(current) + item.suffix;
            }, 16);
        }
    });
}

// Clear today's nutrition (for testing)
window.clearTodayNutrition = function() {
    const meals = storage.get('meals') || [];
    const today = new Date().toDateString();
    
    const filteredMeals = meals.filter(meal => {
        const mealDate = new Date(meal.timestamp).toDateString();
        return mealDate !== today;
    });
    
    storage.set('meals', filteredMeals);
    
    const todayData = getTodayNutrition();
    updateDailySummary(todayData);
    
    showSuccessMessage('Today\'s nutrition data cleared!');
};
