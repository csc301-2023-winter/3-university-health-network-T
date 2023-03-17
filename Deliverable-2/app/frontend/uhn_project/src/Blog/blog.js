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

  const formatDate = (dateString, includeTime = false) => {
    const date = new Date(dateString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
    if (includeTime) {
      return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    } else {
      return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    }
  };
  

  return (
    <div className="blog-container">
      <h1>Blog</h1>
      {selectedBlog ? (
        <div className="blog-details">
          <h2>{selectedBlog.title}</h2>
          <div className="tag-container">
            <div> {selectedBlog.tags}</div>
            <div className="date">{formatDate(selectedBlog.date)}</div>

          </div>
          <p>{selectedBlog.context}</p>
          <button onClick={handleCloseClick}>Close</button>
        </div>
      ) : (
        <div className="blog-overview">
          {blogs.map((blog) => (
            <div key={blog.bid} className="blog-preview" onClick={() => handleBlogClick(blog)}>
              <img src={`https://source.unsplash.com/random/800x600?sig=${Math.floor(Math.random() * 1000)}`} alt="Random Unsplash Image" />
              <div className="tag-container">
                <div className="date">{formatDate(blog.date)}</div>
                <div> {blog.tags}</div>
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


