// Voice Handler - Speech Recognition and Text-to-Speech
class VoiceHandler {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.transcript = '';
        this.initializeSpeechRecognition();
    }

    initializeSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.warn('Speech Recognition not supported in this browser');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateVoiceButton();
        };

        this.recognition.onresult = (event) => {
            this.transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                this.transcript += transcript;
            }
            this.updateTranscript();
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            showToast(`Voice error: ${event.error}`, 'error');
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateVoiceButton();
            if (this.transcript) {
                this.handleVoiceCommand(this.transcript);
            }
        };
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            this.transcript = '';
            this.recognition.start();
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    updateVoiceButton() {
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceStatus = document.getElementById('voiceStatus');
        
        if (this.isListening) {
            voiceBtn.classList.add('listening');
            voiceStatus.textContent = 'Listening...';
        } else {
            voiceBtn.classList.remove('listening');
            voiceStatus.textContent = 'Click to speak';
        }
    }

    updateTranscript() {
        const transcriptEl = document.getElementById('transcript');
        transcriptEl.textContent = this.transcript || 'Listening...';
    }

    async handleVoiceCommand(command) {
        const cmd = command.toLowerCase().trim();
        console.log('Voice command:', cmd);

        if (cmd.includes('show repositories')) {
            await window.githubAPI.fetchRepositories();
        } else if (cmd.includes('open')) {
            const repoName = cmd.replace('open', '').trim();
            await this.searchAndOpen(repoName);
        } else if (cmd.includes('download')) {
            const downloadBtn = document.getElementById('downloadBtn');
            if (downloadBtn && !downloadBtn.disabled) {
                downloadBtn.click();
            }
        } else if (cmd.includes('search')) {
            const keyword = cmd.replace('search', '').trim();
            document.getElementById('searchInput').value = keyword;
            document.getElementById('searchBtn').click();
        } else if (cmd.includes('back')) {
            document.getElementById('backBtn')?.click();
        } else {
            showToast(`Command not recognized: "${command}". Try "show repositories" or "download".`);
        }
    }

    async searchAndOpen(repoName) {
        const repos = document.querySelectorAll('.repo-item');
        for (const repo of repos) {
            if (repo.textContent.toLowerCase().includes(repoName.toLowerCase())) {
                repo.click();
                this.speak(`Opening ${repoName}`);
                return;
            }
        }
        showToast(`Repository "${repoName}" not found.`);
    }

    speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;
            speechSynthesis.speak(utterance);
        }
    }

    isSupported() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        return !!SpeechRecognition;
    }
}

// Initialize global voice handler
const voiceHandler = new VoiceHandler();

// Voice button event listener
document.addEventListener('DOMContentLoaded', () => {
    const voiceBtn = document.getElementById('voiceBtn');
    
    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            voiceHandler.toggleListening();
        });
    }

    // Space bar to toggle voice
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            voiceHandler.startListening();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'Space' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            voiceHandler.stopListening();
        }
    });

    if (!voiceHandler.isSupported()) {
        const voiceStatus = document.getElementById('voiceStatus');
        if (voiceStatus) {
            voiceStatus.textContent = 'Voice not supported';
        }
    }
});

// Helper function to show toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
