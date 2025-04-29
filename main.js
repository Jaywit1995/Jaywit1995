// Main Application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map if exists
    if (document.getElementById('map')) {
        initMap();
    }

    // Language selector functionality
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            // In a real implementation, this would change the language
            console.log('Language changed to:', this.value);
            alert('Language changed to: ' + this.value);
        });
    }

    // Registration Form Handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validate form
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            // Save user to localStorage (simulating database)
            const user = {
                fullName,
                email,
                phone,
                password
            };

            localStorage.setItem('user_' + email, JSON.stringify(user));
            
            // Notify admin (in real app, this would be a server call)
            notifyAdmin('New registration: ' + email);
            
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        });
    }

    // Login Form Handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const loginId = document.getElementById('loginId').value;
            const password = document.getElementById('loginPassword').value;

            // Check if loginId is email or phone
            let userKey = loginId.includes('@') ? 'user_' + loginId : null;
            
            // If not email, search by phone
            if (!userKey) {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.startsWith('user_')) {
                        const user = JSON.parse(localStorage.getItem(key));
                        if (user.phone === loginId) {
                            userKey = key;
                            break;
                        }
                    }
                }
            }

            if (!userKey) {
                alert('User not found. Please register first.');
                return;
            }

            const user = JSON.parse(localStorage.getItem(userKey));
            
            if (user.password !== password) {
                alert('Invalid password!');
                return;
            }

            // Notify admin (in real app, this would be a server call)
            notifyAdmin('User logged in: ' + user.email);
            
            // Save current user session
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            alert('Login successful!');
            window.location.href = 'index.html';
        });
    }

    // Check if user is logged in
    checkLoginStatus();
});

function initMap() {
    // Coordinates for Ado-Ekiti (approximate)
    const map = L.map('map').setView([7.6233, 5.2206], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker([7.6233, 5.2206]).addTo(map)
        .bindPopup('SKOTECH Travels<br>G6 Fayose Market, Ajilosun')
        .openPopup();
}

function contactService(serviceName) {
    const phoneNumbers = ['08067355279', '08129969132',];
    const selectedNumber = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
    
    if (serviceName) {
        const whatsappUrl = `https://wa.me/${selectedNumber.replace(/\D/g, '')}?text=I'm interested in your ${encodeURIComponent(serviceName)} service.`;
        window.open(whatsappUrl, '_blank');
    } else {
        window.location.href = `tel:${selectedNumber}`;
    }
}

function notifyAdmin(message) {
    // In a real implementation, this would send a notification to admin
    console.log('ADMIN NOTIFICATION:', message);
    
    // Store admin notifications in localStorage
    const notifications = JSON.parse(localStorage.getItem('admin_notifications') || [];
    notifications.push({
        message,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('admin_notifications', JSON.stringify(notifications));
}

function checkLoginStatus() {
    const currentUser = sessionStorage.getItem('currentUser');
    const loginLinks = document.querySelectorAll('a[href="login.html"]');
    const registerLinks = document.querySelectorAll('a[href="register.html"]');
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        loginLinks.forEach(link => {
            link.textContent = 'My Account';
            link.href = '#';
            link.addEventListener('click', function(e) {
                e.preventDefault();
                alert(`Logged in as: ${user.fullName}\nEmail: ${user.email}\nPhone: ${user.phone}`);
            });
        });
        registerLinks.forEach(link => {
            link.style.display = 'none';
        });
    }
}

// Password visibility toggle
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });
});

// Enhanced form validation
function validateForm(form) {
    let isValid = true;
    const formGroups = form.querySelectorAll('.form-group');

    formGroups.forEach(group => {
        const input = group.querySelector('input');
        const error = group.querySelector('.error-message');

        if (!input.value.trim()) {
            group.classList.add('error');
            if (error) error.textContent = 'This field is required';
            isValid = false;
        } else {
            group.classList.remove('error');
            
            // Email validation
            if (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value)) {
                group.classList.add('error');
                if (error) error.textContent = 'Please enter a valid email';
                isValid = false;
            }
            
            // Password confirmation
            if (input.id === 'confirmPassword') {
                const password = form.querySelector('#password').value;
                if (input.value !== password) {
                    group.classList.add('error');
                    if (error) error.textContent = 'Passwords do not match';
                    isValid = false;
                }
            }
        }
    });

    return isValid;
}

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = sessionStorage.getItem('currentUser');
    const loginLinks = document.querySelectorAll('a[href="login.html"]');
    const registerLinks = document.querySelectorAll('a[href="register.html"]');
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        loginLinks.forEach(link => {
            link.textContent = 'My Account';
            link.href = '#';
            link.addEventListener('click', function(e) {
                e.preventDefault();
                alert(`Logged in as: ${user.fullName}\nEmail: ${user.email}\nPhone: ${user.phone}`);
            });
        });
        registerLinks.forEach(link => {
            link.style.display = 'none';
        });
    }
});

