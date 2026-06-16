// Main Application Entry Point
document.addEventListener('DOMContentLoaded', () => {
    console.log('🤖 AI Agent Jenie initialized!');
    
    // Display welcome message
    window.uiHandler.showView('welcomeView');
    
    // Optional: Greet user with voice
    if (voiceHandler && voiceHandler.speak) {
        setTimeout(() => {
            voiceHandler.speak('Welcome to AI Agent Jenie! Click the microphone to speak commands.');
        }, 500);
    }

    // Log initial status
    logStatus();
});

function logStatus() {
    console.log('=== AI Agent Jenie Status ===');
    console.log('✓ Voice Recognition:', voiceHandler?.isSupported() ? 'Enabled' : 'Not supported');
    console.log('✓ GitHub API:', window.githubAPI ? 'Connected' : 'Not connected');
    console.log('✓ UI Handler:', window.uiHandler ? 'Ready' : 'Not ready');
    console.log('✓ Base URL:', window.githubAPI?.baseURL);
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showToast('An error occurred. Check console for details.', 'error');
});

// Unhandled promise rejection
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason);
    showToast('An unexpected error occurred.', 'error');
});

// Export showToast globally
window.showToast = showToast;

// Keyboard shortcuts help
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === '?') {
        alert(`
AI Agent Jenie - Keyboard Shortcuts:
- SPACE: Hold to speak voice commands
- CTRL + ?: Show this help
- Click on repository to browse
- Click on file to view content
- Use 'Download' button to save files

Voice Commands:
- "Show repositories" - List all repos
- "Open [repo name]" - Open a repository  
- "Download" - Download current file
- "Search [keyword]" - Search repos
- "Back" - Go back to previous view
        `);
    }
});
