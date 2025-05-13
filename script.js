/**
 * CSS3 Transitions, Animations, and Advanced JavaScript Functions
 * This script handles user preferences using localStorage and controls animations
 */

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // ========== User Preferences Variables ==========
    const themeToggle = document.getElementById('theme-toggle');
    const colorOptions = document.querySelectorAll('.color-option');
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    const userNameInput = document.getElementById('user-name');
    const savePreferencesBtn = document.getElementById('save-preferences');
    const userGreeting = document.getElementById('user-greeting');
    const lastVisitElement = document.getElementById('last-visit');

    // ========== Animation Control Variables ==========
    const animationBoxes = document.querySelectorAll('.animation-box');
    const playAllBtn = document.getElementById('play-all');
    const pauseAllBtn = document.getElementById('pause-all');
    const flipCard = document.getElementById('flip-card');
    
    // ========== Default User Preferences ==========
    let userPreferences = {
        darkTheme: false,
        accentColor: '#4a6cf7',
        animationSpeed: 1,
        userName: '',
        lastVisit: new Date().toString()
    };

    // ========== Load User Preferences from localStorage ==========
    loadUserPreferences();
    updateUIFromPreferences();
    updateLastVisit();

    // ========== Event Listeners ==========

    // Theme Toggle
    themeToggle.addEventListener('change', function() {
        userPreferences.darkTheme = this.checked;
        updateTheme();
        highlightSaveButton();
    });

    // Color Selection
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedColor = this.getAttribute('data-color');
            userPreferences.accentColor = selectedColor;
            updateSelectedColor();
            document.documentElement.style.setProperty('--accent-color', selectedColor);
            highlightSaveButton();
        });
    });

    // Animation Speed Control
    speedSlider.addEventListener('input', function() {
        const speed = parseFloat(this.value);
        userPreferences.animationSpeed = speed;
        speedValue.textContent = speed + 'x';
        document.documentElement.style.setProperty('--animation-speed', 1/speed);
        highlightSaveButton();
    });

    // User Name Input
    userNameInput.addEventListener('input', function() {
        userPreferences.userName = this.value;
        highlightSaveButton();
    });

    // Save Preferences Button
    savePreferencesBtn.addEventListener('click', function() {
        saveUserPreferences();
        this.classList.add('spin');
        setTimeout(() => {
            this.classList.remove('spin');
            showSavedConfirmation();
        }, 1000);
    });

    // Animation Controls
    playAllBtn.addEventListener('click', function() {
        animationBoxes.forEach(box => {
            box.classList.remove('paused');
        });
        // Add ripple effect to button
        createRippleEffect(this);
    });

    pauseAllBtn.addEventListener('click', function() {
        animationBoxes.forEach(box => {
            box.classList.add('paused');
        });
        // Add ripple effect to button
        createRippleEffect(this);
    });

    // Individual Animation Toggle
    animationBoxes.forEach(box => {
        box.addEventListener('click', function() {
            this.classList.toggle('paused');
        });
    });

    // Card Flip Interaction
    flipCard.addEventListener('click', function() {
        this.querySelector('.card-inner').classList.toggle('flip-active');
        updateGreeting();
    });

    // ========== Functions ==========

    /**
     * Creates a ripple effect on button click
     * @param {HTMLElement} button - The button element
     */
    function createRippleEffect(button) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        const rect = button.getBoundingClientRect();
        
        ripple.style.position = 'absolute';
        ripple.style.width = '100px';
        ripple.style.height = '100px';
        ripple.style.borderRadius = '50%';
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        
        // Set ripple position based on click position relative to button
        const x = event.clientX - rect.left - 50;
        const y = event.clientY - rect.top - 50;
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        button.appendChild(ripple);
        
        // Remove ripple after animation is done
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Loads user preferences from localStorage
     */
    function loadUserPreferences() {
        const savedPreferences = localStorage.getItem('userPreferences');
        if (savedPreferences) {
            try {
                const parsedPreferences = JSON.parse(savedPreferences);
                // Merge with default preferences to handle any missing properties
                userPreferences = { ...userPreferences, ...parsedPreferences };
            } catch (error) {
                console.error('Error parsing preferences:', error);
            }
        }
    }

    /**
     * Saves user preferences to localStorage
     */
    function saveUserPreferences() {
        // Update last visit time when saving
        userPreferences.lastVisit = new Date().toString();
        localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    }

    /**
     * Updates the UI elements based on loaded preferences
     */
    function updateUIFromPreferences() {
        // Update theme
        themeToggle.checked = userPreferences.darkTheme;
        updateTheme();
        
        // Update accent color
        document.documentElement.style.setProperty('--accent-color', userPreferences.accentColor);
        updateSelectedColor();
        
        // Update animation speed
        speedSlider.value = userPreferences.animationSpeed;
        speedValue.textContent = userPreferences.animationSpeed + 'x';
        document.documentElement.style.setProperty('--animation-speed', 1/userPreferences.animationSpeed);
        
        // Update user name
        userNameInput.value = userPreferences.userName;
        
        // Update greeting
        updateGreeting();
    }

    /**
     * Updates the theme based on user preference
     */
    function updateTheme() {
        if (userPreferences.darkTheme) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    /**
     * Updates the selected color in the color options
     */
    function updateSelectedColor() {
        colorOptions.forEach(option => {
            const color = option.getAttribute('data-color');
            if (color === userPreferences.accentColor) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }

    /**
     * Updates the personalized greeting on the flip card
     */
    function updateGreeting() {
        if (userPreferences.userName) {
            userGreeting.textContent = `Welcome back, ${userPreferences.userName}! Your preferences have been saved.`;
        } else {
            userGreeting.textContent = `Your preferences have been saved!`;
        }
    }

    /**
     * Shows a visual confirmation when preferences are saved
     */
    function showSavedConfirmation() {
        savePreferencesBtn.textContent = "Saved!";
        setTimeout(() => {
            savePreferencesBtn.textContent = "Save Preferences";
        }, 2000);
    }

    /**
     * Highlights the save button to indicate unsaved changes
     */
    function highlightSaveButton() {
        savePreferencesBtn.style.backgroundColor = '#f7d54a';
        savePreferencesBtn.textContent = "Save Changes";
        
        setTimeout(() => {
            savePreferencesBtn.style.backgroundColor = '';
        }, 300);
    }

    /**
     * Updates the last visit display
     */
    function updateLastVisit() {
        if (userPreferences.lastVisit && userPreferences.lastVisit !== new Date().toString()) {
            const lastVisit = new Date(userPreferences.lastVisit);
            lastVisitElement.textContent = `Last visit: ${lastVisit.toLocaleString()}`;
        } else {
            lastVisitElement.textContent = `First visit! Welcome!`;
        }
    }

    // Create keyframe animation for ripple effect
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
});