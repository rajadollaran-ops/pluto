// app/contact/page.js
'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-6">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-6 rounded-lg text-gray-300">
          <h2 className="text-xl font-semibold text-white mb-4">Get In Touch</h2>
          <p className="mb-4 text-justify">We&apos;d love to hear from you! Whether you have a question, suggestion, or just want to say hello, feel free to reach out to us.</p>
          
          <div className="space-y-4 text-justify">
            <div>
              <h3 className="font-semibold text-white">General Inquiries</h3>
              <p>info@123movies.com</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white">Support</h3>
              <p>support@123movies.com</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white">Business Partnerships</h3>
              <p>partnerships@123movies.com</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white">Press</h3>
              <p>press@123movies.com</p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-700 text-justify">
            <h3 className="font-semibold text-white mb-2">Office Hours</h3>
            <p>Monday - Friday: 9:00 AM - 6:00 PM (EST)</p>
            <p>Weekends: Closed</p>
          </div>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors font-medium"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-8 bg-slate-800 p-6 rounded-lg text-gray-300">
        <h2 className="text-xl font-semibold text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4 text-justify">
          <div>
            <h3 className="font-semibold text-white">How do I report a technical issue?</h3>
            <p>Please use the contact form above and select &quot;Technical Support&quot; as your subject, or email support@123movies.com directly.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white">How long does it take to get a response?</h3>
            <p>We typically respond to all inquiries within 24-48 hours during business days.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white">Do you have a community forum?</h3>
            <p>Yes! Join our community forum to discuss movies, share recommendations, and connect with other film enthusiasts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
