// Main JavaScript file for Study2Study
// Provides interactive functionality and enhancements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initializeSearchFunctionality();
    initializeProgressTracking();
    initializeNavigationEnhancements();
    initializeFormEnhancements();
    initializeLessonFunctionality();
    initializeAccessibilityFeatures();
    initializePerformanceOptimizations();
});

// Search functionality enhancements
function initializeSearchFunctionality() {
    const searchForms = document.querySelectorAll('form[action*="search"]');
    const searchInputs = document.querySelectorAll('input[name="q"]');
    
    searchInputs.forEach(input => {
        // Add search suggestions and autocomplete
        input.addEventListener('input', debounce(handleSearchInput, 300));
        input.addEventListener('focus', showSearchHistory);
        input.addEventListener('keydown', handleSearchKeydown);
    });
    
    // Handle search form submissions
    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const query = this.querySelector('input[name="q"]').value.trim();
            if (!query) {
                e.preventDefault();
                showMessage('Please enter a search term', 'warning');
                return;
            }
            
            // Save to search history
            saveSearchHistory(query);
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalHTML = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i data-feather="loader" class="spinner"></i>';
                feather.replace();
                
                // Restore button after a delay (in case of slow navigation)
                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    feather.replace();
                }, 2000);
            }
        });
    });
}

function handleSearchInput(e) {
    const query = e.target.value.trim();
    if (query.length >= 2) {
        showSearchSuggestions(query, e.target);
    } else {
        hideSearchSuggestions();
    }
}

function handleSearchKeydown(e) {
    const suggestionsList = document.getElementById('search-suggestions');
    if (!suggestionsList) return;
    
    const suggestions = suggestionsList.querySelectorAll('.suggestion-item');
    let currentIndex = Array.from(suggestions).findIndex(item => 
        item.classList.contains('active')
    );
    
    switch(e.key) {
        case 'ArrowDown':
            e.preventDefault();
            currentIndex = Math.min(currentIndex + 1, suggestions.length - 1);
            updateActiveSuggestion(suggestions, currentIndex);
            break;
        case 'ArrowUp':
            e.preventDefault();
            currentIndex = Math.max(currentIndex - 1, -1);
            updateActiveSuggestion(suggestions, currentIndex);
            break;
        case 'Enter':
            if (currentIndex >= 0 && suggestions[currentIndex]) {
                e.preventDefault();
                suggestions[currentIndex].click();
            }
            break;
        case 'Escape':
            hideSearchSuggestions();
            e.target.blur();
            break;
    }
}

function showSearchSuggestions(query, inputElement) {
    // Sample suggestions based on existing course data
    const suggestions = [
        'Python programming', 'JavaScript basics', 'Algebra fundamentals',
        'Physics introduction', 'Calculus', 'Web development', 'Creative writing',
        'Mathematics', 'Science', 'Programming', 'Language Arts'
    ].filter(item => item.toLowerCase().includes(query.toLowerCase()));
    
    if (suggestions.length === 0) return;
    
    // Remove existing suggestions
    hideSearchSuggestions();
    
    // Create suggestions dropdown
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.id = 'search-suggestions';
    suggestionsDiv.className = 'position-absolute bg-white border rounded shadow-sm w-100 mt-1 z-3';
    suggestionsDiv.style.top = '100%';
    
    suggestions.slice(0, 5).forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item px-3 py-2 border-bottom cursor-pointer';
        item.style.cursor = 'pointer';
        item.innerHTML = `<i data-feather="search" class="me-2" style="width: 14px; height: 14px;"></i>${suggestion}`;
        
        item.addEventListener('click', () => {
            inputElement.value = suggestion;
            inputElement.closest('form').submit();
        });
        
        item.addEventListener('mouseenter', () => {
            document.querySelectorAll('.suggestion-item').forEach(el => 
                el.classList.remove('active')
            );
            item.classList.add('active');
        });
        
        suggestionsDiv.appendChild(item);
    });
    
    // Position relative to input
    const inputContainer = inputElement.closest('.input-group') || inputElement.parentElement;
    inputContainer.style.position = 'relative';
    inputContainer.appendChild(suggestionsDiv);
    
    feather.replace();
}

