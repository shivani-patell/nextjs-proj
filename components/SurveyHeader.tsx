import Image from "next/image";

export default function SurveyHeader() {
  return (
    <header className="shrink-0 border-b border-blue-800 bg-blue-950 px-4 py-5 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
        <Image
          src="/j-healthcare-logo.png"
          alt="The J Initiative — logo with J, plus sign, and heart on dark blue"
          width={492}
          height={314}
          className="h-12 w-auto max-w-[min(100%,220px)] shrink-0 sm:h-14"
          priority
        />
        <div className="min-w-0 text-white">
          <p className="text-xs font-medium uppercase tracking-wide text-blue-200">
            The J Healthcare Initiative
          </p>
          <h1 className="text-balance text-xl font-bold leading-tight sm:text-2xl">
            Frontline Feedback
          </h1>
          <p className="mt-1 text-balance text-sm text-blue-100 sm:text-base">
            Report Unusual Drug Effects – Help Canadians Stay Informed
          </p>
        </div>
      </div>
    </header>
  );
}
