import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        {/* Placeholder for a potential top bar or navigation */}
      </div>

      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-transparent before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-900 after:via-[#0141ff] after:blur-2xl after:content-[''] before:bg-gradient-to-br before:from-transparent before:to-blue-700 before:opacity-10 after:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
         {/* Replace H1 text with AE logo */}
        <Image
           src="/images/logos/AE vector-2.png"
           alt="Robust AE Logo"
           width={200} // Adjust width as needed
           height={100} // Adjust height as needed
           className="mb-8"
          priority
        />
      </div>

      {/* Add link to newsite page */}
      <div className="mb-8">
        <Link href="/newsite" className="text-blue-600 hover:underline dark:text-blue-400">
          Go to New Site Design
        </Link>
      </div>

      <div className="mb-32 grid gap-8 text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-2 lg:text-left">
        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            Services
          </h2>
          <ul className="list-disc list-inside m-0 max-w-[30ch] text-sm opacity-75">
              <li>Embedded Systems Development</li>
              <li>Industrial Automation</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            Contact
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-75">
            George Haworth<br />
            Tel: 07447 544 890<br />
            Email: info@robust-ae.com
          </p>
          <a
            href="/images/logos/George_Haworth_CV_23042025.pdf"
            download
            className="mt-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Download CV
          </a>
        </section>

        <section className="col-span-2 mt-8 border-t pt-8 text-center lg:text-left">
           <h2 className="mb-3 text-2xl font-semibold">Company Information</h2>
           <p className="m-0 max-w-[40ch] text-sm opacity-75 mx-auto lg:mx-0">
             Company number: 11269142
           </p>
           <div className="mt-4 flex justify-center lg:justify-start gap-8 items-center">
              <div>
                 {/* Replace placeholder with NAPIT Logo */}
          <Image
                   src="/images/logos/napit-logo.png"
                   alt="NAPIT Logo"
                   width={96} // Keep original width or adjust
                   height={48} // Keep original height or adjust
                   className="object-contain"
                 />
                 <p className="text-xs opacity-75 mt-1">Membership: 60482</p>
              </div>
              <div>
                 {/* Replace placeholder with IET Logo */}
          <Image
                   src="/images/logos/iet-logo.jpg"
                   alt="IET Logo"
                   width={96} // Keep original width or adjust
                   height={48} // Keep original height or adjust
                   className="object-contain"
                 />
                 <p className="text-xs opacity-75 mt-1">Membership: 1100789092</p>
              </div>
           </div>
        </section>
      </div>

      {/* Placeholder for footer */}
       <footer className="w-full max-w-5xl text-center text-sm text-gray-500 mt-16">
         Copyright © {new Date().getFullYear()} Robust AE
      </footer>
    </main>
  );
}
