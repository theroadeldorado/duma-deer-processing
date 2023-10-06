import React from 'react';
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
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
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
  }, [limit, fileTypes]);

  return (
    <div className='relative'>
      {!uploading && <DragDrop uppy={uppy} height='120px' />}
      {uploading && (
        <div className='flex h-[120px] w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-lg font-bold'>
          <Icon name='spinner' className='animate-spin text-3xl text-gray-500' />
        </div>
      )}
    </div>
  );
}
