/**
 * K.L.N. College of Engineering Portal Login Interactivity
 * Handles: Validation, Password Toggle, Mock Loader, Success/Error notifications
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const passwordToggleBtn = document.getElementById('passwordToggle');
    const eyeIcon = document.getElementById('eyeIcon');
    const eyeOffIcon = document.getElementById('eyeOffIcon');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    
    // Error Containers
    const formErrorMessage = document.getElementById('formErrorMessage');
    const errorMessageText = document.getElementById('errorMessageText');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    
    // Success Toast
    const successToast = document.getElementById('successToast');

    // 1. Password Visibility Toggle
    passwordToggleBtn.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        
        // Toggle SVGs
        eyeIcon.classList.toggle('hidden', isPassword);
        eyeOffIcon.classList.toggle('hidden', !isPassword);
        
        // Keep focus on password input
        passwordInput.focus();
    });

    // Clear field-specific errors when user inputs data
    usernameInput.addEventListener('input', () => {
        clearFieldError(usernameInput, usernameError);
        hideGlobalError();
    });

    passwordInput.addEventListener('input', () => {
        clearFieldError(passwordInput, passwordError);
        hideGlobalError();
    });

    // Helper functions to show and clear input errors
    function showFieldError(inputEl, errorEl, message) {
        inputEl.style.borderColor = 'var(--clr-error)';
        errorEl.textContent = message;
        errorEl.style.opacity = '1';
    }

    function clearFieldError(inputEl, errorEl) {
        inputEl.style.borderColor = '';
        errorEl.textContent = '';
        errorEl.style.opacity = '0';
    }

    function showGlobalError(message) {
        errorMessageText.textContent = message;
        formErrorMessage.classList.remove('hidden');
        // Trigger reflow to restart animation if error is already shown
        formErrorMessage.style.animation = 'none';
        formErrorMessage.offsetHeight; /* trigger reflow */
        formErrorMessage.style.animation = null;
    }

    function hideGlobalError() {
        formErrorMessage.classList.add('hidden');
    }

    // 2. Form Validation & Simulated Submit Flow
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Reset previous validation states
        let isValid = true;
        clearFieldError(usernameInput, usernameError);
        clearFieldError(passwordInput, passwordError);
        hideGlobalError();

        const usernameVal = usernameInput.value.trim();
        const passwordVal = passwordInput.value;

        // Validation logic
        if (!usernameVal) {
            showFieldError(usernameInput, usernameError, 'Roll Number or Email is required');
            isValid = false;
        } else if (usernameVal.length < 3) {
            showFieldError(usernameInput, usernameError, 'Please enter a valid credential (min 3 characters)');
            isValid = false;
        }

        if (!passwordVal) {
            showFieldError(passwordInput, passwordError, 'Password is required');
            isValid = false;
        } else if (passwordVal.length < 6) {
            showFieldError(passwordInput, passwordError, 'Password must be at least 6 characters');
            isValid = false;
        }

        if (!isValid) return;

        // Start Simulated Loading State
        setSubmittingState(true);

        // Simulate network latency (1.5 seconds)
        setTimeout(() => {
            // Mock authentication rules:
            // 1. If username is "error" or password is "wrong", fail the login to show error states.
            // 2. Otherwise, login successfully.
            if (usernameVal.toLowerCase() === 'error' || passwordVal === 'wrong') {
                setSubmittingState(false);
                showGlobalError('Invalid Roll Number/Email or Password. Please try again.');
            } else {
                // Successful Login Flow
                setSubmittingState(false);
                triggerSuccessToast();
                
                // Optional: Clear form
                loginForm.reset();
            }
        }, 1500);
    });

    // Helper to toggle submit button and input accessibility during loading
    function setSubmittingState(isSubmitting) {
        if (isSubmitting) {
            submitBtn.disabled = true;
            usernameInput.disabled = true;
            passwordInput.disabled = true;
            btnText.classList.add('hidden');
            btnSpinner.classList.remove('hidden');
        } else {
            submitBtn.disabled = false;
            usernameInput.disabled = false;
            passwordInput.disabled = false;
            btnText.classList.remove('hidden');
            btnSpinner.classList.add('hidden');
        }
    }

    // Helper to display toast notifications
    function triggerSuccessToast() {
        successToast.classList.remove('hidden');
        // Tiny timeout to trigger transition
        setTimeout(() => {
            successToast.classList.add('show');
        }, 50);

        // Auto-hide toast after 3 seconds
        setTimeout(() => {
            successToast.classList.remove('show');
            setTimeout(() => {
                successToast.classList.add('hidden');
            }, 500); // Wait for transition out
        }, 3000);
    }
});
