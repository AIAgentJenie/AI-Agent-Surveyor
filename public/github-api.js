// GitHub API Handler
class GitHubAPI {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.currentRepo = null;
        this.currentPath = [];
    }

    async fetch(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`);
            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            showToast(`Error: ${error.message}`, 'error');
            throw error;
        }
    }

    async fetchRepositories() {
        try {
            const repos = await this.fetch('/repos');
            window.uiHandler.displayRepositories(repos);
            return repos;
        } catch (error) {
            showToast('Failed to fetch repositories', 'error');
        }
    }

    async fetchUser() {
        try {
            const user = await this.fetch('/user');
            window.uiHandler.displayUserProfile(user);
            return user;
        } catch (error) {
            showToast('Failed to fetch user profile', 'error');
        }
    }

    async fetchRepositoryContents(owner, repo, path = '') {
        try {
            const endpoint = `/repos/${owner}/${repo}/contents/${path}`;
            const contents = await this.fetch(endpoint);
            return contents;
        } catch (error) {
            showToast('Failed to fetch repository contents', 'error');
            throw error;
        }
    }

    async fetchFileContent(owner, repo, path) {
        try {
            const file = await this.fetch(`/repos/${owner}/${repo}/contents/${path}`);
            return file;
        } catch (error) {
            showToast('Failed to fetch file content', 'error');
            throw error;
        }
    }

    async downloadFile(owner, repo, path) {
        try {
            const response = await fetch(`${this.baseURL}/download/${owner}/${repo}/${path}`);
            if (!response.ok) {
                throw new Error(`Download failed: ${response.statusText}`);
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Extract filename from path
            const filename = path.split('/').pop() || 'file';
            a.download = filename;
            
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showToast(`Downloaded: ${filename}`);
            return true;
        } catch (error) {
            showToast(`Download failed: ${error.message}`, 'error');
            return false;
        }
    }

    async searchRepositories(query) {
        try {
            const results = await this.fetch(`/search/repos?q=${encodeURIComponent(query)}`);
            window.uiHandler.displaySearchResults(results);
            return results;
        } catch (error) {
            showToast('Search failed', 'error');
            throw error;
        }
    }

    async fetchRepositoryTree(owner, repo, recursive = false) {
        try {
            const endpoint = `/repos/${owner}/${repo}/tree?recursive=${recursive}`;
            const tree = await this.fetch(endpoint);
            return tree;
        } catch (error) {
            showToast('Failed to fetch repository tree', 'error');
            throw error;
        }
    }

    setCurrentRepo(owner, repo) {
        this.currentRepo = { owner, repo };
        this.currentPath = [];
    }

    addToPath(item) {
        this.currentPath.push(item);
    }

    removeFromPath(index) {
        this.currentPath = this.currentPath.slice(0, index);
    }

    getCurrentPath() {
        return this.currentPath.join('/');
    }

    clearPath() {
        this.currentPath = [];
    }
}

// Initialize global API handler
window.githubAPI = new GitHubAPI();

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    window.githubAPI.fetchUser();
    window.githubAPI.fetchRepositories();
});