function hideSearchSuggestions() {
    const existing = document.getElementById('search-suggestions');
    if (existing) {
        existing.remove();
    }
}

function updateActiveSuggestion(suggestions, index) {
    suggestions.forEach(item => item.classList.remove('active'));
    if (index >= 0 && suggestions[index]) {
        suggestions[index].classList.add('active');
    }
}

function showSearchHistory() {
    // Show recent searches if available
    const history = getSearchHistory();
    if (history.length > 0) {
        // Implementation for showing search history
        console.log('Search history:', history);
    }
}

function saveSearchHistory(query) {
    try {
        let history = JSON.parse(localStorage.getItem('study2study_search_history') || '[]');
        history = history.filter(item => item !== query); // Remove duplicates
        history.unshift(query); // Add to beginning
        history = history.slice(0, 10); // Keep only last 10 searches
        localStorage.setItem('study2study_search_history', JSON.stringify(history));
    } catch (e) {
        console.warn('Could not save search history:', e);
    }
}

function getSearchHistory() {
    try {
        return JSON.parse(localStorage.getItem('study2study_search_history') || '[]');
    } catch (e) {
        return [];
    }
}

// Progress tracking and persistence
function initializeProgressTracking() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    // Animate progress bars on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.getAttribute('aria-valuenow') + '%';
                progressBar.style.width = targetWidth;
                progressBar.style.transition = 'width 1s ease-in-out';
            }
        });
    }, observerOptions);
    
    progressBars.forEach(bar => {
        bar.style.width = '0%';
        progressObserver.observe(bar);
    });
    
    // Save lesson completion state
    const lessonLinks = document.querySelectorAll('a[href*="/lesson/"]');
    lessonLinks.forEach(link => {
        link.addEventListener('click', function() {
            const href = this.getAttribute('href');
            const matches = href.match(/\/course\/([^\/]+)\/lesson\/([^\/]+)/);
            if (matches) {
                const [, courseId, lessonId] = matches;
                saveLessonProgress(courseId, lessonId);
            }
        });
    });
}

function saveLessonProgress(courseId, lessonId) {
    try {
        const key = `study2study_progress_${courseId}`;
        let progress = JSON.parse(localStorage.getItem(key) || '{}');
        
        if (!progress.completedLessons) {
            progress.completedLessons = [];
        }
        
        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
            progress.lastAccessed = new Date().toISOString();
            localStorage.setItem(key, JSON.stringify(progress));
        }
    } catch (e) {
        console.warn('Could not save lesson progress:', e);
    }
}

// Navigation enhancements
function initializeNavigationEnhancements() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add active state to navigation based on current page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.startsWith(href) && href !== '/') {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
    
    // Mobile navigation improvements
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking a link
        navbarCollapse.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navbarCollapse.classList.contains('show') && 
                !navbarCollapse.contains(e.target) && 
                !navbarToggler.contains(e.target)) {
                navbarToggler.click();
            }
        });
    }
}

