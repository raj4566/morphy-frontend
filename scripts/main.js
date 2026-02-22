// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : '/api'; // Change this to your production API URL

// Modal Functions
function openModal() {
    document.getElementById('inquiryModal').classList.add('active');
    document.getElementById('successMessage').style.display = 'none';
}

function closeModal() {
    document.getElementById('inquiryModal').classList.remove('active');
    document.getElementById('inquiryForm').reset();
    hideAllErrors();
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('inquiryModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\+\-\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function hideError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function hideAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.style.display = 'none');
}

// Form submission
async function handleSubmit(event) {
    event.preventDefault();
    
    // Hide all previous errors
    hideAllErrors();
    
    // Get form data
    const formData = {
        company: document.getElementById('company').value.trim(),
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        interest: document.getElementById('interest').value,
        volume: document.getElementById('volume').value,
        message: document.getElementById('message').value.trim()
    };

    // Validate
    let isValid = true;

    if (formData.company.length < 2) {
        showError('company', 'Company name must be at least 2 characters');
        isValid = false;
    }

    if (formData.name.length < 2) {
        showError('name', 'Name must be at least 2 characters');
        isValid = false;
    }

    if (!validateEmail(formData.email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    if (!validatePhone(formData.phone)) {
        showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }

    if (!formData.interest) {
        showError('interest', 'Please select a product');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Disable submit button
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        const response = await fetch(`${API_BASE_URL}/inquiries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            // Show success message
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('inquiryForm').reset();
            
            // Scroll to top of modal
            document.querySelector('.modal-content').scrollTop = 0;
            
            // Close modal after 3 seconds
            setTimeout(() => {
                closeModal();
            }, 3000);
        } else {
            // Show error
            alert(data.message || 'Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Network error. Please check your connection and try again.');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Inquiry';
    }
}

// Real-time carbon counter animation
function animateCounter() {
    const counter = document.getElementById('carbon-counter');
    let current = 2400000;
    const increment = 0.5; // tonnes per second
    
    setInterval(() => {
        current += increment;
        const displayValue = (current / 1000000).toFixed(1);
        counter.textContent = displayValue + 'M';
    }, 1000);
}

// Initialize animations on load
window.addEventListener('load', () => {
    animateCounter();
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
