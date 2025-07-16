'use client';

import { useState } from 'react';

export default function EmailCampaignPage() {
  const [emailFor, setEmailFor] = useState('');
  const [sendTime, setSendTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle actual email campaign submission
    console.log({ emailFor, sendTime, message });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-[40px] font-[600]">Schedule Email Campaigns</h1>
        <p className="text-[400] text-[16px]">Control system – wide behaviour and preference</p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
      
      >
       <div   className="bg-white rounded-xl shadow-sm p-6 space-y-6 max-w-4xl">
        <div className=" w-[70%] p-6 space-y-6 max-w-4xl">
             {/* Email + Send Time */}
        <div>
          <div  className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label className="text-sm font-medium">Email for</label>
            <input
              type="email"
              required
              placeholder="Enter email for"
              value={emailFor}
              onChange={(e) => setEmailFor(e.target.value)}
              className="mt-1 w-full px-4 py-2 text-sm rounded-md border border-gray-200 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Send time</label>
            <input
              type="date"
              required
              value={sendTime}
              onChange={(e) => setSendTime(e.target.value)}
              className="mt-1 w-full px-4 py-2 text-sm rounded-md border border-gray-200 bg-gray-100"
            />
          </div>
          </div>
        </div>

        {/* Custom Message */}
        <div>
          <label className="text-sm font-medium">Custom message</label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter email message"
            className="mt-1 w-full px-4 py-2 text-sm rounded-md border border-gray-200 bg-gray-100"
          />
        </div>
        </div>
       </div>

        {/* Submit Button */}
        <div className="mt-8 pt-4">
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-900"
          >
            Save email campaign
          </button>
        </div>
      </form>
    </div>
  );
}
