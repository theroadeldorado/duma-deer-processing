import { FileT } from '@/lib/types';
import React from 'react';
import Icon from 'components/Icon';
import FileLink from './FileLink';

type Props = {
  file: FileT;
  onDelete?: () => void;
};

const UploadedFile = ({ file, onDelete }: Props) => {
  return (
    <div className='flex items-start justify-between gap-4 rounded-xl border border-gray-200 p-4'>
      <FileLink tooltipId='uploaded-file' file={file} />

      {onDelete && (
        <button
          type='button'
          onClick={() => onDelete()}
          title='Remove file'
          className='flex h-9 w-9 flex-shrink-0 flex-grow-0 items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100'
        >
          <Icon name='delete' className='text-lg text-gray-500' />
        </button>
      )}
    </div>
  );
};

export default UploadedFile;
