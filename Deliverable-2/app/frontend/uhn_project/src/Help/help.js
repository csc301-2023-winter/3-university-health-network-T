import React, { useState, useEffect } from 'react';
import "./help.css"
import Menu from "../Component/Menu"
import { server_url } from '../global';

function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [faqs, setFaqs] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchFaqs() {
      const response = await fetch(`${server_url}/help`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        
      });
      const data = await response.json();
      console.log(data);
      setFaqs(data.help);
    }
    fetchFaqs();
  }, []);

  const filteredFaqs = faqs ? faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div>   
      <Menu/>
          <div >
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
            <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js"></script>

          </div>
      <div className="search-bar">
        <i className="fa fa-search"></i>
        <input
          className="help-search-input"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="faq-section" >
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
  );
}

export default HelpPage;
