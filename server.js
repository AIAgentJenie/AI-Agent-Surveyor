import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Octokit } from 'octokit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Octokit GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Route: Get all repositories for the user
app.get('/api/repos', async (req, res) => {
  try {
    const response = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: 100,
      sort: 'updated',
      direction: 'desc'
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching repos:', error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

// Route: Get repository contents
app.get('/api/repos/:owner/:repo/contents/:path?', async (req, res) => {
  try {
    const { owner, repo, path: filePath = '' } = req.params;
    
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: filePath
    });

    // If it's a file, return content
    if (response.data.type === 'file') {
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      res.json({
        ...response.data,
        decoded_content: content
      });
    } else {
      // If it's a directory, return list of contents
      res.json(response.data);
    }
  } catch (error) {
    console.error('Error fetching contents:', error);
    res.status(500).json({ error: 'Failed to fetch repository contents' });
  }
});

// Route: Get file as download
app.get('/api/download/:owner/:repo/:path?', async (req, res) => {
  try {
    const { owner, repo, path: filePath = '' } = req.params;

    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: filePath
    });

    if (response.data.type === 'file') {
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${response.data.name}"`);
      res.setHeader('Content-Type', 'text/plain');
      res.send(content);
    } else {
      res.status(400).json({ error: 'Cannot download directories' });
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// Route: Get user profile
app.get('/api/user', async (req, res) => {
  try {
    const response = await octokit.rest.users.getAuthenticated();
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Route: Search repositories
app.get('/api/search/repos', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const response = await octokit.rest.search.repos({
      q: `${q} user:${process.env.GITHUB_USERNAME}`,
      per_page: 20
    });

    res.json(response.data.items);
  } catch (error) {
    console.error('Error searching repos:', error);
    res.status(500).json({ error: 'Failed to search repositories' });
  }
});

// Route: Get repository structure (tree)
app.get('/api/repos/:owner/:repo/tree', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { recursive } = req.query;

    const response = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: 'HEAD',
      recursive: recursive === 'true' ? 1 : 0
    });

    res.json(response.data.tree);
  } catch (error) {
    console.error('Error fetching tree:', error);
    res.status(500).json({ error: 'Failed to fetch repository tree' });
  }
});

// Route: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Agent Jenie is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🤖 AI Agent Jenie running on http://localhost:${PORT}`);
});
