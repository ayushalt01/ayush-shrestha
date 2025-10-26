// Smooth scrolling for navigation
function scrollToCalculator() {
    document.getElementById('calculator').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Add smooth scrolling to all navigation links
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Calorie Calculator
document.getElementById('bulkForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const age = parseFloat(document.getElementById('age').value);
    const activityLevel = parseFloat(document.getElementById('activity').value);
    const weeklyGoal = parseFloat(document.getElementById('goal').value);
    
    // Calculate BMR using Mifflin-St Jeor Equation (for males)
    const bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    
    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * activityLevel;
    
    // Calculate calorie surplus needed for weight gain
    // 1 kg of body weight ≈ 7700 calories
    const weeklyCalorieSurplus = weeklyGoal * 7700;
    const dailyCalorieSurplus = weeklyCalorieSurplus / 7;
    const targetCalories = Math.round(tdee + dailyCalorieSurplus);
    
    // Calculate macros
    // Protein: 2g per kg of body weight
    const protein = Math.round(weight * 2);
    
    // Fats: 25-30% of total calories (using 27.5%)
    const fatsCalories = targetCalories * 0.275;
    const fats = Math.round(fatsCalories / 9); // 9 calories per gram of fat
    
    // Carbs: remaining calories
    const proteinCalories = protein * 4;
    const fatCalories = fats * 9;
    const carbsCalories = targetCalories - proteinCalories - fatCalories;
    const carbs = Math.round(carbsCalories / 4); // 4 calories per gram of carbs
    
    // Display results
    document.getElementById('calorieTarget').textContent = `${targetCalories} kcal`;
    document.getElementById('proteinTarget').textContent = protein;
    document.getElementById('carbsTarget').textContent = carbs;
    document.getElementById('fatsTarget').textContent = fats;
    
    // Generate meal recommendations
    generateMealRecommendations(targetCalories, protein, carbs, fats);
    
    // Show results
    document.getElementById('results').style.display = 'block';
    
    // Scroll to results
    document.getElementById('results').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
});

// Generate AI-recommended meals
function generateMealRecommendations(calories, protein, carbs, fats) {
    const mealList = document.getElementById('mealList');
    
    // Calculate calories per meal (assuming 3 main meals + 2 snacks)
    const breakfastCals = Math.round(calories * 0.25);
    const lunchCals = Math.round(calories * 0.30);
    const dinnerCals = Math.round(calories * 0.30);
    const snackCals = Math.round(calories * 0.15);
    
    const meals = [
        {
            name: "Power Breakfast",
            description: "4 whole eggs scrambled with cheese, 2 slices whole wheat toast with peanut butter, 1 banana, and a protein shake with whole milk",
            calories: breakfastCals,
            icon: "🍳"
        },
        {
            name: "Morning Snack",
            description: "Greek yogurt (200g) with granola, honey, and mixed nuts",
            calories: snackCals,
            icon: "🥣"
        },
        {
            name: "Muscle-Building Lunch",
            description: "Grilled chicken breast (200g) with brown rice, sweet potato, mixed vegetables, and olive oil dressing",
            calories: lunchCals,
            icon: "🍗"
        },
        {
            name: "Afternoon Snack",
            description: "Protein smoothie with banana, oats, peanut butter, and whole milk",
            calories: snackCals,
            icon: "🥤"
        },
        {
            name: "Recovery Dinner",
            description: "Lean beef or salmon (200g) with quinoa, roasted vegetables, avocado, and a side salad with olive oil",
            calories: dinnerCals,
            icon: "🥩"
        }
    ];
    
    mealList.innerHTML = meals.map(meal => `
        <div class="meal-item">
            <h5>${meal.icon} ${meal.name}</h5>
            <p>${meal.description}</p>
            <span class="meal-calories">~${meal.calories} kcal</span>
        </div>
    `).join('');
}

// Chat functionality
document.getElementById('chatForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        // Add user message
        addMessage(message, 'user');
        
        // Clear input
        input.value = '';
        
        // Generate AI response
        setTimeout(() => {
            const response = generateAIResponse(message);
            addMessage(response, 'bot');
        }, 500);
    }
});

