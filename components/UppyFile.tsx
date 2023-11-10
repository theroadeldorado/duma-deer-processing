import React, { useEffect, useState } from 'react'; // Import useEffect and useState directly
import Uppy from '@uppy/core';
import { DragDrop } from '@uppy/react';
import '@uppy/status-bar/dist/style.css';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import { uploadFile } from '@/lib/firebase';
import { FileT } from '@/lib/types';
import Icon from '@/components/Icon';

type Props = {
  limit?: number;
  onSuccess: (files: FileT[]) => void;
  fileTypes?: string[];
};

const uppy = new Uppy({
  autoProceed: true,
});

export default function UppyFile({ limit, onSuccess, fileTypes }: Props) {
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    uppy.setOptions({
      restrictions: {
        maxNumberOfFiles: limit || 10,
        allowedFileTypes: fileTypes || null,
      },
    });
    uppy.on('files-added', async (files) => {
      setUploading(true);
      const uploads = await Promise.all(
        files.map(async (file) => {
          return await uploadFile(file.data as File);
        })
      );
      const successFiles = uploads.filter((it) => !!it) as FileT[];
      onSuccess(successFiles);
      setUploading(false);
    });

    // Cleanup on unmount
    return () => uppy.close();
  }, [limit, fileTypes, onSuccess]); // Add onSuccess to the dependency array

  return (
    <div className='relative'>
      {!uploading && <DragDrop uppy={uppy} height='120px' />}
      {uploading && (
        <div className='flex h-[120px] w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-lg font-bold'>
          <Icon name='spinner' className='text-3xl animate-spin text-gray-500' />
        </div>
      )}
    </div>
  );
}
