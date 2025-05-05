import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black text-white">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        {/* Placeholder for a potential top bar or navigation */}
      </div>

      <div className="relative flex place-items-center">
        <Image
           src="/images/logos/AE vector-2.png"
           alt="Robust AE Logo"
           width={250}
           height={125}
           className="mb-8"
           priority
        />
      </div>

      {/* Add link to newsite page */}
      <div className="mb-8 mt-8">
        <Link href="/newsite" className="text-b0ase-blue hover:text-white transition-colors font-medium text-lg">
          Go to New Site Design
        </Link>
      </div>

      <div className="mb-32 grid gap-8 text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-2 lg:text-left">
        <section className="p-6 bg-b0ase-card rounded-lg">
          <h2 className="mb-3 text-2xl font-semibold text-white">
            Services
          </h2>
          <ul className="list-disc list-inside m-0 max-w-[30ch] text-sm text-gray-300">
              <li>Embedded Systems Development</li>
              <li>Industrial Automation</li>
          </ul>
        </section>

        <section className="p-6 bg-b0ase-card rounded-lg">
          <h2 className="mb-3 text-2xl font-semibold text-white">
            Contact
          </h2>
          <p className="m-0 max-w-[30ch] text-sm text-gray-300">
            George Haworth<br />
            Tel: 07447 544 890<br />
            Email: info@robust-ae.com
          </p>
          <a
            href="/images/logos/George_Haworth_CV_23042025.pdf"
            download
            className="mt-2 inline-block text-sm text-b0ase-blue hover:text-white transition-colors"
          >
            Download CV
          </a>
        </section>

        <section className="col-span-2 mt-8 border-t border-gray-800 pt-8 text-center lg:text-left">
           <h2 className="mb-3 text-2xl font-semibold text-white">Company Information</h2>
           <p className="m-0 max-w-[40ch] text-sm text-gray-300 mx-auto lg:mx-0">
             Company number: 11269142
           </p>
           <div className="mt-4 flex justify-center lg:justify-start gap-8 items-center">
              <div>
                 <Image
                   src="/images/logos/napit-logo.png"
                   alt="NAPIT Logo"
                   width={96}
                   height={48}
                   className="object-contain"
                 />
                 <p className="text-xs text-gray-300 mt-1">Membership: 60482</p>
              </div>
              <div>
                 <Image
                   src="/images/logos/iet-logo.jpg"
                   alt="IET Logo"
                   width={96}
                   height={48}
                   className="object-contain"
                 />
                 <p className="text-xs text-gray-300 mt-1">Membership: 1100789092</p>
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
