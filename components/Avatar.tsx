import clsx from 'clsx';
import React from 'react';

type Props = {
  id?: string;
  name: string;
  className?: string;
};

export default function Avatar({ id, name, className }: Props) {
  if (!name) return null;
  //get first and last initials, capitalized
  const firstInitial = name.split(' ')[0][0].toUpperCase();
  const lastInitial = name.split(' ').pop()?.[0].toUpperCase();
  const initials = `${firstInitial}${lastInitial}`;

  // generate a random color based on the initials
  const stringToHslColor = (str: string, s: number, l: number): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const h = hash % 360;
    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
  };

  const color = stringToHslColor(name, 50, 50);

  return (
    <div
      id={id}
      className={clsx(
        'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white print:h-auto print:w-auto print:border print:border-gray-300 print:!bg-transparent print:text-black',
        className
      )}
      style={{ backgroundColor: color }}
    >
      <span className='print:hidden'>{initials}</span>
      <span className='hidden print:inline'>{name}</span>
    </div>
  );
}
