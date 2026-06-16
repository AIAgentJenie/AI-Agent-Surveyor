// UI Handler - Manages all UI interactions
class UIHandler {
    constructor() {
        this.currentView = 'welcome';
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('searchBtn')?.addEventListener('click', () => {
            const query = document.getElementById('searchInput').value;
            if (query) {
                window.githubAPI.searchRepositories(query);
            }
        });

        // Download button
        document.getElementById('downloadBtn')?.addEventListener('click', () => {
            this.downloadCurrentFile();
        });

        // Back button
        document.getElementById('backBtn')?.addEventListener('click', () => {
            this.goBack();
        });

        // Enter key in search
        document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('searchBtn').click();
            }
        });
    }

    displayUserProfile(user) {
        const profileEl = document.getElementById('userProfile');
        if (profileEl) {
            profileEl.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <img src="${user.avatar_url}" style="width: 32px; height: 32px; border-radius: 50%;" alt="User">
                    <div>
                        <div><strong>${user.name || user.login}</strong></div>
                        <div style="font-size: 0.8rem; opacity: 0.8;">${user.public_repos} repos • ${user.followers} followers</div>
                    </div>
                </div>
            `;
        }
    }

    displayRepositories(repos) {
        const reposList = document.getElementById('reposList');
        if (!reposList) return;

        if (!repos || repos.length === 0) {
            reposList.innerHTML = '<p class="loading">No repositories found</p>';
            return;
        }

        reposList.innerHTML = repos.map(repo => `
            <div class="repo-item" data-owner="${repo.owner.login}" data-repo="${repo.name}">
                <div class="repo-item-name">📁 ${repo.name}</div>
                <div class="repo-item-desc">${repo.description || 'No description'}</div>
            </div>
        `).join('');

        // Add click listeners
        document.querySelectorAll('.repo-item').forEach(item => {
            item.addEventListener('click', () => {
                this.openRepository(
                    item.dataset.owner,
                    item.dataset.repo
                );
            });
        });
    }

    displaySearchResults(results) {
        this.displayRepositories(results);
    }

    async openRepository(owner, repo) {
        try {
            window.githubAPI.setCurrentRepo(owner, repo);
            
            // Update active repo item
            document.querySelectorAll('.repo-item').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelector(`[data-owner="${owner}"][data-repo="${repo}"]`)?.classList.add('active');

            // Fetch and display contents
            const contents = await window.githubAPI.fetchRepositoryContents(owner, repo);
            this.displayRepositoryView(owner, repo, contents);
        } catch (error) {
            showToast('Failed to open repository', 'error');
        }
    }

    displayRepositoryView(owner, repo, contents) {
        const repoName = document.getElementById('repoName');
        const repoDesc = document.getElementById('repoDesc');
        
        repoName.textContent = `${owner}/${repo}`;
        repoDesc.textContent = `Browsing repository contents`;

        this.displayFileList(contents, owner, repo);
        this.showView('repoView');
    }

    displayFileList(items, owner, repo) {
        const fileList = document.getElementById('fileList');
        const breadcrumb = document.getElementById('breadcrumb');

        // Display breadcrumb
        breadcrumb.innerHTML = '<span class="breadcrumb-item" data-path="">📁 Root</span>';
        
        window.githubAPI.currentPath.forEach((item, index) => {
            const breadcrumbItem = document.createElement('span');
            breadcrumbItem.className = 'breadcrumb-item';
            breadcrumbItem.textContent = `📄 ${item}`;
            breadcrumbItem.dataset.path = index;
            breadcrumbItem.addEventListener('click', () => {
                window.githubAPI.removeFromPath(index);
                this.navigatePath(owner, repo);
            });
            breadcrumb.appendChild(breadcrumbItem);
        });

        // Root breadcrumb click
        breadcrumb.querySelector('[data-path=""]')?.addEventListener('click', () => {
            window.githubAPI.clearPath();
            this.navigatePath(owner, repo);
        });

        // Display files
        if (!Array.isArray(items)) {
            fileList.innerHTML = '<p class="loading">Unable to display contents</p>';
            return;
        }

        fileList.innerHTML = items.map(item => {
            const icon = item.type === 'dir' ? '📁' : '📄';
            const name = item.name;
            
            return `
                <div class="file-item" data-type="${item.type}" data-path="${item.path}" data-name="${name}">
                    <span class="file-icon">${icon}</span>
                    <span class="file-item-name">${name}</span>
                </div>
            `;
        }).join('');

        // Add click listeners
        document.querySelectorAll('.file-item').forEach(item => {
            item.addEventListener('click', async () => {
                const type = item.dataset.type;
                const path = item.dataset.path;
                const name = item.dataset.name;

                if (type === 'dir') {
                    window.githubAPI.addToPath(name);
                    await this.navigatePath(owner, repo);
                } else if (type === 'file') {
                    await this.openFile(owner, repo, path, name);
                }
            });
        });
    }

    async navigatePath(owner, repo) {
        try {
            const path = window.githubAPI.getCurrentPath();
            const contents = await window.githubAPI.fetchRepositoryContents(owner, repo, path);
            this.displayFileList(contents, owner, repo);
        } catch (error) {
            showToast('Navigation failed', 'error');
        }
    }

    async openFile(owner, repo, path, name) {
        try {
            const file = await window.githubAPI.fetchFileContent(owner, repo, path);
            
            document.getElementById('fileName').textContent = name;
            document.getElementById('fileContent').textContent = file.decoded_content || '[Binary file]';
            
            // Store file info for download
            document.getElementById('downloadBtn').dataset.owner = owner;
            document.getElementById('downloadBtn').dataset.repo = repo;
            document.getElementById('downloadBtn').dataset.path = path;
            
            this.showView('fileView');
        } catch (error) {
            showToast('Failed to open file', 'error');
        }
    }

    async downloadCurrentFile() {
        const downloadBtn = document.getElementById('downloadBtn');
        const owner = downloadBtn.dataset.owner;
        const repo = downloadBtn.dataset.repo;
        const path = downloadBtn.dataset.path;

        if (!owner || !repo || !path) {
            showToast('No file selected for download', 'error');
            return;
        }

        await window.githubAPI.downloadFile(owner, repo, path);
    }

    goBack() {
        if (this.currentView === 'fileView') {
            this.showView('repoView');
        } else {
            this.showView('welcomeView');
        }
    }

    showView(viewId) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.add('hidden');
        });
        
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.remove('hidden');
            this.currentView = viewId;
        }
    }
}

// Initialize global UI handler
window.uiHandler = new UIHandler();