// Form enhancements
function initializeFormEnhancements() {
    // Enhanced form validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Real-time validation
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
        
        // Form submission handling
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showMessage('Please correct the errors in the form', 'danger');
                
                // Focus first invalid field
                const firstInvalid = this.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });
    });
    
    // Auto-resize textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', autoResizeTextarea);
        autoResizeTextarea.call(textarea); // Initial resize
    });
    
    // Enhanced file input styling (if any)
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(enhanceFileInput);
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Clear previous validation
    field.classList.remove('is-valid', 'is-invalid');
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(field)} is required`;
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }
    
    // Custom validation based on field name/id
    if (field.name === 'message' || field.id === 'message') {
        if (value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        }
    }
    
    // Apply validation styling
    field.classList.add(isValid ? 'is-valid' : 'is-invalid');
    
    // Show/hide error message
    showFieldError(field, isValid ? '' : errorMessage);
    
    return isValid;
}

function clearFieldError(e) {
    const field = e.target;
    if (field.classList.contains('is-invalid')) {
        field.classList.remove('is-invalid');
        showFieldError(field, '');
    }
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
    
    if (message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
}

function getFieldLabel(field) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) {
        return label.textContent.replace('*', '').trim();
    }
    return field.name || field.id || 'This field';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function autoResizeTextarea() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}

function enhanceFileInput(input) {
    // Create custom file input styling if needed
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-file-input';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
}

// Lesson-specific functionality
function initializeLessonFunctionality() {
    // Reading progress tracking
    if (window.location.pathname.includes('/lesson/')) {
        initializeReadingProgress();
        initializeLessonNavigation();
        initializeBookmarking();
    }
    
    // Keyboard shortcuts for lessons
    document.addEventListener('keydown', handleLessonKeyboard);
}

function initializeReadingProgress() {
    let readingProgress = 0;
    
    const updateReadingProgress = () => {
        const scrolled = window.scrollY;
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        readingProgress = Math.min(100, (scrolled / totalHeight) * 100);
        
        // Update any reading progress indicators
        const indicators = document.querySelectorAll('.reading-progress');
        indicators.forEach(indicator => {
            indicator.style.width = readingProgress + '%';
        });
        
        // Mark as completed when 80% read
        if (readingProgress >= 80) {
            markLessonAsRead();
        }
    };
    
    window.addEventListener('scroll', debounce(updateReadingProgress, 100));
    updateReadingProgress(); // Initial call
}

function initializeLessonNavigation() {
    // Quick navigation between lessons
    const prevButton = document.querySelector('a[href*="/lesson/"]:has(i[data-feather="arrow-left"])');
    const nextButton = document.querySelector('a[href*="/lesson/"]:has(i[data-feather="arrow-right"])');
    
    if (prevButton) {
        prevButton.addEventListener('click', function(e) {
            // Add transition effect
            document.body.style.opacity = '0.8';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 300);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function(e) {
            // Add transition effect
            document.body.style.opacity = '0.8';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 300);
        });
    }
}

function initializeBookmarking() {
    // Add bookmark functionality
    const lessonContent = document.querySelector('.lesson-content');
    if (lessonContent) {
        const bookmarkBtn = document.createElement('button');
        bookmarkBtn.className = 'btn btn-outline-secondary btn-sm position-fixed';
        bookmarkBtn.style.cssText = 'top: 50%; right: 20px; z-index: 1000; transform: translateY(-50%);';
        bookmarkBtn.innerHTML = '<i data-feather="bookmark"></i>';
        bookmarkBtn.title = 'Bookmark this lesson';
        
        bookmarkBtn.addEventListener('click', toggleBookmark);
        document.body.appendChild(bookmarkBtn);
        
        // Update bookmark state
        updateBookmarkButton(bookmarkBtn);
        
        feather.replace();
    }
}

function handleLessonKeyboard(e) {
    if (!window.location.pathname.includes('/lesson/')) return;
    
    // Only handle shortcuts when not in input fields
    if (e.target.tagName.toLowerCase() === 'input' || 
        e.target.tagName.toLowerCase() === 'textarea') {
        return;
    }
    
    switch(e.key) {
        case 'ArrowLeft':
            // Go to previous lesson
            const prevBtn = document.querySelector('a[href*="/lesson/"]:has(i[data-feather="arrow-left"])');
            if (prevBtn) {
                prevBtn.click();
            }
            break;
        case 'ArrowRight':
            // Go to next lesson
            const nextBtn = document.querySelector('a[href*="/lesson/"]:has(i[data-feather="arrow-right"])');
            if (nextBtn) {
                nextBtn.click();
            }
            break;
        case 'b':
            // Toggle bookmark
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                toggleBookmark();
            }
            break;
    }
}

function markLessonAsRead() {
    // Mark lesson as read (already handled server-side, but can add visual feedback)
    console.log('Lesson marked as read');
}

function toggleBookmark() {
    const currentPath = window.location.pathname;
    let bookmarks = getBookmarks();
    
    if (bookmarks.includes(currentPath)) {
        bookmarks = bookmarks.filter(path => path !== currentPath);
        showMessage('Bookmark removed', 'info');
    } else {
        bookmarks.push(currentPath);
        showMessage('Lesson bookmarked', 'success');
    }
    
    saveBookmarks(bookmarks);
    updateBookmarkButton();
}

function getBookmarks() {
    try {
        return JSON.parse(localStorage.getItem('study2study_bookmarks') || '[]');
    } catch (e) {
        return [];
    }
}

function saveBookmarks(bookmarks) {
    try {
        localStorage.setItem('study2study_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
        console.warn('Could not save bookmarks:', e);
    }
}

function updateBookmarkButton(button) {
    const btn = button || document.querySelector('button:has(i[data-feather="bookmark"])');
    if (!btn) return;
    
    const currentPath = window.location.pathname;
    const bookmarks = getBookmarks();
    const isBookmarked = bookmarks.includes(currentPath);
    
    btn.classList.toggle('btn-primary', isBookmarked);
    btn.classList.toggle('btn-outline-secondary', !isBookmarked);
    btn.title = isBookmarked ? 'Remove bookmark' : 'Bookmark this lesson';
}

// Accessibility features
function initializeAccessibilityFeatures() {
    // Skip to content link
    addSkipToContentLink();
    
    // Keyboard navigation improvements
    improveKeyboardNavigation();
    
    // ARIA live regions for dynamic content
    addAriaLiveRegions();
    
    // Focus management
    improveFocusManagement();
    
    // High contrast mode detection
    detectHighContrastMode();
}

function addSkipToContentLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'visually-hidden-focusable btn btn-primary position-absolute';
    skipLink.style.cssText = 'top: 10px; left: 10px; z-index: 9999;';
    skipLink.textContent = 'Skip to main content';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content id if not exists
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main-content';
    }
}

function improveKeyboardNavigation() {
    // Add visible focus indicators
    const style = document.createElement('style');
    style.textContent = `
        .focus-visible {
            outline: 2px solid var(--bs-primary) !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(style);
    
    // Tab trap for modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const modal = document.querySelector('.modal.show');
            if (modal) {
                trapFocusInModal(e, modal);
            }
        }
    });
}

