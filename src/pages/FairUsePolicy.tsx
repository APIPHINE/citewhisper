
import BlogPost from '../components/BlogPost';

const FairUsePolicy = () => {
  return (
    <BlogPost
      title="Fair Use & Rights Holder Communication Policy"
      date="May 16, 2025"
      content={
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold">1. Declaration of Intent</h2>
            <p>
              CiteQuotes is a platform dedicated to the responsible use and contextual presentation of quotations from historical, 
              literary, philosophical, and public-interest sources. We operate under the Fair Use doctrine (17 U.S.C. § 107) and 
              take a proactive stance in supporting creators, translators, and publishers through attribution, linking, and communication.
            </p>
            <p className="mt-2">
              Our platform is educational and transformative, offering deeper historical, social, and philosophical context for each quote. 
              We do not host full texts or compete with original works; instead, we aim to promote them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">2. Fair Use Justification Framework</h2>
            <p>Each quote is curated with care and assessed under the four key factors of U.S. fair use law:</p>
            
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border border-border">
                <thead>
                  <tr className="bg-secondary/30">
                    <th className="p-3 text-left font-medium border-b border-border">Legal Factor</th>
                    <th className="p-3 text-left font-medium border-b border-border">CiteQuotes Implementation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border-b border-border">Purpose & Character</td>
                    <td className="p-3 border-b border-border">Use is transformative: we add commentary, visual context, and metadata; educational focus</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-border">Nature of the Work</td>
                    <td className="p-3 border-b border-border">Most sources are factual, public domain, or culturally significant</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-border">Amount Used</td>
                    <td className="p-3 border-b border-border">Typically &lt; 250 words; always a partial excerpt</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-border">Effect on Market</td>
                    <td className="p-3 border-b border-border">Links provided to original source; no substitution or market harm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">3. ExpandedQuote Cards: Transformative Use</h2>
            <p>
              CiteQuotes goes beyond quotation by embedding each quote in a visual and narrative experience. 
              Key transformative elements include:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Social, philosophical, or political context</li>
              <li>Source language comparisons or historical translations</li>
              <li>Cultural timelines or interpretive commentary</li>
              <li>IIIF-based evidence image links and primary document citation</li>
            </ul>
            <p className="mt-2">
              This use is supported by precedent (e.g., Campbell v. Acuff-Rose Music, 1994) and qualifies as 
              non-substitutive, commentary-based fair use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">4. Attribution & Communication with Authors</h2>
            <p>Every quote on CiteQuotes includes the following:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Author's full name (localized where applicable)</li>
              <li>Title of source work</li>
              <li>Original publication date (if available)</li>
              <li>Source or publisher URL</li>
              <li>Citation in multiple formats (APA, MLA, Chicago)</li>
            </ul>
            
            <p className="mt-3">We also:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Proactively notify authors, translators, or estates when contactable</li>
              <li>Encourage corrections and attribution suggestions</li>
              <li>Welcome collaboration or direct licensing requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold">5. Corrections, Licensing & Takedown Protocol</h2>
            <p>
              Rights holders may contact us at <a href="mailto:admin@citequotes.com" className="text-accent hover:underline">admin@citequotes.com</a>.
            </p>
            
            <p className="mt-3 font-medium">Response Timeline:</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Acknowledgment within 2 business days</li>
              <li>Full response or action within 5 business days</li>
            </ul>
            
            <p className="mt-3 font-medium">Request Types Supported:</p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Misattribution correction</li>
              <li>Citation improvement</li>
              <li>Source linking or metadata update</li>
              <li>Translation dispute</li>
              <li>Removal request (outside Fair Use)</li>
              <li>Licensing, partnership, or promotional collaboration</li>
            </ul>
            
            <p className="mt-3">
              All valid requests will be honored promptly and respectfully.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">6. Legal Notice on Every Quote Card</h2>
            <p>
              Each ExpandedQuote card includes the following notice:
            </p>
            <blockquote className="border-l-4 border-accent pl-4 py-2 my-4 bg-secondary/20 italic">
              "This excerpt is used under Fair Use (17 U.S.C. § 107) for educational and transformative commentary purposes. 
              Source linked and attributed. Contact us to request revision, licensing, or removal."
            </blockquote>
          </section>

          <section>
            <h2 className="text-2xl font-bold">7. Responsible Quoting Best Practices</h2>
            <p>We follow these internal guidelines to ensure ongoing compliance:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Context is required — quotes must be meaningful within narrative or scholarly setting</li>
              <li>No standalone databases — all quotes are embedded in curated discussions</li>
              <li>Images are citation-anchored — IIIF-compliant images include XMP metadata and attribution</li>
              <li>Older or public domain texts are preferred when suitable</li>
              <li>Automated or bulk quote scraping is not permitted</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold">8. Collaboration Invitation</h2>
            <p>
              We invite authors, translators, editors, and rights holders to partner with us. CiteQuotes is not a quote farm 
              — it is a scholarly and archival platform promoting ethical quotation culture.
            </p>
            <p className="mt-2">
              To join our outreach network or propose a licensing initiative, email <a href="mailto:admin@citequotes.com" className="text-accent hover:underline">admin@citequotes.com</a>.
            </p>
          </section>

          <div className="mt-8 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              © 2025 CiteQuotes. All rights reserved. Fair Use-driven. Attribution-focused. Education-centered.
            </p>
          </div>
        </div>
      }
    />
  );
};

export default FairUsePolicy;
