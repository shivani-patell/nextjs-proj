import type { Metadata } from "next";
import Link from "next/link";
import SurveyHeader from "@/components/SurveyHeader";

export const metadata: Metadata = {
  title: "Privacy Policy – J Healthcare Initiative",
  description:
    "How the J Healthcare Initiative Frontline Feedback form collects, uses, and protects your information.",
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

          <div className="mt-8 space-y-6 text-base leading-relaxed text-neutral-900">
            <p>
              J Healthcare Initiative is committed to protecting your privacy.
              This form is designed to support harm reduction work and improve
              services for people who use drugs. We only collect information
              that is needed to better understand experiences, needs, and
              opportunities for collaboration.
            </p>
            <p>
              This survey is voluntary. You do not have to answer any question
              you do not want to answer. You may stop at any time.
            </p>
            <p>
              We do not ask for your name unless you choose to share it in a
              text box or contact field. Information collected through this form
              may be used for project improvement, service planning, and
              research-related analysis. We will not sell your information.
            </p>
            <p>
              Your responses may be reviewed by authorized members of the J
              Healthcare Initiative team for project purposes. We will take
              reasonable steps to protect your information.
            </p>
            <p>
              If you have questions about this privacy policy or how your
              information is used, please contact us at:
            </p>
            <p className="space-y-1">
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
                Address: 312 Main St, Vancouver, BC V6A 2T2
              </span>
            </p>
            <p>
              By using this form, you consent to the collection and use of your
              responses as described here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
