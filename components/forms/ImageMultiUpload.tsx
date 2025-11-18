import React from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ImageMultiUploadProps {
  hook: ReturnType<typeof useImageUpload>;
  id: string;
  label: string;
  maxFiles: number;

}

export function ImageMultiUpload({ hook, id, label, maxFiles = 5 }: ImageMultiUploadProps) {
  const { previews, addFiles, removeFile } = hook;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      addFiles(Array.from(files));
      e.target.value = '';
    }
  };

  return (
    <div className='col-span-full pt-2'>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {/* Usando o label e o limite dinâmico */}
        {label} (Máx. {maxFiles} fotos)
      </label>
      <input
        id={id}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />

      {/* Seção de Previews */}
      {previews.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {previews.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="h-24 w-24 object-cover rounded-lg border border-gray-300 shadow-md"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 pl-2 pr-2 text-xs leading-none"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}