function addAriaLiveRegions() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.id = 'live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'visually-hidden';
    document.body.appendChild(liveRegion);
}

function improveFocusManagement() {
    // Return focus to trigger element after modal closes
    document.addEventListener('hidden.bs.modal', function(e) {
        const trigger = document.querySelector('[data-bs-target="#' + e.target.id + '"]');
        if (trigger) {
            trigger.focus();
        }
    });
}

function detectHighContrastMode() {
    // Detect if user prefers high contrast
    if (window.matchMedia('(prefers-contrast: high)').matches) {
        document.body.classList.add('high-contrast');
    }
}

function announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
        liveRegion.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

// Performance optimizations
function initializePerformanceOptimizations() {
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        lazyLoadImages();
    }
    
    // Preload critical resources
    preloadCriticalResources();
    
    // Service worker registration (if available)
    registerServiceWorker();
    
    // Performance monitoring
    monitorPerformance();
}

function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

function preloadCriticalResources() {
    // Preload next lesson if on lesson page
    if (window.location.pathname.includes('/lesson/')) {
        const nextLessonLink = document.querySelector('a[href*="/lesson/"]:has(i[data-feather="arrow-right"])');
        if (nextLessonLink) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = nextLessonLink.href;
            document.head.appendChild(link);
        }
    }
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered');
            })
            .catch(error => {
                console.log('Service Worker registration failed');
            });
    }
}

function monitorPerformance() {
    // Basic performance monitoring
    window.addEventListener('load', () => {
        setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                console.log('Page load time:', navigation.loadEventEnd - navigation.loadEventStart);
            }
        }, 0);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function showMessage(message, type = 'info', duration = 5000) {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remove after duration
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, duration);
    
    // Announce to screen readers
    announceToScreenReader(message);
}

function trapFocusInModal(e, modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
        }
    } else {
        if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
        }
    }
}

// Add CSS for animations and custom styling
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .suggestion-item.active {
        background-color: var(--bs-primary-bg-subtle);
        color: var(--bs-primary-text-emphasis);
    }
    
    .reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--bs-primary);
        transition: width 0.3s ease;
        z-index: 9999;
    }
    
    .focus-visible {
        outline: 2px solid var(--bs-primary) !important;
        outline-offset: 2px !important;
    }
    
    .high-contrast {
        filter: contrast(150%);
    }
    
    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(dynamicStyles);

// Export functions for use in other scripts
window.Study2Study = {
    showMessage,
    saveSearchHistory,
    getSearchHistory,
    saveLessonProgress,
    toggleBookmark,
    getBookmarks,
    announceToScreenReader
};
