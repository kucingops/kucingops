const GITHUB_USERNAME = 'kucingops';
const BLOG_REPO = 'blog-content';
const POSTS_INDEX_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${BLOG_REPO}/main/posts/posts.json`;
const POSTS_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${BLOG_REPO}/main/posts/`;

async function loadPost() {
    const postContainer = document.getElementById('post-content');
    const windowTitle = document.getElementById('window-title');
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        postContainer.innerHTML = '<p class="error">File not found (No ID provided).</p>';
        return;
    }

    try {
        // Fetch posts index to get post filename
        const indexResponse = await fetch(POSTS_INDEX_URL);
        if (!indexResponse.ok) throw new Error('Failed to load posts index');

        const data = await indexResponse.json();
        const post = data.posts.find(p => p.id === postId);

        if (!post) {
            postContainer.innerHTML = '<p class="error">File not found in registry.</p>';
            return;
        }

        // Fetch the markdown content
        const postUrl = POSTS_BASE_URL + post.filename;
        const postResponse = await fetch(postUrl);
        if (!postResponse.ok) throw new Error('Failed to load post content');

        const markdown = await postResponse.text();

        // Remove frontmatter (between --- and ---)
        const contentWithoutFrontmatter = markdown.replace(/^---[\s\S]*?---\n/, '');

        // Convert markdown to HTML
        const html = marked.parse(contentWithoutFrontmatter);

        // Update page title
        document.title = `${post.title} - KucingOps`;
        windowTitle.textContent = `${post.filename} - WordPad`;

        // Render post
        postContainer.innerHTML = `
            <div class="post-header">
                <h1 style="border-bottom: 2px solid #808080; padding-bottom: 10px;">${post.title}</h1>
                <div class="meta" style="color: #666; font-style: italic; margin-bottom: 20px;">
                    Date: ${post.date} | Tags: ${post.tags ? post.tags.join(', ') : 'None'}
                </div>
            </div>
            <div class="post-body">
                ${html}
            </div>
        `;

    } catch (error) {
        console.error('Error loading post:', error);
        postContainer.innerHTML = `
            <div class="error">
                <p>An error has occurred in your application.</p>
                <p>Details: ${error.message}</p>
            </div>`;
    }
}

document.addEventListener('DOMContentLoaded', loadPost);