function addMessage(text, type) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (type === 'bot') {
        contentDiv.innerHTML = `<strong>BulkAI:</strong> ${text}`;
    } else {
        contentDiv.innerHTML = `<strong>You:</strong> ${text}`;
    }
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Keyword-based responses
    if (lowerMessage.includes('protein') || lowerMessage.includes('how much protein')) {
        return "Great question! For bulking, aim for 1.6-2.2g of protein per kg of body weight. Good sources include chicken, fish, eggs, Greek yogurt, and lean beef. Don't forget plant-based options like lentils and tofu! 💪";
    }
    
    if (lowerMessage.includes('supplement') || lowerMessage.includes('supplements')) {
        return "The essentials for bulking: 1) Whey protein (if you struggle to hit protein goals), 2) Creatine monohydrate (5g daily), 3) Vitamin D (if low sun exposure), 4) Omega-3s. Remember, supplements are just that - supplements to a solid diet! 💊";
    }
    
    if (lowerMessage.includes('meal') || lowerMessage.includes('what to eat')) {
        return "Focus on calorie-dense whole foods: oats, rice, pasta, potatoes, lean meats, fish, eggs, nuts, nut butters, avocados, and whole milk. Eat 4-5 meals per day to spread out your calories. Make each meal count! 🍽️";
    }
    
    if (lowerMessage.includes('workout') || lowerMessage.includes('exercise') || lowerMessage.includes('training')) {
        return "For optimal muscle growth, focus on progressive overload with compound movements: squats, deadlifts, bench press, overhead press, and rows. Train 4-5 days per week. Eat within 2 hours post-workout to maximize recovery! 🏋️";
    }
    
    if (lowerMessage.includes('fast') || lowerMessage.includes('how long') || lowerMessage.includes('time')) {
        return "Healthy weight gain takes time! Aim for 0.25-0.5 kg per week. Anything faster risks excess fat gain. Stay consistent for 12-16 weeks minimum to see real transformation. Remember: slow and steady wins the race! 📈";
    }
    
    if (lowerMessage.includes('fat') || lowerMessage.includes('belly') || lowerMessage.includes('lean')) {
        return "Some fat gain is normal during bulking, but minimize it by: 1) Not exceeding 300-500 calorie surplus, 2) Prioritizing whole foods, 3) Training hard 4-5x/week, 4) Getting 7-9 hours sleep. Accept 10-15% body fat increase as part of the process. 📊";
    }
    
    if (lowerMessage.includes('breakfast')) {
        return "Power breakfast ideas: 1) 4 eggs + oats + banana + nuts, 2) Greek yogurt + granola + berries + honey, 3) Protein pancakes + peanut butter + syrup. Make breakfast count - it sets the tone for your day! 🍳";
    }
    
    if (lowerMessage.includes('snack')) {
        return "High-calorie snacks for bulking: trail mix, protein bars, smoothies with peanut butter, Greek yogurt with granola, cheese and crackers, chocolate milk, dried fruits and nuts. Keep snacks handy! 🥜";
    }
    
    if (lowerMessage.includes('water') || lowerMessage.includes('hydration')) {
        return "Hydration is crucial! Aim for 3-4 liters of water daily, more if training hard. Water helps digestion, nutrient transport, and recovery. Don't let thirst be your only indicator - drink consistently throughout the day! 💧";
    }
    
    if (lowerMessage.includes('sleep')) {
        return "Sleep is where the magic happens! Aim for 7-9 hours nightly. During sleep, your body releases growth hormone and repairs muscle tissue. Poor sleep = poor gains. Make it a priority! 😴";
    }
    
    if (lowerMessage.includes('cardio')) {
        return "During bulking, keep cardio minimal - 2-3 sessions of 20-30 minutes per week max. Focus on LISS (low intensity steady state) like walking. Too much cardio burns calories you need for growth! 🚶";
    }
    
    if (lowerMessage.includes('cheat meal') || lowerMessage.includes('junk food')) {
        return "An occasional treat meal is fine (1-2x per week) and can help with adherence. However, prioritize nutrient-dense foods 80-90% of the time. You can't out-train a consistently poor diet! 🍕";
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('money')) {
        return "Budget-friendly bulk foods: eggs, oats, rice, pasta, chicken thighs, ground beef, canned tuna, milk, peanut butter, frozen vegetables, bananas, and potatoes. Buy in bulk and meal prep! 💰";
    }
    
    if (lowerMessage.includes('vegetarian') || lowerMessage.includes('vegan') || lowerMessage.includes('plant based')) {
        return "Plant-based bulking is totally possible! Focus on: lentils, chickpeas, tofu, tempeh, seitan, quinoa, nuts, seeds, nut butters, plant protein powder, and fortified plant milk. Track your protein carefully! 🌱";
    }
    
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return "You're welcome! Keep pushing, stay consistent, and remember - every meal counts! I'm here whenever you need guidance. You've got this! 💪🔥";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hey there, champ! 👋 Ready to level up your nutrition game? Ask me anything about bulking, meals, supplements, or training nutrition. Let's get you those gains! 💪";
    }
    
    // Default response for unmatched queries
    return "That's a great question! For bulking success, focus on: 1) Consistent calorie surplus (300-500 cal), 2) High protein intake (1.8-2.2g per kg), 3) Progressive strength training, 4) Quality sleep, 5) Patience and consistency. Want specific advice on any of these? 🎯";
}