// BACKGROUND IMAGE SLIDER FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    const bgSlides = document.querySelectorAll('.bg-image');
    
    // Show first image immediately
    if (bgSlides.length > 0) {
        bgSlides[0].classList.add('active');
    }
    
    function changeBackground() {
        // Get current active slide
        const currentActive = document.querySelector('.bg-image.active');
        let nextActive;
        
        if (currentActive.nextElementSibling && currentActive.nextElementSibling.classList.contains('bg-image')) {
            nextActive = currentActive.nextElementSibling;
        } else {
            nextActive = bgSlides[0];
        }
        
        // Switch active classes
        currentActive.classList.remove('active');
        nextActive.classList.add('active');
    }
    
    // Change background every 5 seconds
    if (bgSlides.length > 1) {
        setInterval(changeBackground, 5000);
    }
    
    // Preload images to prevent flickering
    const bgImages = [
        'SKO IMG/plane.png',
        'SKO IMG/jeddah.png',
        'SKO IMG/assi2.jpeg',
        'SKO IMG/landmark9.jpg'
    ];
    
    bgImages.forEach(url => {
        new Image().src = url;
    });
});

// Main Application JavaScript - main.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize database
    DB.init();

    // Initialize map if exists
    if (document.getElementById('map')) {
        initMap();
    }

    // Language selector functionality
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            changeLanguage(selectedLanguage);
        });
    }

    // Registration Form Handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validate form
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            // Create user object
            const user = {
                fullName,
                email,
                phone,
                password,
                createdAt: new Date().toISOString()
            };

            // Register user
            const result = DB.registerUser(user);
            
            if (result.success) {
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            } else {
                alert(result.message);
            }
        });
    }

    // Login Form Handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const loginId = document.getElementById('loginId').value;
            const password = document.getElementById('loginPassword').value;
            const errorElement = document.getElementById('loginError');

            // Authenticate user
            const result = DB.authenticateUser(loginId, password);
            
            if (result.success) {
                // Save current user session
                DB.setCurrentUser(result.user);
                
                // Redirect to book-now page
                window.location.href = 'book-now.html';
            } else {
                errorElement.textContent = result.message;
                errorElement.style.display = 'block';
            }
        });
    }

    // Booking Form Handling (in book-now.html)
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentUser = DB.getCurrentUser();
            if (!currentUser) {
                alert('Please login first');
                window.location.href = 'login.html';
                return;
            }
            
            const serviceType = document.getElementById('serviceType').value;
            const travelDate = document.getElementById('travelDate').value;
            const passengers = document.getElementById('passengers').value;
            const specialRequests = document.getElementById('specialRequests').value;

            const booking = {
                userEmail: currentUser.email,
                serviceType,
                travelDate,
                passengers,
                specialRequests,
                status: 'pending'
            };

            // Create booking
            const createdBooking = DB.createBooking(booking);
            
            alert(`Booking created successfully! Reference: ${createdBooking.id}`);
            window.location.href = 'booking-confirmation.html?id=' + createdBooking.id;
        });
    }

    // Check if user is logged in
    checkLoginStatus();
});

// Initialize map
function initMap() {
    // Coordinates for Ado-Ekiti (approximate)
    const map = L.map('map').setView([7.6233, 5.2206], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker([7.6233, 5.2206]).addTo(map)
        .bindPopup('SKOTECH Travels<br>G6 Fayose Market, Ajilosun')
        .openPopup();
}

// Contact service via WhatsApp
function contactService(serviceName) {
    const phoneNumbers = ['08067355279', '08129969132'];
    const selectedNumber = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
    
    if (serviceName) {
        const whatsappUrl = `https://wa.me/${selectedNumber.replace(/\D/g, '')}?text=I'm interested in your ${encodeURIComponent(serviceName)} service.`;
        window.open(whatsappUrl, '_blank');
    } else {
        window.location.href = `tel:${selectedNumber}`;
    }
}

// Check login status and update UI
function checkLoginStatus() {
    const currentUser = DB.getCurrentUser();
    const loginLinks = document.querySelectorAll('a[href="login.html"]');
    const registerLinks = document.querySelectorAll('a[href="register.html"]');
    
    if (currentUser) {
        loginLinks.forEach(link => {
            link.textContent = 'My Account';
            link.href = '#';
            link.addEventListener('click', function(e) {
                e.preventDefault();
                alert(`Logged in as: ${currentUser.fullName}\nEmail: ${currentUser.email}\nPhone: ${currentUser.phone}`);
            });
        });
        registerLinks.forEach(link => {
            link.style.display = 'none';
        });
    }
}

// Password visibility toggle
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });
});

// Language translation functionality
function changeLanguage(language) {
    const translations = {
        // Your existing translation object
        // ...
    };

    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
            
            // Handle placeholder attributes
            if (element.hasAttribute('placeholder')) {
                element.setAttribute('placeholder', translations[language][key]);
            }
        }
    });
}

// Background image slider functionality
function initBackgroundSlider() {
    const bgSlides = document.querySelectorAll('.bg-image');
    
    if (bgSlides.length > 0) {
        bgSlides[0].classList.add('active');
        
        function changeBackground() {
            const currentActive = document.querySelector('.bg-image.active');
            let nextActive;
            
            if (currentActive.nextElementSibling && currentActive.nextElementSibling.classList.contains('bg-image')) {
                nextActive = currentActive.nextElementSibling;
            } else {
                nextActive = bgSlides[0];
            }
            
            currentActive.classList.remove('active');
            nextActive.classList.add('active');
        }
        
        if (bgSlides.length > 1) {
            setInterval(changeBackground, 5000);
        }
    }
}

// Initialize background slider
document.addEventListener('DOMContentLoaded', initBackgroundSlider);




