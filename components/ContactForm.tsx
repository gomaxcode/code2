import React, { useState } from 'react';
import { addMessage } from '../services/firestoreService';
import type { MessageData } from '../types';

// Helper component for form inputs, defined outside the main component
const FormInput: React.FC<{
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  name: string;
}> = ({ id, label, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
      {label}
    </label>
    <input
      id={id}
      className="block w-full rounded-md border-0 bg-white/5 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all duration-200"
      {...props}
    />
  </div>
);

// Helper component for textarea, defined outside the main component
const FormTextarea: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  required?: boolean;
  name: string;
}> = ({ id, label, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
      {label}
    </label>
    <textarea
      id={id}
      rows={4}
      className="block w-full rounded-md border-0 bg-white/5 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all duration-200"
      {...props}
    />
  </div>
);

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<Omit<MessageData, 'createdAt'>>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFillDummyData = () => {
    const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona', 'George', 'Hannah'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    const subjects = ['your product', 'a recent order', 'a partnership opportunity', 'your services', 'a technical issue'];
    const inquiries = ['I would like to know more about', 'Could you please provide details on', 'I have a question regarding', 'I am interested in learning about'];
    
    const randomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const fullName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 900) + 100}@example.com`;
    const message = `${randomItem(inquiries)} ${randomItem(subjects)}. Thank you!`;

    setFormData({
      name: fullName,
      email: email,
      message: message
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await addMessage(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl shadow-indigo-500/10 ring-1 ring-white/10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          id="name"
          label="Full Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
        />
        <FormInput
          id="email"
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />
        <FormTextarea
          id="message"
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your message..."
          required
        />
        <div className="pt-2 flex flex-col sm:flex-row gap-4">
           <button
            type="button"
            onClick={handleFillDummyData}
            disabled={isSubmitting}
            className="flex w-full justify-center items-center rounded-md bg-slate-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 sm:w-auto"
          >
            Auto-fill Dummy Data
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full justify-center items-center rounded-md bg-indigo-500 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
      
      {success && (
        <div className="mt-6 p-4 rounded-md bg-green-500/20 text-green-300 border border-green-500/30 text-center">
          <p className="font-medium">Message sent successfully! Thank you.</p>
        </div>
      )}
      
      {error && (
        <div className="mt-6 p-4 rounded-md bg-red-500/20 text-red-300 border border-red-500/30 text-center">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default ContactForm;