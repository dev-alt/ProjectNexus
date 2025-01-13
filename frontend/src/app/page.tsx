// app/page.tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-4 py-6 border-b">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold">ProjectNexus</div>
            <div className="space-x-4">
              <Link
                  href="/login"
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main>
          <section className="py-20">
            <div className="container mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">
                Modern Project Planning & Documentation
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                ProjectNexus helps teams plan, document, and deliver projects more effectively.
                From high-level architectures to detailed specifications, all in one place.
              </p>
              <div className="space-x-4">
                <Link
                    href="/register"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                    href="/login"
                    className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Why ProjectNexus?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">Centralized Planning</h3>
                  <p className="text-gray-600">
                    Keep all your project documentation, plans, and resources in one place.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">Team Collaboration</h3>
                  <p className="text-gray-600">
                    Work together seamlessly with real-time updates and feedback.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">AI Assistance</h3>
                  <p className="text-gray-600">
                    Get intelligent suggestions and automate documentation tasks.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-auto py-12 bg-gray-900 text-gray-300">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">ProjectNexus</h4>
                <p className="text-sm">
                  Modern project management and documentation platform.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li>Features</li>
                  <li>Pricing</li>
                  <li>Enterprise</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li>About</li>
                  <li>Blog</li>
                  <li>Careers</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li>Documentation</li>
                  <li>Help Center</li>
                  <li>Contact</li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
              © 2024 ProjectNexus. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
  );
}
