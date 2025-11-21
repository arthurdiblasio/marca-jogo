// import React from 'react';
// import { useImageUpload } from '@/hooks/useImageUpload';

// interface ImageMultiUploadProps {
//   hook: ReturnType<typeof useImageUpload>;
//   id: string;
//   label: string;
//   maxFiles: number;

// }

// export function ImageMultiUpload({ hook, id, label, maxFiles = 5 }: ImageMultiUploadProps) {
//   const { previews, addFiles, removeFile } = hook;

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       addFiles(Array.from(files));
//       e.target.value = '';
//     }
//   };

//   return (
//     <div className='col-span-full pt-2'>
//       <label htmlFor={id} className="block text-sm font-medium text-gray-700">
//         {/* Usando o label e o limite dinâmico */}
//         {label} (Máx. {maxFiles} fotos)
//       </label>
//       <input
//         id={id}
//         type="file"
//         accept="image/*"
//         multiple
//         onChange={handleFileChange}
//         className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
//       />

//       {/* Seção de Previews */}
//       {previews.length > 0 && (
//         <div className="mt-4 flex flex-wrap gap-4">
//           {previews.map((url, index) => (
//             <div key={index} className="relative">
//               <img
//                 src={url}
//                 alt={`Preview ${index + 1}`}
//                 className="h-24 w-24 object-cover rounded-lg border border-gray-300 shadow-md"
//               />
//               <button
//                 type="button"
//                 onClick={() => removeFile(index)}
//                 className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 pl-2 pr-2 text-xs leading-none"
//               >
//                 X
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


// Advanced Image Multi Upload Component with fixed slots, drag & drop ordering
import React, { useRef, useState } from "react";
import { X, GripVertical, Plus } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Reorder } from "framer-motion";

/**
 * Props
 */
interface AdvancedImageMultiUploadProps {
  hook: ReturnType<typeof useImageUpload>;
  id: string;
  label: string;
  maxFiles?: number;
}

/**
 * Component: Fixed-slot image uploader with ordering + previews
 */
export function ImageMultiUpload({
  hook,
  id,
  label,
  maxFiles = 5,
}: AdvancedImageMultiUploadProps) {
  const { previews, addFiles, removeFile, setInitialUrls } = hook;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  /** handle input selection */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      addFiles(Array.from(files));
      e.target.value = "";
    }
  };

  /** clicking inside empty slot triggers input */
  const handleSlotClick = () => {
    inputRef.current?.click();
  };

  /** reorder previews */
  const handleReorder = (newOrder: string[]) => {
    hook.setInitialUrls(newOrder);
  };

  /** total slots = maxFiles; previews fill the first N */
  const slots = Array.from({ length: maxFiles });

  return (
    <div className="col-span-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} (Máx. {maxFiles})
      </label>

      {/* Hidden real file input */}
      <input
        id={id}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        ref={inputRef}
        onChange={handleFileChange}
      />

      {/* Grid of Slots */}
      <Reorder.Group
        axis="x"
        values={previews}
        onReorder={handleReorder}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
      >
        {slots.map((_, index) => {
          const url = previews[index] || null;

          return (
            <Reorder.Item
              key={url || `slot-${index}`}
              value={url || `empty-${index}`}
              drag={!!url}
              className="relative h-38 w-38 border rounded-xl flex items-center justify-center bg-gray-100 overflow-hidden group cursor-pointer"
              onClick={() => {
                if (!url) handleSlotClick();
              }}
            >
              {/* If preview exists */}
              {url ? (
                <>
                  <img
                    src={url}
                    alt="Imagem ${index + 1}"
                    className="h-full w-full object-cover pointer-events-none"
                  />

                  {/* Drag handle */}
                  <div className="absolute top-1 left-1 bg-white/80 rounded p-1 opacity-0 group-hover:opacity-100 transition pointer-events-auto">
                    <GripVertical size={18} className="text-gray-600" />
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition pointer-events-auto"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                /* Empty slot */
                <Plus className="text-gray-400" size={30} />
              )}
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </div>
  );
}

