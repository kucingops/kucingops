const GITHUB_USERNAME = 'kucingops';
const BLOG_REPO = 'blog-content';
// We try to fetch posts.json first (best practice), but I'll add a fallback or "All Files" mode if requested.
// Given strict instructions to "consume from other repos that contains .md files", 
// we'll stick to the plan's posts.json for stability, but I will ALSO implement 
// a robust error handler that tells the user what happened.

const POSTS_INDEX_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${BLOG_REPO}/main/posts/posts.json`;
// If the user hasn't set up posts.json, this will fail.

async function loadBlogPosts() {
    const blogContainer = document.getElementById('blog-posts');
    
    try {
        const response = await fetch(POSTS_INDEX_URL);
        if (!response.ok) {
            if (response.status === 404) {
                 // Fallback or Error message instructing setup
                 throw new Error('posts.json not found. Please create posts/posts.json in your blog-content repo.');
            }
            throw new Error('Failed to load posts index');
        }
        
        const data = await response.json();
        let posts = data.posts;
        
        // Filter out readme.md if it somehow got into the list (per user request)
        posts = posts.filter(post => post.filename.toLowerCase() !== 'readme.md');

        if (posts.length === 0) {
            blogContainer.innerHTML = '<p class="loading">Directory is empty.</p>';
            return;
        }
        
        // Sort posts by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Render posts
        blogContainer.innerHTML = '';
        posts.forEach(post => {
            const postElement = createPostPreview(post);
            blogContainer.appendChild(postElement);
        });
        
    } catch (error) {
        console.error('Error loading posts:', error);
        blogContainer.innerHTML = `
            <div class="error">
                <p>Error: System cannot read from drive A: (GitHub)</p>
                <p>${error.message}</p>
                <p>Ensure your repo "kucingops/blog-content" has "posts/posts.json".</p>
            </div>`;
    }
}

function createPostPreview(post) {
    const div = document.createElement('div');
    div.className = 'blog-list-item';
    
    // Windows 95 File Icon style
    div.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; background: white; border: 1px solid black; display: flex; justify-content: center; align-items: center; font-size: 20px;">
                📝
            </div>
            <div style="flex-grow: 1;">
                <h3><a href="post.html?id=${post.id}">${post.title}</a></h3>
                <div class="blog-meta">${post.date} | ${post.tags ? post.tags.join(', ') : 'No tags'}</div>
                <div style="font-size: 12px;">${post.description || ''}</div>
            </div>
        </div>
    `;
    
    return div;
}

document.addEventListener('DOMContentLoaded', loadBlogPosts);
