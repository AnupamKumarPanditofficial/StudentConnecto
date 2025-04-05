
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const faqItems = [
    {
      question: "How do I find a tutor?",
      answer: "You can find tutors by navigating to the 'Find Tutors' page and filtering based on subject, availability, and ratings. Once you find a tutor that matches your requirements, you can book a session directly."
    },
    {
      question: "What payment methods do you accept?",
      answer: "StudentConnect accepts all major credit cards, debit cards, and digital payment methods such as PayPal and Google Pay."
    },
    {
      question: "How do I cancel a session?",
      answer: "You can cancel a booked session up to 24 hours before the scheduled time without any charges. Navigate to your bookings in your profile and select the cancel option for the specific session."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes, StudentConnect is available as a mobile app on both iOS and Android platforms. You can download it from the App Store or Google Play Store."
    },
    {
      question: "How are tutors verified?",
      answer: "All tutors undergo a rigorous verification process that includes checking their educational credentials, teaching experience, and a background check to ensure student safety."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "Yes, if you're not satisfied with a tutoring session, you can request a refund within 48 hours of the session. Our support team will review your case and process the refund if applicable."
    },
    {
      question: "Do you offer group sessions?",
      answer: "Yes, we offer group tutoring sessions for certain subjects. Group sessions are more affordable and allow you to learn collaboratively with peers."
    },
    {
      question: "How long are the tutoring sessions?",
      answer: "Standard tutoring sessions are 60 minutes long, but you can also book 30-minute or 90-minute sessions depending on your needs and the tutor's availability."
    },
    {
      question: "What subjects do you cover?",
      answer: "We cover a wide range of subjects across all educational levels including mathematics, sciences, languages, humanities, test preparation, and professional skills."
    },
    {
      question: "How do I become a tutor?",
      answer: "To become a tutor, visit the 'Become a Tutor' section on our website, complete the application form, submit your credentials for verification, and pass our qualification assessment."
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">Frequently Asked Questions</h1>
        <p className="text-gray-600 mb-10 text-center">
          Find answers to common questions about StudentConnect services
        </p>
        
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
              <AccordionTrigger className="text-lg font-medium py-4 text-gray-800 hover:text-education-600 transition-colors">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="py-4 px-1 text-gray-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="mt-12 text-center">
          <p className="text-gray-700 mb-2">Still have questions?</p>
          <a href="/contact" className="text-education-600 font-medium hover:text-education-700 transition-colors">
            Contact our support team
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
