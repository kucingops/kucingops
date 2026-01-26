// Window controls functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all windows
    const windows = document.querySelectorAll('.window');

    windows.forEach(window => {
        const minimizeBtn = window.querySelector('.btn-minimize');
        const maximizeBtn = window.querySelector('.btn-maximize');
        const windowBody = window.querySelector('.window-body');

        // Minimize functionality
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                windowBody.classList.toggle('minimized');

                if (windowBody.classList.contains('minimized')) {
                    windowBody.style.display = 'none';
                    minimizeBtn.textContent = '▭';
                } else {
                    windowBody.style.display = 'block';
                    minimizeBtn.textContent = '_';
                }
            });
        }

        // Maximize functionality
        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.classList.toggle('maximized');

                if (window.classList.contains('maximized')) {
                    maximizeBtn.textContent = '❐';
                } else {
                    maximizeBtn.textContent = '□';
                }
            });
        }
    });
});
