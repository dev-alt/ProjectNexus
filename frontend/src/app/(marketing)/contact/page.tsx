import React from 'react';

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
            <p className="text-lg text-gray-600 text-center mb-12">
                Have questions or feedback? We&#39;d love to hear from you.
            </p>

            {/* Contact Form */}
            <div className="mb-12">
                <form className="max-w-lg mx-auto">
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="message" className="block mb-2">
                            Message
                        </label>
                        <textarea
                            id="message"
                            className="w-full px-3 py-2 border rounded-md"
                        ></textarea>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                        Send Message
                    </button>
                </form>
            </div>

            {/* Other Contact Information */}
            <div>
                <h2 className="text-3xl font-semibold mb-4">Other Ways to Reach Us</h2>
                <p>Email: support@projectnexus.com</p>
                <p>Phone: +1-555-123-4567</p>
            </div>
        </div>
    );
}
