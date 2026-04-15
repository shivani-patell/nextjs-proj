import type { Metadata } from "next";
import Link from "next/link";
import SurveyHeader from "@/components/SurveyHeader";

export const metadata: Metadata = {
  title: "Privacy Policy – J Healthcare Initiative",
  description:
    "How J Healthcare Initiative collects, uses, stores, and protects information in the Frontline Feedback project.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-[100dvh] min-h-screen flex-col bg-blue-950">
      <SurveyHeader />
      <main className="flex flex-1 flex-col bg-white text-black">
        <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 rounded-lg text-base font-semibold text-blue-900 underline decoration-2 underline-offset-2 hover:text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2"
          >
            ← Back to form
          </Link>

          <h1 className="text-3xl font-bold text-black">Privacy Policy</h1>
          <p className="mt-2 text-sm text-neutral-700">J Healthcare Initiative</p>
          <p className="text-sm text-neutral-700">Last Updated: April 2026</p>

          <div className="mt-8 space-y-8 text-base leading-relaxed text-neutral-900">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-black">Introduction</h2>
              <p>
                The J Healthcare Initiative ("JHI" or "we") is a harm reduction
                platform. We are committed to protecting the privacy and dignity
                of everyone who uses our services, including people who use
                drugs, community partners, Indigenous communities, and partner
                organizations in Canada and the United States.
              </p>
              <p>
                This Privacy Policy explains how we collect, use, store, and
                protect your information when you use our virtual Overdose
                Prevention Circle intake form, take part in our surveys, or
                interact with JHI in other ways.
              </p>
              <p>
                This policy applies to all JHI services, including online forms,
                the Frontline Feedback reporting tool, and collaborative
                programs with partner organizations.
              </p>
              <p>
                We know sharing information can feel risky, especially for
                people and communities who have experienced surveillance and
                harm from institutions. Our goal is public health and harm
                reduction, not enforcement or surveillance.
              </p>
              <p>
                This policy is written to be clear and accessible. If you have
                questions, please contact us using the details at the end.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-black">
                Information We Collect
              </h2>
              <h3 className="text-lg font-semibold text-black">
                Information You Choose to Provide
              </h3>
              <p>When you submit a report or complete a survey, you may provide:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Incident details: date, general location (city or region
                  only), and circumstances
                </li>
                <li>
                  Experience description: effects observed, substances involved,
                  and where obtained
                </li>
                <li>
                  Substance information: appearance, packaging, or other
                  descriptive details
                </li>
                <li>
                  Photos: optional images of substances or packaging (see
                  important note below)
                </li>
                <li>
                  Contact information: optional email address, only if you want
                  follow-up (see important note below)
                </li>
                <li>
                  Survey responses: information about service use, needs, or
                  experiences for program improvement
                </li>
              </ul>
              <p>
                You are never required to provide your name. If you share a name
                in a text field, we treat it as personal information.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-black">
                Photos Are Personal Information
              </h2>
              <p>
                Under PIPEDA and consistent with international health privacy
                standards (including HIPAA, which governs our US partners),
                photographs are personal information.
              </p>
              <p>If you choose to submit a photo:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Photos are reviewed by authorized JHI staff upon receipt</li>
                <li>
                  Any image containing identifiable features (for example,
                  faces, tattoos, distinguishing marks, backgrounds, or location
                  details) will have those features removed or obscured before
                  storage or use
                </li>
                <li>
                  Only the substance or packaging itself is kept for harm
                  reduction purposes
                </li>
                <li>Photos are never shared externally in identifiable form</li>
              </ul>
              <p>
                Please do not submit photos that include your face, hands, or
                personal or location details. Crop or blur these before
                submitting if possible.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-black">
                Email Addresses Are Personal Information
              </h2>
              <p>If you provide an email address for follow-up:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Your email is personal information under PIPEDA and is treated
                  as such
                </li>
                <li>
                  It is stored separately from report content so they cannot be
                  easily linked
                </li>
                <li>
                  It is used only to respond to your request and is deleted when
                  follow-up is complete (or sooner if you request)
                </li>
                <li>
                  It is never shared with third parties, including public health
                  authorities, partner organizations, or US partners
                </li>
                <li>
                  Providing an email address is optional and does not affect how
                  your report is processed
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-black">
                Information We Do Not Collect
              </h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>IP addresses or device identifiers used to identify you</li>
                <li>Precise GPS or geolocation data</li>
                <li>
                  Government-issued ID numbers, health card numbers, or similar
                  identifiers
                </li>
                <li>Information from third parties about you without your knowledge</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-black">
                Automatically Collected Technical Data
              </h2>
              <p>
                Like most websites, we record the date and time of submissions
                for administration and security. We do not use this data to
                identify individual users.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-black">
                How We Use Your Information
              </h2>
              <p>The information you share may be used to:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Identify dangerous substances or adulterants in Canada and,
                  where relevant, across the US border
                </li>
                <li>
                  Issue public health alerts and harm reduction notices to
                  protect communities
                </li>
                <li>Identify trends and patterns for public health response</li>
                <li>
                  Improve services and program design, including with Indigenous
                  community partners
                </li>
                <li>Conduct research to advance drug safety and harm reduction</li>
                <li>
                  Follow up with you directly only if you requested this and
                  gave contact information
                </li>
              </ul>
              <p>
                We do not use your information for enforcement, immigration
                screening, or investigatory purposes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-black">
                Data Sharing and Disclosure
              </h2>
              <h3 className="text-lg font-semibold text-black">
                Public Health and Harm Reduction Partners
              </h3>
              <p>
                We may share anonymized, aggregated data with public health
                authorities, researchers, harm reduction organizations, and US
                partner organizations for shared public health goals. Individual
                reports are never shared in a way that identifies you.
              </p>
              <p>
                Data-sharing agreements with US partners require equivalent
                privacy protections.
              </p>

              <h3 className="text-lg font-semibold text-black">
                Indigenous Community Partners
              </h3>
              <p>
                JHI works with Indigenous-led organizations and communities.
                Data involving or about Indigenous communities is shared only
                with explicit consent. We support Indigenous data sovereignty,
                including OCAP principles (Ownership, Control, Access, and
                Possession).
              </p>
              <p>
                If a report relates to a specific Indigenous community, we seek
                guidance from that community&apos;s health authority or designated
                representative before using data beyond direct harm reduction.
              </p>

              <h3 className="text-lg font-semibold text-black">Law Enforcement</h3>
              <p>
                We do not share your information with police or law enforcement.
                We will only disclose information if legally required by a valid
                Canadian court order, and we will notify you in advance where
                legally allowed.
              </p>
              <p>
                We do not voluntarily cooperate with US law enforcement or
                border agencies and will challenge cross-border requests through
                legal channels.
              </p>

              <h3 className="text-lg font-semibold text-black">
                Third-Party Service Providers
              </h3>
              <p>
                We may use trusted third-party providers for hosting or data
                analytics. These providers must protect your information and use
                it only for approved purposes.
              </p>
              <p>
                Data related to Canadian users must be stored and processed in
                Canada under applicable provincial and federal law.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-black">Data Security</h2>
              <p>
                We use industry-standard safeguards to protect your information,
                including:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Encrypted transmission (HTTPS/SSL)</li>
                <li>Secure database storage with strict access controls</li>
                <li>Regular security audits and vulnerability reviews</li>
                <li>Access limited to authorized personnel with a valid need</li>
                <li>Anonymization before external data sharing</li>
              </ul>
              <p>
                Staff and contractors with access to data are bound by
                confidentiality rules and trained in responsible data handling.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-black">Data Retention</h2>
              <p>
                We keep report and survey data for up to seven (7) years to
                support long-term trend analysis and public health research.
                After that, data is securely deleted or irreversibly anonymized.
              </p>
              <p>
                Email addresses for follow-up are deleted once follow-up is
                complete and are not kept longer than needed for that purpose.
                You can request deletion at any time.
              </p>
              <p>
                We fulfill deletion requests unless legal or research rules
                require retention of certain records. If so, we explain why.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-black">Your Rights</h2>
              <p>
                Under PIPEDA and applicable provincial law, you have the right
                to:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Access: request a copy of your personal information</li>
                <li>
                  Correction: request correction of inaccurate or incomplete
                  information
                </li>
                <li>
                  Deletion: request data deletion, subject to legal and research
                  obligations
                </li>
                <li>Withdrawal: withdraw consent for contact at any time</li>
                <li>
                  Complaint: file a complaint with the Office of the Privacy
                  Commissioner of Canada or your provincial privacy commissioner
                </li>
              </ul>
              <p>
                To exercise your rights, email us at{" "}
                <a
                  href="mailto:research@j-initiative.org"
                  className="font-semibold text-blue-900 underline focus:outline-none focus:ring-2 focus:ring-blue-800"
                >
                  research@j-initiative.org
                </a>
                . We respond within 30 days.
              </p>
              <p>
                We are also committed to supporting collective Indigenous data
                rights, including the right to withdraw community-level consent
                for research use.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-black">
                Cross-Border Operations and US Partnerships
              </h2>
              <p>
                JHI works with US partner organizations on shared harm reduction
                and drug safety initiatives. Where data is shared with US
                partners:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Shared data is anonymized and aggregated; no identifying
                  personal information is transferred
                </li>
                <li>
                  US partners must sign agreements that meet or exceed Canadian
                  privacy standards
                </li>
                <li>
                  We do not transfer personal data to the US without explicit
                  consent and a documented legitimate purpose
                </li>
                <li>
                  We monitor US policy changes that may affect user safety and
                  adjust practices as needed
                </li>
              </ul>
              <p>
                If you have concerns about cross-border data sharing, contact us
                before submitting a report.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-black">
                Changes to This Policy
              </h2>
              <p>
                We may update this policy if our practices, partnerships, or
                legal requirements change. We will update the "Last Updated"
                date above. If a change is material, we will provide additional
                notice on our website or through direct communication.
              </p>
              <p>We encourage you to review this policy from time to time.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-black">Contact Us</h2>
              <p>
                If you have questions, concerns, or requests about privacy,
                contact:
              </p>
              <p className="space-y-1">
                <span className="block font-semibold">
                  J Healthcare Initiative — Privacy Office
                </span>
                <span className="block">
                  Email:{" "}
                  <a
                    href="mailto:research@j-initiative.org"
                    className="font-semibold text-blue-900 underline focus:outline-none focus:ring-2 focus:ring-blue-800"
                  >
                    research@j-initiative.org
                  </a>
                </span>
                <span className="block">
                  Mailing Address: 312 Main St, Vancouver, BC V6A 2T2
                </span>
              </p>
              <p>
                By using our services, you acknowledge that you have read this
                Privacy Policy and consent to the collection and use of your
                information as described.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
