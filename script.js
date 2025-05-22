document.addEventListener('DOMContentLoaded', function() {
    // --- Dropdown Functionality ---
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const dropdowns = document.querySelectorAll('.dropdown-content');

    // Function to close all open dropdowns
    function closeAllDropdowns() {
        dropdowns.forEach(dropdown => {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
                const toggleButton = dropdown.previousElementSibling; // Assuming button is always before content
                if (toggleButton && toggleButton.classList.contains('dropdown-toggle')) {
                    toggleButton.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    dropdownToggles.forEach(toggle => {
        const dropdownContent = toggle.nextElementSibling;

        // Click handler for toggling dropdowns
        toggle.addEventListener('click', function(event) {
            // Check if this dropdown is already expanded
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Close all other dropdowns before processing this one
            closeAllDropdowns();

            // If it was not expanded, open it now
            if (!isExpanded) {
                dropdownContent.classList.add('show');
                this.setAttribute('aria-expanded', 'true');
                // Move focus to the first item in the dropdown for accessibility
                const firstMenuItem = dropdownContent.querySelector('[role="menuitem"]');
                if (firstMenuItem) {
                    firstMenuItem.focus();
                }
            }
            // If it was already expanded, closeAllDropdowns() already handled closing it.
            // No additional action needed here for closing.
        });

        // Keyboard navigation for dropdown menu items
        dropdownContent.addEventListener('keydown', function(event) {
            const menuItems = Array.from(this.querySelectorAll('[role="menuitem"]'));
            const focusedItemIndex = menuItems.indexOf(document.activeElement);

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault(); // Prevent page scroll
                    if (focusedItemIndex < menuItems.length - 1) {
                        menuItems[focusedItemIndex + 1].focus();
                    } else if (menuItems.length > 0) { // Wrap around to first item
                        menuItems[0].focus();
                    }
                    break;
                case 'ArrowUp':
                    event.preventDefault(); // Prevent page scroll
                    if (focusedItemIndex > 0) {
                        menuItems[focusedItemIndex - 1].focus();
                    } else if (menuItems.length > 0) { // Wrap around to last item
                        menuItems[menuItems.length - 1].focus();
                    }
                    break;
                case 'Escape':
                    closeAllDropdowns();
                    toggle.focus(); // Return focus to the toggle button
                    break;
                case 'Enter':
                case ' ': // Spacebar
                    event.preventDefault(); // Prevent space from scrolling
                    // Simulate click only if the active element is a link or button within the menu
                    if (document.activeElement.tagName === 'A' || document.activeElement.tagName === 'BUTTON') {
                        document.activeElement.click();
                        // Close dropdown after selection (common UX)
                        closeAllDropdowns();
                    }
                    break;
                case 'Tab':
                    // If tabbing out of the last item in an open dropdown, close it
                    if (!event.shiftKey && focusedItemIndex === menuItems.length - 1) {
                        closeAllDropdowns();
                    }
                    // If shift-tabbing out of the first item, close it
                    if (event.shiftKey && focusedItemIndex === 0) {
                        closeAllDropdowns();
                    }
                    // For tabs that stay within the menu (e.g., in the middle), let default behavior happen
                    break;
            }
        });

        // Add keydown listener to the toggle button for initial keyboard access to menu
        toggle.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowDown' && this.getAttribute('aria-expanded') === 'true') {
                event.preventDefault();
                const firstMenuItem = dropdownContent.querySelector('[role="menuitem"]');
                if (firstMenuItem) {
                    firstMenuItem.focus();
                }
            } else if (event.key === 'Escape' && this.getAttribute('aria-expanded') === 'true') {
                closeAllDropdowns();
                this.focus(); // Keep focus on toggle
            }
        });
    });

    // Global click listener to close dropdowns when clicking anywhere outside a dropdown component
    document.addEventListener('click', function(event) {
        // If the click target, or any of its ancestors, is not a .dropdown component AND not the theme switch, close all dropdowns.
        if (!event.target.closest('.dropdown') && !event.target.closest('.theme-switch')) {
            closeAllDropdowns();
        }
    });

    // Global focusin listener to close dropdowns when focus moves anywhere outside a dropdown component
    document.addEventListener('focusin', function(event) {
        // If the focused element, or any of its ancestors, is not a .dropdown component AND not the theme switch, close all dropdowns.
        if (!event.target.closest('.dropdown') && !event.target.closest('.theme-switch')) {
            closeAllDropdowns();
        }
    });


    // --- Dark Mode Functionality ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Function to apply the chosen theme
    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            darkModeToggle.checked = true;
        } else {
            body.classList.remove('dark-theme');
            darkModeToggle.checked = false;
        }
        localStorage.setItem('theme', theme); // Save preference
    }

    // Apply saved theme on page load or default to system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // If no saved theme, check system preference
        applyTheme('dark');
    } else {
        // Default to light theme if no preference found
        applyTheme('light');
    }

    // Listen for changes on the dark mode toggle
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    });

    // Optionally, listen for system theme changes if no preference is saved
    // This allows the site to react dynamically if the user changes their OS theme
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        // Only react to system changes if user hasn't explicitly set a theme
        if (!localStorage.getItem('theme')) {
            applyTheme(event.matches ? 'dark' : 'light');
        }
    });
});
