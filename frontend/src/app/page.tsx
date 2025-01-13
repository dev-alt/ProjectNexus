import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header */}
        <header className="py-4 bg-white/70 backdrop-blur-md sticky top-0 z-10 border-b">
          <div className="container mx-auto flex items-center justify-between px-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              ProjectNexus
            </Link>
            <div className="space-x-4">
              <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 transition duration-200"
              >
                Sign In
              </Link>
              <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-grow">
          <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-white">
            <div className="container mx-auto px-4 text-center">
              <div className="md:max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
                  Revolutionize Your Project Planning
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8">
                  ProjectNexus empowers your team to plan, document, and execute
                  projects with unparalleled efficiency. From concept to
                  completion, experience seamless collaboration and AI-powered
                  insights.
                </p>
                <div className="space-x-4">
                  <Link
                      href="/register"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                  >
                    Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                      href="/features"
                      className="inline-flex items-center px-6 py-3 text-blue-600 hover:underline"
                  >
                    Explore Features
                  </Link>
                </div>
              </div>
              <div className="mt-12">
                <Image
                    src="/hero-image.png" // Replace with your actual hero image
                    alt="ProjectNexus Hero"
                    width={1000}
                    height={600}
                    className="mx-auto rounded-lg shadow-xl"
                />
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Why Choose ProjectNexus?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200">
                  <div className="h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg mb-4">
                    {/* Replace with an appropriate icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">
                    Unified Project Hub
                  </h3>
                  <p className="text-gray-600">
                    Consolidate all project-related documents, plans, and
                    resources in a single, accessible location.
                  </p>
                </div>
                {/* Feature 2 */}
                <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200">
                  <div className="h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg mb-4">
                    {/* Replace with an appropriate icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">
                    Enhanced Team Collaboration
                  </h3>
                  <p className="text-gray-600">
                    Foster real-time collaboration with live updates, feedback
                    tools, and streamlined communication channels.
                  </p>
                </div>
                {/* Feature 3 */}
                <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200">
                  <div className="h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg mb-4">
                    {/* Replace with an appropriate icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">
                    AI-Driven Insights
                  </h3>
                  <p className="text-gray-600">
                    Leverage AI to automate documentation, gain intelligent
                    suggestions, and optimize project outcomes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="py-16 md:py-24 bg-blue-600">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Projects?
              </h2>
              <p className="text-lg text-blue-100 mb-8">
                Start your free trial today and experience the future of project
                management.
              </p>
              <Link
                  href="/register"
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 hover:text-blue-700 transition duration-200"
              >
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-12 bg-gray-900 text-gray-300">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  ProjectNexus
                </h4>
                <p className="text-sm">
                  Your all-in-one solution for modern project management and
                  documentation.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Product
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                        href="/features"
                        className="hover:text-blue-400 transition duration-200"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                        href="/pricing"
                        className="hover:text-blue-400 transition duration-200"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                        href="/enterprise"
                        className="hover:text-blue-400 transition duration-200"
                    >
                      Enterprise
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Company
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                        href="/about"
                        className="hover:text-blue-400 transition duration-200"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                        href="/blog"
                        className="hover:text-blue-400 transition duration-200"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                        href="/careers"
                        className="hover:text-blue-400 transition duration-200"
                    >
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Resources
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                        href="/docs"
                        className="hover:text-blue-400 transition duration-200"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                        href="/help"
                        className="hover:text-blue-400 transition duration-200"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                        href="/contact"
                        className="hover:text-blue-400 transition duration-200"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-8 text-center">
              <p className="text-sm">
                © {new Date().getFullYear()} ProjectNexus. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
  );
}
