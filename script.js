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

});

// Initialize Lightbox2 configuration when DOM is loaded
$(document).ready(function() {
    // Lightbox2 configuration
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true,
        'albumLabel': 'Image %1 of %2',
        'fadeDuration': 300,
        'imageFadeDuration': 300,
        'positionFromTop': 100,
        'maxWidth': 1200,
        'maxHeight': 800,
        'disableScrolling': true,
        'alwaysShowNavOnTouchDevices': true
    });
}); 