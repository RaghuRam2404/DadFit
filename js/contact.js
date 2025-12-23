// Contact Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // Range slider value updates
    const motivationSlider = document.getElementById('motivationLevel');
    const motivationValue = document.getElementById('motivationLevelValue');
    
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
    
    // Zoho CRM Email Validation Function
    function validateEmail() {
        const emailFld = document.querySelectorAll('[ftype=email]');
        for (let i = 0; i < emailFld.length; i++) {
            const emailVal = emailFld[i].value;
            if ((emailVal.replace(/^\s+|\s+$/g, '')).length != 0) {
                const atpos = emailVal.indexOf('@');
                const dotpos = emailVal.lastIndexOf('.');
                if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= emailVal.length) {
                    alert('Please enter a valid email address.');
                    emailFld[i].focus();
                    return false;
                }
            }
        }
        return true;
    }
    
    // Zoho CRM Mandatory Field Check Function
    function checkMandatory() {
        const mndFileds = ['Last Name', 'Email', 'Mobile', 'LEADCF51', 'LEADCF52', 'Company'];
        const fldLangVal = ['Last Name', 'Email', 'Phone Number', 'Number of Kids', 'Age', 'Company/Profession'];
        
        for (let i = 0; i < mndFileds.length; i++) {
            const fieldObj = document.forms['WebToLeads1166383000000602627'][mndFileds[i]];
            if (fieldObj) {
                if (((fieldObj.value).replace(/^\s+|\s+$/g, '')).length == 0) {
                    if (fieldObj.type == 'file') {
                        alert('Please select a file to upload.');
                        fieldObj.focus();
                        return false;
                    }
                    alert(fldLangVal[i] + ' cannot be empty.');
                    fieldObj.focus();
                    return false;
                } else if (fieldObj.nodeName == 'SELECT') {
                    if (fieldObj.options[fieldObj.selectedIndex].value == '-None-') {
                        alert(fldLangVal[i] + ' cannot be none.');
                        fieldObj.focus();
                        return false;
                    }
                } else if (fieldObj.type == 'checkbox') {
                    if (fieldObj.checked == false) {
                        alert('Please accept ' + fldLangVal[i]);
                        fieldObj.focus();
                        return false;
                    }
                }
            }
        }
        
        if (!validateEmail()) {
            return false;
        }
        
        // Handle smarturl service parameter if present
        const urlparams = new URLSearchParams(window.location.search);
        if (urlparams.has('service') && (urlparams.get('service') === 'smarturl')) {
            const webform = document.getElementById('contactForm');
            const service = urlparams.get('service');
            const smarturlfield = document.createElement('input');
            smarturlfield.setAttribute('type', 'hidden');
            smarturlfield.setAttribute('value', service);
            smarturlfield.setAttribute('name', 'service');
            webform.appendChild(smarturlfield);
        }
        
        return true;
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
            
            // Run Zoho CRM validation
            if (!checkMandatory()) {
                return;
            }
            
            // Show loading state
            btnSubmit.disabled = true;
            btnText.classList.add('d-none');
            btnLoader.classList.remove('d-none');
            
            // Set character encoding
            document.charset = 'UTF-8';
            
            // Submit form to Zoho CRM
            contactForm.submit();
            
            // Show success message after a short delay
            setTimeout(function() {
                // Hide form and show success message
                contactForm.classList.add('d-none');
                successMessage.classList.remove('d-none');
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 1000);
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
