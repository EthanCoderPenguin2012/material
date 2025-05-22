document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    // Function to close all open dropdowns
    function closeAllDropdowns(exceptToggle = null) {
        dropdownToggles.forEach(toggle => {
            if (toggle !== exceptToggle) {
                const dropdownContent = toggle.nextElementSibling;
                if (dropdownContent && dropdownContent.classList.contains('show')) {
                    dropdownContent.classList.remove('show');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    dropdownToggles.forEach(toggle => {
        const dropdownContent = toggle.nextElementSibling; // The div containing menu items

        // Click handler for toggling dropdowns
        toggle.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent document click from closing immediately

            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Close other dropdowns before opening this one
            closeAllDropdowns(this);

            if (!isExpanded) {
                dropdownContent.classList.add('show');
                this.setAttribute('aria-expanded', 'true');
                // Move focus to the first item in the dropdown
                const firstMenuItem = dropdownContent.querySelector('[role="menuitem"]');
                if (firstMenuItem) {
                    firstMenuItem.focus();
                }
            } else {
                dropdownContent.classList.remove('show');
                this.setAttribute('aria-expanded', 'false');
            }
        });

        // Keyboard navigation for dropdown menu
        dropdownContent.addEventListener('keydown', function(event) {
            const menuItems = Array.from(this.querySelectorAll('[role="menuitem"]'));
            const focusedItemIndex = menuItems.indexOf(document.activeElement);

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault(); // Prevent page scroll
                    if (focusedItemIndex < menuItems.length - 1) {
                        menuItems[focusedItemIndex + 1].focus();
                    } else {
                        menuItems[0].focus(); // Wrap around to first item
                    }
                    break;
                case 'ArrowUp':
                    event.preventDefault(); // Prevent page scroll
                    if (focusedItemIndex > 0) {
                        menuItems[focusedItemIndex - 1].focus();
                    } else {
                        menuItems[menuItems.length - 1].focus(); // Wrap around to last item
                    }
                    break;
                case 'Escape':
                    closeAllDropdowns();
                    toggle.focus(); // Return focus to the toggle button
                    break;
                case 'Enter':
                case ' ': // Spacebar
                    event.preventDefault(); // Prevent space from scrolling
                    if (document.activeElement.tagName === 'A' || document.activeElement.tagName === 'BUTTON') {
                        document.activeElement.click(); // Simulate click on the focused menu item
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
                    break;
            }
        });

        // Add keydown listener to the toggle button for initial keyboard access
        toggle.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowDown' && this.getAttribute('aria-expanded') === 'true') {
                event.preventDefault();
                const firstMenuItem = dropdownContent.querySelector('[role="menuitem"]');
                if (firstMenuItem) {
                    firstMenuItem.focus();
                }
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) { // Check if the click was NOT inside a dropdown component
            closeAllDropdowns();
        }
    });

    // Close dropdowns when focus leaves the entire dropdown component (toggle + content)
    document.addEventListener('focusin', function(event) {
        const isClickInsideDropdown = event.target.closest('.dropdown');
        if (!isClickInsideDropdown) {
            closeAllDropdowns();
        }
    });
});
