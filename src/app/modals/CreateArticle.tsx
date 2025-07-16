'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import { createArticle } from '@/api/article';

export default function CreateArticleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [form, setForm] = useState<{
    title: string;
    author: string;
    content: string;
    cover: File | null;
    images: (File | null)[];
  }>({
    title: '',
    author: '',
    content: '',
    cover: null,
    images: Array(4).fill(null),
  });

  const handleImageChange = (index: number, file: File | null) => {
    const updatedImages = [...form.images];
    updatedImages[index] = file;
    setForm({ ...form, images: updatedImages });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', form.title);
  formData.append('author', form.author);
  formData.append('content', form.content); // was "body", now corrected

  if (form.cover) {
    formData.append('cover', form.cover);
  }

  form.images.forEach((img) => {
    if (img) {
      formData.append('images', img); // backend should accept array of files
    }
  });

  try {
    const data = await createArticle(formData);
    console.log("✅ Article created:", data);
    onClose();
  } catch (error) {
    console.error("❌ Failed to create article:", error);
  }
};



  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <Dialog.Panel className="bg-white rounded-xl w-[700px] max-w-full p-8 space-y-6">
        <Dialog.Title className="text-2xl font-semibold text-center">Create new Article</Dialog.Title>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
           <div>
             <p className='text-[12px] font-[400]'>Article title</p>
             <input
              type="text"
              placeholder="Article title"
              className="p-3 bg-[#F6F6F6] outline-none  rounded-md"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
           </div>
           <div>
             <p className='text-[12px] font-[400]'>Name of Author</p>
             <input
              type="text"
              placeholder="Name of Author"
              className="p-3 bg-[#F6F6F6] outline-none rounded-md"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              required
            />
           </div>
          </div>

          <div>
            <p className='text-[12px] font-[400]'>Write Article</p>
            <textarea
            placeholder="Write article"
            rows={6}
            className="w-full bg-[#F6F6F6] outline-none p-3 rounded-md"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />
          </div>

          <div className="grid grid-cols-5 gap-3">
            <div>
              <label className="block text-sm font-medium">Upload Cover</label>
              <input type="file" onChange={(e) => setForm({ ...form, cover: e.target.files?.[0] || null })} />
            </div>
            {form.images.map((_, index) => (
              <div key={index}>
                <label className="block text-sm font-medium">Upload Image {index + 1}</label>
                <input type="file" onChange={(e) => handleImageChange(index, e.target.files?.[0] || null)} />
              </div>
            ))}
          </div>

        <div className='flex justify-center'>
              <Button type="submit" className=" mt-4">
            Publish Article
          </Button>
        </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
}
