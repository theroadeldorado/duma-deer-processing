import Icon from '@/components/Icon';
import clsx from 'clsx';
import React from 'react';

type Props = {
  ext?: string;
  className?: string;
  small?: boolean;
};

const FileIcon = ({ ext = 'file', className, small }: Props) => {
  const baseClass = clsx(small ? 'text-sm' : 'text-lg', 'text-gray-500/90 flex-shrink-0 mt-1');

  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
    return <Icon name='fileImage' className={clsx(baseClass, className)} />;
  } else if (['zip'].includes(ext)) {
    return <Icon name='fileZip' className={clsx(baseClass, className)} />;
  } else if (['mp4'].includes(ext)) {
    return <Icon name='fileVideo' className={clsx(baseClass, className)} />;
  } else {
    return <Icon name='file' className={clsx(baseClass, className)} />;
  }
};

export default FileIcon;
