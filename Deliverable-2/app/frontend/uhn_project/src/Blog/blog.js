import React, { useState, useEffect } from 'react';
import "./blog.css"


function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBlogs = async (page) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const response = await fetch(`/host/blog?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      const result = await response.json();
      setBlogs(result.data);
      setTotalPages(result.totalPages);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <h1>Blog</h1>
      {blogs.map((blog) => (
        <div key={blog.id}>
          <h2>{blog.title}</h2>
          <p>{blog.date}</p>
          <p>{blog.content}</p>
        </div>
      ))}
      <div>
        <button disabled={currentPage === 1} onClick={handlePrevClick}>
          Previous
        </button>
        <button disabled={currentPage === totalPages} onClick={handleNextClick}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Blog;
