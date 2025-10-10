
import React from 'react';
import ContactForm from './components/ContactForm';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
            Contact Us
          </h1>
          <p className="text-slate-400 text-lg">
            We'd love to hear from you. Drop us a message below.
          </p>
        </header>
        <main>
          <ContactForm />
        </main>
        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>Powered by React & Firebase</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
