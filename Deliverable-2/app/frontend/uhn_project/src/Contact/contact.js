import React, { useState } from 'react';
import './contact.css';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
      const response = await fetch('/host/contact', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, name, email, message }),
      });

      if (response.ok) {
        alert('Your message has been sent!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        alert('Something went wrong. Please try again later.');
      }
    } catch (err) {
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="contact-container">
        <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
            <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js"></script>
        </head>
      <div className="contact-left">
        <h2>Contact</h2>
        <div className="contact-item">
          <i className="fas fa-map-marker-alt"></i>
          <div className="contact-info">
            <div className="contact-label">My Address</div>
            <div className="contact-value">88 West 21th Street, Suite 721 New York NY 10016</div>
          </div>
        </div>
        <div className="contact-item">
          <i className="fas fa-phone-alt"></i>
          <div className="contact-info">
            <div className="contact-label">Telephone</div>
            <div className="contact-value">+1235 2355 98</div>
          </div>
        </div>
        <div className="contact-item">
          <i className="fas fa-envelope"></i>
          <div className="contact-info">
            <div className="contact-label">Email</div>
            <div className="contact-value">info@yoursite.com</div>
          </div>
        </div>
        <div className="contact-item">
          <i className="fas fa-globe"></i>
          <div className="contact-info">
            <div className="contact-label">Web</div>
            <div className="contact-value">www.yoursite.com</div>
          </div>
        </div>
      </div>
      <div className="contact-right">
        <h3>Suggestion</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <button type="submit">Send Message</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Contact;
