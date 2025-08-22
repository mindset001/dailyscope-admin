'use client';

import { Dialog } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import {  createArticles } from '@/api/article';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { message, notification } from 'antd';
import { useState, useRef, ChangeEvent } from 'react';
import * as z from 'zod';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  authorName: z.string().min(1, 'Author name is required'),
  category: z.string().min(1, 'Category is required'),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateArticleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string>(''); // Add this line
  const fileInputRef = useRef<HTMLInputElement>(null);

 const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      authorName: '',
      category: '',
    },
  });

   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    const newFiles = Array.from(e.target.files).slice(0, 4 - files.length); // Limit to 4 files
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setFiles(prev => [...prev, ...newFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
  }
};
 const removeImage = (index: number) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(previews[index]);
    
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

const onSubmit = async (data: FormData) => {
  console.log('=== START FORM SUBMISSION ===');
  
  setImageError('');
  if (files.length === 0) {
    setImageError('At least one image is required.');
    return;
  }

  const adminData = localStorage.getItem("admin");
  const token = localStorage.getItem("adminToken");

  console.log('Admin data exists:', !!adminData);
  console.log('Token exists:', !!token);
  console.log('Files to upload:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));

  if (!adminData || !token) {
    notification.error({ message: 'Authentication Error', description: 'Please login first.' });
    return;
  }

  const user = JSON.parse(adminData);
  console.log('User ID:', user.id);

  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("category", data.category);
  formData.append("authorName", data.authorName);
  formData.append("userId", user.id);

  // Debug FormData contents
  console.log('FormData contents:');
  for (let [key, value] of formData.entries()) {
    console.log(key, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
  }

  // Append files
  console.log('Appending cover file:', files[0].name);
  formData.append("cover", files[0]);

  if (files.length > 1) {
    files.slice(1).forEach((file, index) => {
      console.log(`Appending image ${index + 1}:`, file.name);
      formData.append("images", file);
    });
  }

  try {
    console.log('Calling createArticles API...');
    const result = await createArticles(formData);
    console.log('API response:', result);
    
    message.success('Article created successfully!');
    previews.forEach(url => URL.revokeObjectURL(url));
    form.reset();
    setFiles([]);
    setPreviews([]);
    onClose();
    
  } catch (error: any) {
    console.error('Submission failed:', error);
    message.error({
      content: error?.response?.data?.error || error.message || "Failed to create article",
    });
  }
  
  console.log('=== END FORM SUBMISSION ===');
};



  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 overflow-y-auto">
      <Dialog.Panel className="bg-white rounded-xl w-[80%] p-8 space-y-6">
        {/* <Dialog.Title className="text-2xl font-semibold text-center">Create new Article</Dialog.Title> */}

          <section className="w-full flex flex-col items-center justify-center ">
      {/* <div className="mb-8 flex flex-col items-center">
        <h1 className="text-[40px] md:text-[82px] font-[800] mt-4 mb-2 text-center px-2">
          Create an Article
        </h1> 
      </div> */}

      <div className='p-6 bg-white md:w-[60%] flex flex-col justify-center rounded-lg shadow-md'>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Create new Article</h1>

         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className='flex flex-row gap-4 w-full'>
              <div className='w-full'>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Article title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter article title"
                  {...form.register('title')}
                  className="mt-1 block w-full rounded-md bg-[#F6F6F6] rounded-[11px] text-[12px] md:text-[16px] p-2 outline-none"
                />
                {form.formState.errors.title && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.title.message}</p>
                )}
              </div>
              
              <div className='w-full'>
                <label htmlFor="authorName" className="block text-sm font-medium text-gray-700">
                  Author Name
                </label>
                <input
                  id="authorName"
                  type="text"
                  placeholder="Enter author name"
                  {...form.register('authorName')}
                  className="mt-1 block w-full rounded-md bg-[#F6F6F6] rounded-[11px] text-[12px] md:text-[16px] p-2 outline-none"
                />
                {form.formState.errors.authorName && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.authorName.message}</p>
                )}
              </div>
            </div>

            <div className='w-full'>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                id="category"
                type="text"
                placeholder="Enter category"
                {...form.register('category')}
                className="mt-1 block w-full rounded-md bg-[#F6F6F6] rounded-[11px] text-[12px] md:text-[16px] p-2 outline-none"
              />
              {form.formState.errors.category && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.category.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Write article
              </label>
              <textarea
                id="content"
                aria-multiline
                rows={10}
                placeholder="Enter article content"
                {...form.register('content')}
                className="mt-1 block w-full bg-[#F6F6F6] rounded-[11px] p-2"
              />
              {form.formState.errors.content && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.content.message}</p>
              )}
            </div>

            <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Images (Max 4)
        </label>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="relative">
              <div className="bg-[#F6F6F6] border-gray-300 rounded-lg p-4 text-center h-32">
                {previews[index] ? (
                  <>
                    <img
                      src={previews[index]}
                      alt={`Preview ${index}`}
                      className="h-full w-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <label className="cursor-pointer h-full flex flex-col items-center justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      multiple
                    />
                    <svg
                      className="mx-auto h-8 w-8 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="mt-2 block text-xs font-medium text-gray-700">
                      Add Image
                    </span>
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {imageError && (
    <p className="mt-1 text-sm text-red-600">{imageError}</p>
  )}

            <div className="flex justify-center pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Publishing...' : 'Publish Article'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
      </Dialog.Panel>
    </Dialog>
  );
}
