
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 page-padding">
      <div className="page-max-width prose prose-lg max-w-4xl mx-auto dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p>Last updated: May 2, 2025</p>

        <section className="mb-8">
          <h2>Introduction</h2>
          <p>
            CiteQuotes ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our quote verification and citation service.
          </p>
          <p>
            Please read this Privacy Policy carefully. By accessing or using CiteQuotes, you acknowledge that you have read, understood, and agree to be bound by all the terms outlined in this Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2>Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>We may collect personal information that you voluntarily provide to us when you:</p>
          <ul>
            <li>Create an account</li>
            <li>Save favorite quotes</li>
            <li>Submit quotes for verification</li>
            <li>Contact our customer support</li>
          </ul>
          <p>This information may include:</p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Account credentials</li>
            <li>User preferences and settings</li>
          </ul>

          <h3>Usage Information</h3>
          <p>We may collect information about how you interact with our service, including:</p>
          <ul>
            <li>Search queries</li>
            <li>Quotes viewed or saved</li>
            <li>Features used</li>
            <li>Time spent on pages</li>
          </ul>

          <h3>Device Information</h3>
          <p>We may collect information about the device you use to access our service, including:</p>
          <ul>
            <li>Device type and model</li>
            <li>Operating system</li>
            <li>Browser type</li>
            <li>IP address</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process and complete transactions</li>
            <li>Send you technical notices and updates</li>
            <li>Respond to your comments and questions</li>
            <li>Understand how users interact with our service</li>
            <li>Detect, prevent, and address technical issues</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>Quote Finder GPT Schema</h2>
          <p>
            Our Quote Finder GPT uses a specific schema to structure and organize quote data. 
            This schema ensures consistent formatting and enables accurate search functionality.
          </p>
          
          <h3>Schema Structure</h3>
          <p>Each quote in our database contains the following fields:</p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>id</td>
                  <td>string (uuid format)</td>
                  <td>Unique identifier for the quote</td>
                </tr>
                <tr>
                  <td>text</td>
                  <td>string</td>
                  <td>Verbatim quote in English</td>
                </tr>
                <tr>
                  <td>author</td>
                  <td>string</td>
                  <td>Standardized full name</td>
                </tr>
                <tr>
                  <td>date</td>
                  <td>string</td>
                  <td>Exact or estimated year (e.g., "1845+")</td>
                </tr>
                <tr>
                  <td>topics</td>
                  <td>string</td>
                  <td>2-4 semicolon-separated terms</td>
                </tr>
                <tr>
                  <td>theme</td>
                  <td>string</td>
                  <td>Primary theme of the quote</td>
                </tr>
                <tr>
                  <td>source</td>
                  <td>string</td>
                  <td>Primary English edition</td>
                </tr>
                <tr>
                  <td>source_url</td>
                  <td>string (url)</td>
                  <td>Link to source document</td>
                </tr>
                <tr>
                  <td>original_language</td>
                  <td>string</td>
                  <td>Language code of original quote</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h3>Data Processing</h3>
          <p>
            When you use our Quote Finder, your search queries are processed against this schema to find 
            relevant matches. We may store anonymized search queries to improve our search algorithms 
            and quote database.
          </p>
          
          <h3>Data Retention</h3>
          <p>
            Quote data is retained indefinitely as part of our public database. Your personal search 
            history is associated with your account and can be cleared upon request.
          </p>
        </section>

        <section className="mb-8">
          <h2>Disclosure of Your Information</h2>
          <p>We may share your information in the following situations:</p>
          <ul>
            <li><strong>With Service Providers:</strong> We may share your information with third-party vendors who provide services on our behalf.</li>
            <li><strong>For Business Transfers:</strong> We may share or transfer your information in connection with a merger, financing, acquisition, or dissolution.</li>
            <li><strong>To Comply with Law:</strong> We may disclose your information if required to do so by law or in response to legal requests.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>Your Privacy Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul>
            <li>The right to access personal information we hold about you</li>
            <li>The right to request correction or deletion of your personal information</li>
            <li>The right to restrict or object to our processing of your personal information</li>
            <li>The right to data portability</li>
          </ul>
          <p>To exercise these rights, please contact us using the information provided in the "Contact Us" section.</p>
        </section>

        <section className="mb-8">
          <h2>Security of Your Information</h2>
          <p>
            We implement appropriate technical and organizational measures to protect the security of your personal information. 
            However, no electronic transmission or storage technology is completely secure, and we cannot guarantee the absolute security of your data.
          </p>
        </section>

        <section className="mb-8">
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date. 
            We encourage you to review this Privacy Policy frequently to stay informed about how we are protecting your information.
          </p>
        </section>

        <section className="mb-8">
          <h2>Contact Us</h2>
          <p>If you have questions or concerns about this Privacy Policy, please contact us at:</p>
          <p>Email: privacy@citequotes.example.com</p>
          <p>Address: 123 Quote Street, Citation City, QT 12345</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
