import React, { useState, useEffect } from 'react';
import "./help.css"
function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    async function fetchFaqs() {
      const response = await fetch('host/help');
      const data = await response.json();
      setFaqs(data.data.content);
    }
    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
        <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
            <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js"></script>
        </head>
      <div className="search-bar">
        <i className="fa fa-search"></i>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="faq-section">
        {filteredFaqs.map((faq) => (
          <div key={faq.id}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HelpPage;
