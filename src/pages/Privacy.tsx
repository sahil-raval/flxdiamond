export default function Privacy() {
  return (
    <div className="bg-background pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">

        <p className="text-[10px] uppercase tracking-[0.45em] mb-6" style={{ color: "#1CA9C9" }}>
          Legal
        </p>
        <h1 className="font-serif text-4xl md:text-5xl mb-4" style={{ color: "#02274A" }}>
          Privacy Policy
        </h1>
        <p className="text-sm mb-12" style={{ color: "rgba(2,39,74,0.45)" }}>
          Last updated: April 2026
        </p>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: "rgba(2,39,74,0.65)" }}>

          <section>
            <h2 className="font-serif text-xl mb-3" style={{ color: "#02274A" }}>1. Who We Are</h2>
            <p>
              FLX Diamonds Pty Ltd ("FLX Diamonds", "we", "us") is a B2B diamond sourcing and regrinding
              operation based in Geelong, Victoria, Australia. This policy applies to all information
              collected through our website at flxdiamond.com and any direct business correspondence.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3" style={{ color: "#02274A" }}>2. Information We Collect</h2>
            <p className="mb-3">
              We collect information only when you choose to provide it — typically through our enquiry
              form or direct email contact. This may include:
            </p>
            <ul className="space-y-1 pl-4">
              {[
                "Name and company name",
                "Email address and phone number",
                "Nature of your enquiry (sourcing, conversion, investment, partnership)",
                "Any additional information you include in your message",
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span style={{ color: "#1CA9C9" }}>—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              We do not use tracking pixels, behavioural analytics, or advertising cookies. We do not
              sell or broker any personal data.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3" style={{ color: "#02274A" }}>3. How We Use Your Information</h2>
            <p>
              Information you submit is used solely to respond to your enquiry and, if you proceed as
              a trade partner, to fulfil our contractual obligations. We do not add you to marketing
              lists without your explicit consent, and we do not contact you for purposes outside
              the scope of your initial enquiry.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3" style={{ color: "#02274A" }}>4. Commercial Confidentiality</h2>
            <p>
              All business enquiries are treated with strict commercial confidence. Details of your
              stone requirements, pricing discussions, and transaction terms are never shared with
              third parties outside of the direct fulfilment chain (e.g. GIA certification labs,
              logistics partners) without your express consent.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3" style={{ color: "#02274A" }}>5. Data Retention</h2>
            <p>
              We retain enquiry information for as long as necessary to respond and, where a
              business relationship is established, for the duration of that relationship plus any
              period required by Australian financial or commercial law. You may request deletion of
              your data at any time by contacting us directly.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3" style={{ color: "#02274A" }}>6. Your Rights</h2>
            <p>
              Under the Australian Privacy Act 1988, you have the right to access, correct, or
              request deletion of personal information we hold about you. To exercise any of these
              rights, contact us at{" "}
              <a href="mailto:help@flxdiamond.com" style={{ color: "#1CA9C9" }}>
                help@flxdiamond.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl mb-3" style={{ color: "#02274A" }}>7. Contact</h2>
            <p>
              FLX Diamonds Pty Ltd<br />
              Geelong, Victoria, Australia<br />
              <a href="mailto:help@flxdiamond.com" style={{ color: "#1CA9C9" }}>
                help@flxdiamond.com
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
