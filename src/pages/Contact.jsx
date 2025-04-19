import React from 'react';
import '../styles/Contact.css';
import PageWrapper from './PageWrapper';

const Contact = () => {
  return (
    <PageWrapper>
    <section className="ContactSection min-h-screen py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4 contactTitle">Let’s Talk</h1>
      <p className="contactText text-lg mb-12">
        Send all inquiries and questions through here.
      </p>
    </div>
    </section>
    </PageWrapper>
  )
}

export default Contact