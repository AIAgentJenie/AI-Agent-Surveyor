# 🤖 AI Agent Jenie - GitHub Explorer with Voice Control

AI Agent Jenie is an innovative GitHub repository explorer that combines voice recognition, text-to-speech, and a modern web interface to make browsing GitHub repositories effortless.

## Features

✨ **Voice-Activated Navigation**
- Speak to control the application
- Voice commands for opening repositories, searching, and downloading files
- Text-to-speech feedback from the agent

🎤 **Smart Voice Commands**
- "Show repositories" - List all your repositories
- "Open [repo name]" - Open a specific repository
- "Download" - Download the current file
- "Search [keyword]" - Search for repositories
- "Back" - Go back to previous view

📁 **Repository Browser**
- Browse all your GitHub repositories
- Navigate through directories and files
- View file contents with syntax highlighting
- Download files directly

🔍 **Search & Filter**
- Search repositories by name or keyword
- Quick filtering of results
- Voice-enabled search

⬇️ **File Management**
- Preview file contents
- Download individual files
- Breadcrumb navigation for easy directory traversal

## Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn
- GitHub Personal Access Token

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/AIAgentJenie/AI-Agent-Surveyor.git
cd AI-Agent-Surveyor
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
cp .env.example .env
```

4. **Configure your GitHub token**
Edit `.env` and add your GitHub Personal Access Token:
```
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_USERNAME=your_github_username
PORT=5000
NODE_ENV=development
```

**To generate a GitHub token:**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token"
3. Select scopes: `repo`, `user`, `read:user`
4. Copy the token to your `.env` file

5. **Start the server**
```bash
npm start
```

6. **Open in browser**
Navigate to `http://localhost:5000`

## Usage

### Voice Commands

**Hold SPACE or click the microphone button** to speak commands:

```
"Show repositories"        → Display all your repositories
"Open my-project"          → Open a specific repository
"Download"                 → Download the current file
"Search authentication"    → Search for repositories
"Back"                     → Return to previous view
```

### Mouse Navigation

1. **Browse Repositories**
   - Click on a repository to open it
   - View files and folders in the file browser

2. **Navigate Directories**
   - Click folders to enter them
   - Use breadcrumb navigation to go back

3. **View & Download Files**
   - Click on a file to view its contents
   - Click "Download" button to save the file

### Keyboard Shortcuts

- **SPACE**: Hold to speak voice command
- **CTRL + ?**: Show keyboard shortcuts help
- **ENTER**: Submit search query

## Project Structure

```
AI-Agent-Surveyor/
├── server.js                 # Express backend with GitHub API
├── public/
│   ├── index.html           # Main HTML interface
│   ├── styles.css           # UI styling
│   ├── app.js               # Main app initialization
│   ├── voice-handler.js     # Voice recognition & TTS
│   ├── github-api.js        # GitHub API client
│   └── ui-handler.js        # UI event management
├── package.json             # Dependencies
├── .env.example             # Environment variables template
└── README.md                # This file
```

## API Endpoints

### Backend API (runs on localhost:5000)

- `GET /api/repos` - List all user repositories
- `GET /api/repos/:owner/:repo/contents/:path` - Get repository contents
- `GET /api/repos/:owner/:repo/tree` - Get repository tree structure
- `GET /api/download/:owner/:repo/:path` - Download a file
- `GET /api/user` - Get authenticated user profile
- `GET /api/search/repos?q=keyword` - Search repositories
- `GET /api/health` - Health check

## Technology Stack

**Frontend:**
- HTML5 / CSS3
- Vanilla JavaScript
- Web Speech API (Speech Recognition & Synthesis)
- Fetch API

**Backend:**
- Node.js
- Express.js
- Octokit (GitHub API)
- CORS middleware

**APIs:**
- GitHub REST API v3
- Web Speech API
- Browser Download API

## Browser Support

| Browser | Voice Recognition | Text-to-Speech |
|---------|------------------|------------------|
| Chrome  | ✅ Full support  | ✅ Full support |
| Firefox | ✅ Full support  | ✅ Full support |
| Safari  | ✅ Full support  | ✅ Full support |
| Edge    | ✅ Full support  | ✅ Full support |

## Troubleshooting

### Voice Commands Not Working
- Ensure your browser supports Web Speech API
- Check microphone permissions in browser settings
- Try refreshing the page

### Can't Connect to GitHub
- Verify your GitHub token is valid
- Check that token has required scopes (repo, user)
- Ensure `GITHUB_TOKEN` is set in `.env`

### Files Not Downloading
- Check browser's download settings
- Ensure file size is reasonable
- Try a different file format

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop other applications using port 5000

## Security Notes

- GitHub tokens are stored locally in `.env` and NOT sent to the frontend
- All file operations are secure and use GitHub's API
- Voice data is processed locally in your browser
- No data is stored on external servers

## Future Enhancements

- [ ] Support for multiple GitHub accounts
- [ ] Advanced voice command training
- [ ] Code snippet syntax highlighting
- [ ] Real-time collaboration features
- [ ] Git operations via voice (commit, push, pull)
- [ ] Issue and Pull Request management
- [ ] Repository statistics and analytics

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error messages and browser console logs

## Acknowledgments

- Built with ❤️ by AI Agent Jenie
- Powered by GitHub API
- Voice capabilities by Web Speech API
- Dark theme inspired by GitHub's modern design

---

**Ready to explore GitHub with your voice? Let's get started! 🚀**

Hold SPACE and say: *"Show repositories"*
