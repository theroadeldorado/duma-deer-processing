import { FileT } from '@/lib/types';
import React from 'react';
import FileIcon from '@/components/FileIcon';
import { convertFileSize } from '@/lib/helpers';
import clsx from 'clsx';
import { Tooltip } from 'react-tooltip';

type Props = {
  file: FileT;
  tooltipId?: string;
  theme?: 'stacked' | 'inline';
};

const FileLink = ({ file, tooltipId, theme = 'stacked' }: Props) => {
  // turn file.url into an attribute safe string
  const id = `${file.url.replace(/[^a-zA-Z0-9]/g, '-')}-${tooltipId}`;

  const shortenFilename = (filename: string) => {
    filename = filename.replace(/\.[^/.]+$/, '');
    if (filename.length > 24) {
      return `${filename.substring(0, 24)}...${file.ext}`;
    }

    return `${filename}.${file.ext}`;
  };

  return (
    <a href={file.url} target='_blank' rel='noreferrer' className='group flex w-full items-start gap-2'>
      <FileIcon ext={file.ext} />

      <span className={clsx('block', theme === 'inline' && 'flex items-center gap-3')}>
        <p className='max-w-full text-sm font-medium text-gray-700 group-hover:underline' id={`filelink-${id}`}>
          <span className='print:hidden'>{shortenFilename(file.filename)}</span>
          <span className='hidden print:inline'>{file.filename}</span>
        </p>
        <p className='flex-shrink-0 text-sm text-gray-600'>{convertFileSize(file.size)}</p>
      </span>

      <Tooltip anchorSelect={`#filelink-${id}`} className='max-w-[20rem] break-words text-center'>
        <p>{file.filename}</p>
      </Tooltip>
    </a>
  );
};

export default FileLink;
