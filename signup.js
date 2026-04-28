
        // DOM Elements
        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');
        const step3 = document.getElementById('step3');
        
        const step1Form = document.getElementById('step1-form');
        const step2Form = document.getElementById('step2-form');
        const step3Form = document.getElementById('step3-form');
        const successMessage = document.getElementById('successMessage');
        
        const nextStep1Btn = document.getElementById('nextStep1');
        const nextStep2Btn = document.getElementById('nextStep2');
        const backStep1Btn = document.getElementById('backStep1');
        const backStep2Btn = document.getElementById('backStep2');
        const completeSignupBtn = document.getElementById('completeSignup');
        
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        // Form validation functions
        function validateStep1() {
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            const terms = document.getElementById('terms').checked;
            
            let isValid = true;
            
            // Validate name
            if (fullName.length < 2) {
                showError('nameError', 'Please enter a valid name');
                isValid = false;
            } else {
                hideError('nameError');
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError('emailError', 'Please enter a valid email address');
                isValid = false;
            } else {
                hideError('emailError');
            }
            
            // Validate password
            if (password.length < 8) {
                showError('passwordError', 'Password must be at least 8 characters');
                isValid = false;
            } else {
                hideError('passwordError');
            }
            
            // Validate password confirmation
            if (password !== confirmPassword) {
                showError('confirmError', 'Passwords do not match');
                isValid = false;
            } else {
                hideError('confirmError');
            }
            
            // Validate terms
            if (!terms) {
                alert('Please agree to the Terms of Service and Privacy Policy');
                isValid = false;
            }
            
            return isValid;
        }
        
        function showError(elementId, message) {
            const errorElement = document.getElementById(elementId);
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            
            // Highlight the input field
            const inputId = elementId.replace('Error', '');
            const inputElement = document.getElementById(inputId);
            if (inputElement) {
                inputElement.classList.add('error');
            }
        }
        
        function hideError(elementId) {
            const errorElement = document.getElementById(elementId);
            errorElement.style.display = 'none';
            
            // Remove error highlight from input field
            const inputId = elementId.replace('Error', '');
            const inputElement = document.getElementById(inputId);
            if (inputElement) {
                inputElement.classList.remove('error');
            }
        }
        
        // Password strength checker
        function checkPasswordStrength(password) {
            let strength = 0;
            
            // Length check
            if (password.length >= 8) strength++;
            if (password.length >= 12) strength++;
            
            // Complexity checks
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;
            
            return strength;
        }
        
        function updatePasswordStrength() {
            const password = passwordInput.value;
            const strength = checkPasswordStrength(password);
            
            // Update visual indicator
            let width = 0;
            let text = 'Password strength: ';
            let color = '#e74c3c'; // Red
            
            switch(strength) {
                case 0:
                case 1:
                    width = 20;
                    text += 'Very Weak';
                    break;
                case 2:
                    width = 40;
                    text += 'Weak';
                    color = '#e67e22'; // Orange
                    break;
                case 3:
                    width = 60;
                    text += 'Fair';
                    color = '#f1c40f'; // Yellow
                    break;
                case 4:
                    width = 80;
                    text += 'Good';
                    color = '#2ecc71'; // Green
                    break;
                case 5:
                    width = 100;
                    text += 'Strong';
                    color = '#27ae60'; // Dark Green
                    break;
            }
            
            strengthFill.style.width = `${width}%`;
            strengthFill.style.backgroundColor = color;
            strengthText.textContent = text;
            strengthText.style.color = color;
        }
        
        // Step navigation functions
        function goToStep2() {
            if (validateStep1()) {
                step1.classList.remove('active');
                step1.classList.add('completed');
                step2.classList.add('active');
                
                step1Form.classList.remove('active');
                step2Form.classList.add('active');
            }
        }
        
        function goToStep3() {
            step2.classList.remove('active');
            step2.classList.add('completed');
            step3.classList.add('active');
            
            step2Form.classList.remove('active');
            step3Form.classList.add('active');
        }
        
        function goBackToStep1() {
            step1.classList.add('active');
            step2.classList.remove('active');
            step2.classList.remove('completed');
            
            step1Form.classList.add('active');
            step2Form.classList.remove('active');
        }
        
        function goBackToStep2() {
            step2.classList.add('active');
            step3.classList.remove('active');
            
            step2Form.classList.add('active');
            step3Form.classList.remove('active');
        }
        
        function completeSignup() {
            // In a real application, you would submit the form data to a server here
            // For this demo, we'll just show the success message
            
            // Hide all form steps
            step1Form.style.display = 'none';
            step2Form.style.display = 'none';
            step3Form.style.display = 'none';
            
            // Show success message
            successMessage.style.display = 'block';
            
            // Update progress steps
            step3.classList.remove('active');
            step3.classList.add('completed');
        }
        
        // Event Listeners
        nextStep1Btn.addEventListener('click', goToStep2);
        nextStep2Btn.addEventListener('click', goToStep3);
        backStep1Btn.addEventListener('click', goBackToStep1);
        backStep2Btn.addEventListener('click', goBackToStep2);
        completeSignupBtn.addEventListener('click', completeSignup);
        
        // Password strength real-time feedback
        passwordInput.addEventListener('input', updatePasswordStrength);
        
        // Confirm password real-time validation
        confirmPasswordInput.addEventListener('input', function() {
            const password = passwordInput.value;
            const confirmPassword = this.value;
            
            if (confirmPassword && password !== confirmPassword) {
                showError('confirmError', 'Passwords do not match');
            } else {
                hideError('confirmError');
            }
        });
        
        // Form submission (for the first step form)
        document.getElementById('signupForm').addEventListener('submit', function(e) {
            e.preventDefault();
            goToStep2();
        });
        
        // Social login buttons
        document.querySelectorAll('.social-btn').forEach(button => {
            button.addEventListener('click', function() {
                const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
                alert(`In a real application, this would redirect to ${provider} authentication`);
            });
        });
        
        // Initialize password strength display
        updatePasswordStrength();
    