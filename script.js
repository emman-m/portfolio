// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Dark mode functionality
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const setTheme = (isDark) => {
    html.classList.toggle('dark', isDark);
    localStorage.theme = isDark ? 'dark' : 'light';
};

// Check for saved theme preference
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    setTheme(true);
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    setTheme(!html.classList.contains('dark'));
});

// Carousel functionality with error handling
const carousel = document.querySelector('.carousel');
const items = carousel?.querySelectorAll('.carousel-item');
let currentIndex = 0;

function showSlide(index) {
    try {
        items.forEach(item => item.classList.remove('active'));
        items[index].classList.add('active');
        currentIndex = index;
    } catch (error) {
        console.error('Error in carousel:', error);
    }
}

function nextSlide() {
    try {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= items.length) {
            nextIndex = 0;
        }
        showSlide(nextIndex);
    } catch (error) {
        console.error('Error in nextSlide:', error);
    }
}

// Auto slide with error handling
let slideInterval;
try {
    slideInterval = setInterval(nextSlide, 7000);
} catch (error) {
    console.error('Error setting up carousel interval:', error);
}

// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
    }
});

// Scroll to Top with debounce
const scrollTop = document.querySelector('.scroll-top');
const handleScroll = debounce(() => {
    if (window.pageYOffset > 100) {
        scrollTop.classList.add('visible');
    } else {
        scrollTop.classList.remove('visible');
    }
}, 100);

window.addEventListener('scroll', handleScroll);
scrollTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form validation and submission
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;
        const formData = new FormData(form);

        // Name validation
        const name = form.querySelector('#name');
        const nameError = form.querySelector('#name-error');
        if (!name.value.trim() || name.value.length < 2) {
            name.classList.add('error');
            nameError.textContent = 'Please enter a valid name (minimum 2 characters)';
            isValid = false;
        } else {
            name.classList.remove('error');
            nameError.textContent = '';
        }

        // Email validation
        const email = form.querySelector('#email');
        const emailError = form.querySelector('#email-error');
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email.value)) {
            email.classList.add('error');
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        } else {
            email.classList.remove('error');
            emailError.textContent = '';
        }

        // Message validation
        const message = form.querySelector('#message');
        const messageError = form.querySelector('#message-error');
        if (!message.value.trim() || message.value.length < 10) {
            message.classList.add('error');
            messageError.textContent = 'Please enter a message (minimum 10 characters)';
            isValid = false;
        } else {
            message.classList.remove('error');
            messageError.textContent = '';
        }

        if (isValid) {
            try {
                // Show loading state
                const submitButton = form.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';

                // Send form data to server
                const response = await fetch('process_contact.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4';
                    successMessage.role = 'alert';
                    successMessage.innerHTML = `
                        <strong class="font-bold">Success!</strong>
                        <span class="block sm:inline">${result.message}</span>
                    `;
                    form.appendChild(successMessage);

                    // Reset form
                    form.reset();

                    // Remove success message after 5 seconds
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                } else {
                    // Show error message
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4';
                    errorMessage.role = 'alert';
                    errorMessage.innerHTML = `
                        <strong class="font-bold">Error!</strong>
                        <span class="block sm:inline">${result.message}</span>
                    `;
                    form.appendChild(errorMessage);

                    // Remove error message after 5 seconds
                    setTimeout(() => {
                        errorMessage.remove();
                    }, 5000);

                    // If there are specific field errors, show them
                    if (result.errors) {
                        Object.entries(result.errors).forEach(([field, message]) => {
                            const fieldElement = form.querySelector(`#${field}`);
                            const errorElement = form.querySelector(`#${field}-error`);
                            if (fieldElement && errorElement) {
                                fieldElement.classList.add('error');
                                errorElement.textContent = message;
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4';
                errorMessage.role = 'alert';
                errorMessage.innerHTML = `
                    <strong class="font-bold">Error!</strong>
                    <span class="block sm:inline">An unexpected error occurred. Please try again later.</span>
                `;
                form.appendChild(errorMessage);

                // Remove error message after 5 seconds
                setTimeout(() => {
                    errorMessage.remove();
                }, 5000);
            } finally {
                // Reset button state
                const submitButton = form.querySelector('button[type="submit"]');
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const errorElement = form.querySelector(`#${input.id}-error`);
            if (errorElement) {
                input.classList.remove('error');
                errorElement.textContent = '';
            }
        });
    });
}

// Update copyright year
document.getElementById('current-year').textContent = new Date().getFullYear();

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements that need animation
document.querySelectorAll('.skill-progress, .testimonial-card, .blog-card').forEach(el => {
    observer.observe(el);
});

// Error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = 'path/to/fallback-image.jpg';
        this.alt = 'Image failed to load';
    });
});

// Project Carousel Functionality
document.querySelectorAll('.project-carousel').forEach(carousel => {
    const inner = carousel.querySelector('.carousel-inner');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const items = carousel.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    let currentIndex = 0;

    // Position all items absolutely and hide them except the first one
    items.forEach((item, index) => {
        item.style.position = 'absolute';
        item.style.top = '0';
        item.style.left = '0';
        item.style.width = '100%';
        item.style.height = '100%';
        item.style.opacity = '0';
        item.style.transition = 'opacity 0.5s ease-in-out';
        item.style.zIndex = '1'; // Default z-index
        if (index === 0) {
            item.style.opacity = '1';
            item.style.zIndex = '10'; // Bring active item to front
        }
    });

    // Function to show a specific slide
    const showSlide = (index) => {
        items[currentIndex].style.opacity = '0'; // Hide current
        items[currentIndex].style.zIndex = '1'; // Reset z-index

        currentIndex = (index + totalItems) % totalItems; // Calculate new index
        
        items[currentIndex].style.opacity = '1'; // Show new
        items[currentIndex].style.zIndex = '10'; // Bring new active item to front
    };

    // Previous button click handler
    prevBtn.addEventListener('click', () => {
        showSlide(currentIndex - 1);
    });

    // Next button click handler
    nextBtn.addEventListener('click', () => {
        showSlide(currentIndex + 1);
    });

    // Ensure inner container takes height of its absolutely positioned children
    // This might require setting min-height on .project-carousel if images aren't loading immediately
    // However, h-48 is already set, which should be sufficient.
}); 