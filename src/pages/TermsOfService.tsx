
import { motion } from 'framer-motion';
import { Footer } from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Terms of Service
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Welcome to CiteQuotes ("we," "our," or "us"). By accessing or using our website, services, API, 
              and Quote Finder GPT (collectively, the "Services"), you agree to be bound by these Terms of Service.
            </p>
            
            <h2>2. Use of Services</h2>
            <p>
              You may use our Services only as permitted by these Terms and any applicable laws. 
              You may not:
            </p>
            <ul>
              <li>Use our Services in any manner that could disable, overburden, damage, or impair our Services</li>
              <li>Use any robot, spider, or other automatic device to access our Services</li>
              <li>Introduce any viruses, trojan horses, worms, or other harmful material</li>
              <li>Attempt to gain unauthorized access to our Services</li>
            </ul>
            
            <h2>3. API Usage</h2>
            <p>
              Our API is provided for integration with approved applications, including our Quote Finder GPT.
              Use of the API is subject to rate limits and may be monitored for abuse.
            </p>
            
            <h2>4. Intellectual Property</h2>
            <p>
              The content, features, and functionality of our Services are owned by CiteQuotes and
              are protected by copyright, trademark, and other intellectual property laws.
              The quotes database is provided for educational and reference purposes.
            </p>
            
            <h2>5. User Contributions</h2>
            <p>
              When you submit quotes or other content to our Services, you grant us a non-exclusive, 
              worldwide, royalty-free license to use, reproduce, modify, and display such content in
              connection with the Services.
            </p>
            
            <h2>6. Third-Party Links</h2>
            <p>
              Our Services may contain links to third-party websites or services that are not owned
              or controlled by CiteQuotes. We have no control over and assume no responsibility for
              the content, privacy policies, or practices of any third-party websites or services.
            </p>
            
            <h2>7. Disclaimer of Warranties</h2>
            <p>
              YOUR USE OF OUR SERVICES IS AT YOUR SOLE RISK. THE SERVICES ARE PROVIDED ON AN "AS IS" 
              AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
            </p>
            
            <h2>8. Limitation of Liability</h2>
            <p>
              IN NO EVENT SHALL CITEQUOTES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, 
              OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR IN CONNECTION 
              WITH THE SERVICES.
            </p>
            
            <h2>9. Changes to Terms</h2>
            <p>
              We may revise these Terms from time to time. The most current version will always be 
              posted on this page. By continuing to access or use our Services after revisions become 
              effective, you agree to be bound by the revised Terms.
            </p>
            
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at support@citequotes.com.
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
