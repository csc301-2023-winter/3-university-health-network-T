const express = require('express');
const router = express.Router();

const blogPosts = [
    {
      id: 1,
      title: 'Blog post 1',
      createdAt: new Date(),
      content: 'This is the first blog post.',
      tags: ['tag1', 'tag2']
    },
    {
      id: 2,
      title: 'Blog post 2',
      createdAt: new Date(),
      content: 'This is the second blog post.',
      tags: ['tag2', 'tag3']
    },
    {
      id: 3,
      title: 'Blog post 3',
      createdAt: new Date(),
      content: 'This is the third blog post.',
      tags: ['tag1', 'tag3']
    }
];

router.get('/', (req, res) => {
    // TODO: after connection, need to replace this with real db
    const tag = req.query.tag;
    let filteredBlogPosts = blogPosts;
    if (tag) {
      filteredBlogPosts = blogPosts.filter(post => post.tags.includes(tag));
    }
    res.render('blog', { blogPosts: filteredBlogPosts });
  });

module.exports = router;