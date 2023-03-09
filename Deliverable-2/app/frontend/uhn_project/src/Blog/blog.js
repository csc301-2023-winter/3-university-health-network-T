import React, { useState, useEffect } from 'react';
import './blog.css';

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const fetchBlogs = async (page) => {
    const response = await fetch(`http://localhost:5000/blog/blogs/${page}`, {
      method: 'GET',
    });

    if (response.ok) {
      const result = await response.json();
      setBlogs(result.data);
    }
  };

  const fetchBlogDetails = async (bid) => {
    const response = await fetch(`http://localhost:5000/blog/detail/${bid}`, {
      method: 'GET',
    });

    if (response.ok) {
      const result = await response.json();
      setSelectedBlog(result.data);
    }
  };

  useEffect(() => {
    fetchBlogs(1); // load the first page of blogs by default
  }, []);

  const handleBlogClick = (blog) => {
    fetchBlogDetails(blog.bid);
  };

  const handleCloseClick = () => {
    setSelectedBlog(null);
  };

  return (
    <div className="blog-container">
      <h1>Blog</h1>
      {selectedBlog ? (
        <div className="blog-details">
          <h2>{selectedBlog.title}</h2>
          <div className="tag-container">
            {/* {selectedBlog.tags.map((tag) => (
              <div key={tag} className="tag">{tag}</div>
            ))} */}
            <div className="date">{selectedBlog.date}</div>
          </div>
          <p>{selectedBlog.context}</p>
          <button onClick={handleCloseClick}>Close</button>
        </div>
      ) : (
        <div className="blog-overview">
          <h2>Overview</h2>
          {blogs.map((blog) => (
            <div key={blog.bid} className="blog-preview" onClick={() => handleBlogClick(blog)}>
              <div className="tag-container">
                {/* {blog.tags.map((tag) => (
                  <div key={tag} className="tag">{tag}</div>
                ))} */}
                <div className="date">{blog.date}</div>
              </div>
              <h3>{blog.title}</h3>
              <p>{blog.context.substring(0, 50)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Blog;

