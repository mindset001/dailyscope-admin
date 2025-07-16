'use client';

import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { Users, BookOpen } from 'lucide-react';

export default function SettingsPage() {
  const [newRegistrations, setNewRegistrations] = useState(true);
  const [locationRequired, setLocationRequired] = useState(true);
  const [articleSharing, setArticleSharing] = useState(true);
  const [articleExport, setArticleExport] = useState(false);

  const [registrationLimit, setRegistrationLimit] = useState('100');
  const [articleReadLimit, setArticleReadLimit] = useState('5');

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="text-gray-500">Control system – wide behaviour and preference</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registration & Access */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex gap-2 items-center font-semibold">
            <Users className="w-5 h-5" />
           <p className='text-[12px] font-[500]'> Registration & Access</p>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-[12px] font-[500]">New registrations</p>
                <p className="text-[10px] font-[400]">New users can register to the platform</p>
              </div>
              <Switch
                checked={newRegistrations}
                onChange={setNewRegistrations}
                className={`${newRegistrations ? 'bg-black' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full transition`}
              >
                <span
                  className={`${
                    newRegistrations ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>

            <hr className="my-4" />

            <div className="">
                <h1 className='text-[12px] font-[500]'>Mandatory Profile Fields</h1>
             <div className='flex justify-between items-center mt-6'>
                 <div>
                <p className="text-[12px] font-[500]">City/Location Required</p>
                <p className="text-[10px] font-[400]">Require location information</p>
              </div>
              <Switch
                checked={locationRequired}
                onChange={setLocationRequired}
                className={`${locationRequired ? 'bg-black' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full transition`}
              >
                <span
                  className={`${
                    locationRequired ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
             </div>
            </div>
          </div>
        </div>

        {/* Article Limitations */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
         <div>
             <div className="flex gap-2 items-center font-semibold">
            <BookOpen className="w-5 h-5" />
          <p className='text-[12px] font-[500]'> Article Limitation</p>
           
          </div>
           <p  className="text-[10px] font-[400]">Set limits for your platform</p>
         </div>
          <div className="space-y-4">
            <div>
              <label className="text-[8px] font-[500]">New Registrations</label>
              <input
                type="number"
                value={registrationLimit}
                onChange={(e) => setRegistrationLimit(e.target.value)}
                className="mt-1 w-full border-gray-200 rounded-md text-sm px-3 py-2 bg-gray-100"
              />
              <p className="text-[8px] font-[400] mt-1">Next new users registrations limits</p>
            </div>

            <div>
              <label className="text-[8px] font-[500]">Maximum article read per user</label>
              <input
                type="number"
                value={articleReadLimit}
                onChange={(e) => setArticleReadLimit(e.target.value)}
                className="mt-1 w-full border-gray-200 rounded-md text-sm px-3 py-2 bg-gray-100"
              />
              <p className="text-[8px] font-[400] mt-1">
                How many times each user can read a single article?
              </p>
            </div>
          </div>
        </div>

        {/* Privacy & Sharing */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-xl p-6 shadow-sm space-y-6">
           <div>
             <div className="flex gap-2 items-center font-semibold">
            <BookOpen className="w-5 h-5" />
          <p className='text-[12px] font-[500]'> Privacy & Sharing</p>
           
          </div>
           <p  className="text-[10px] font-[400]">Configure data sharing and privacy options</p>
         </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[12px] font-[500]">Allow Article sharing</p>
                <p className="text-[10px] font-[400]">User can share link to others</p>
              </div>
              <Switch
                checked={articleSharing}
                onChange={setArticleSharing}
                className={`${articleSharing ? 'bg-black' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full transition`}
              >
                <span
                  className={`${
                    articleSharing ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>

            <hr className='bg-[#99999933]'/>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-[12px] font-[500]">Allow article export</p>
                <p className="text-[10px] font-[400]">User can export article</p>
              </div>
              <Switch
                checked={articleExport}
                onChange={setArticleExport}
                className={`${articleExport ? 'bg-black' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full transition`}
              >
                <span
                  className={`${
                    articleExport ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-6">
        <button className="w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-900">
          Save All Settings
        </button>
      </div>
    </div>
  );
}
