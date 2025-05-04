import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        {/* Placeholder for a potential top bar or navigation */}
      </div>

      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
         {/* Placeholder for a main logo or hero image */}
         <h1 className="text-4xl font-bold text-center mb-8">Robust AE</h1>
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
        </section>

        <section className="col-span-2 mt-8 border-t pt-8 text-center lg:text-left">
           <h2 className="mb-3 text-2xl font-semibold">Company Information</h2>
           <p className="m-0 max-w-[40ch] text-sm opacity-75 mx-auto lg:mx-0">
             Company number: 11269142
           </p>
           <div className="mt-4 flex justify-center lg:justify-start gap-8 items-center">
              <div>
                 {/* Placeholder for NAPIT Logo */}
                 <div className="w-24 h-12 bg-gray-300 flex items-center justify-center text-xs text-gray-600">NAPIT Logo</div>
                 <p className="text-xs opacity-75 mt-1">Membership: 60482</p>
              </div>
              <div>
                 {/* Placeholder for IET Logo */}
                 <div className="w-24 h-12 bg-gray-300 flex items-center justify-center text-xs text-gray-600">IET Logo</div>
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
