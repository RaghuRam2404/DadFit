// Contact Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // Range slider value updates
    const fitnessLevelSlider = document.getElementById('currentFitnessLevel');
    const fitnessLevelValue = document.getElementById('fitnessLevelValue');
    const motivationSlider = document.getElementById('motivationLevel');
    const motivationValue = document.getElementById('motivationLevelValue');
    
    if (fitnessLevelSlider && fitnessLevelValue) {
        fitnessLevelSlider.addEventListener('input', function() {
            fitnessLevelValue.textContent = this.value;
        });
    }
    
    if (motivationSlider && motivationValue) {
        motivationSlider.addEventListener('input', function() {
            motivationValue.textContent = this.value;
        });
    }
    
    // Character counter for textarea
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            
            // Change color when approaching limit
            if (count > 900) {
                charCount.style.color = '#dc3545';
            } else if (count > 800) {
                charCount.style.color = '#ffc107';
            } else {
                charCount.style.color = 'var(--primary-dark)';
            }
        });
        
        // Enforce max length
        messageTextarea.addEventListener('input', function() {
            if (this.value.length > 1000) {
                this.value = this.value.substring(0, 1000);
                charCount.textContent = 1000;
            }
        });
    }
    
    // Checkbox "None" behavior
    const healthNone = document.getElementById('healthNone');
    const healthCheckboxes = document.querySelectorAll('input[name="healthConditions"]:not(#healthNone)');
    
    if (healthNone) {
        healthNone.addEventListener('change', function() {
            if (this.checked) {
                healthCheckboxes.forEach(cb => {
                    cb.checked = false;
                });
            }
        });
        
        healthCheckboxes.forEach(cb => {
            cb.addEventListener('change', function() {
                if (this.checked && healthNone.checked) {
                    healthNone.checked = false;
                }
            });
        });
    }
    
    // Form validation and submission
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const btnSubmit = document.querySelector('.btn-submit');
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.querySelector('.btn-loader');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Remove previous validation states
            const inputs = contactForm.querySelectorAll('.form-control, .form-select');
            inputs.forEach(input => {
                input.classList.remove('is-invalid', 'is-valid');
            });
            
            // Check form validity
            let isValid = true;
            
            // Validate required text inputs
            const requiredInputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.add('is-valid');
                }
            });
            
            // Validate email
            const emailInput = document.getElementById('email');
            if (emailInput && emailInput.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    emailInput.classList.add('is-invalid');
                    emailInput.classList.remove('is-valid');
                    isValid = false;
                }
            }
            
            // Validate phone
            const phoneInput = document.getElementById('phone');
            if (phoneInput && phoneInput.value) {
                const phoneRegex = /^[0-9]{10}$/;
                if (!phoneRegex.test(phoneInput.value)) {
                    phoneInput.classList.add('is-invalid');
                    phoneInput.classList.remove('is-valid');
                    isValid = false;
                }
            }
            
            if (!isValid) {
                // Scroll to first invalid field
                const firstInvalid = contactForm.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstInvalid.focus();
                }
                return;
            }
            
            // Show loading state
            btnSubmit.disabled = true;
            btnText.classList.add('d-none');
            btnLoader.classList.remove('d-none');
            
            // Collect form data
            const formData = new FormData(contactForm);
            const data = {};
            
            // Process regular form fields
            for (let [key, value] of formData.entries()) {
                if (key === 'healthConditions') {
                    if (!data[key]) {
                        data[key] = [];
                    }
                    data[key].push(value);
                } else {
                    data[key] = value;
                }
            }
            
            // Log form data (replace with actual Zoho CRM integration)
            console.log('Form Data:', data);
            
            // Simulate API call
            setTimeout(function() {
                // Hide form and show success message
                contactForm.classList.add('d-none');
                successMessage.classList.remove('d-none');
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Reset form
                contactForm.reset();
                
                // Reset slider values
                if (fitnessLevelValue) fitnessLevelValue.textContent = '5';
                if (motivationValue) motivationValue.textContent = '5';
                if (charCount) charCount.textContent = '0';
                
                // Reset button state
                btnSubmit.disabled = false;
                btnText.classList.remove('d-none');
                btnLoader.classList.add('d-none');
                
                // Remove validation classes
                inputs.forEach(input => {
                    input.classList.remove('is-invalid', 'is-valid');
                });
            }, 2000);
        });
    }
    
    // Real-time validation on blur
    const formInputs = document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required')) {
                if (!this.value.trim()) {
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                } else {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                }
            }
        });
        
        // Remove invalid class on input
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                this.classList.remove('is-invalid');
            }
        });
    });
});
