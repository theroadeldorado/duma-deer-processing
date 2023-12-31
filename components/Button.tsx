import clsx from 'clsx';
import Link from 'next/link';

type Props = {
  className?: string;
  color?: string;
  size?: string;
  type?: 'submit' | 'reset' | 'button' | undefined;
  disabled?: boolean;
  children: React.ReactNode;
  href?: string;
  [x: string]: any;
};

type ColorTypes = {
  [x: string]: string;
};

type SizeTypes = {
  [x: string]: string;
};

export default function Button({ className, disabled, type = 'button', color = 'primary', size = 'md', children, href, ...props }: Props) {
  const baseClasses = 'font-semibold rounded-lg inline-flex items-center justify-center duration-300 ease-in-out transition-all';

  const sizes: SizeTypes = {
    '2xl': 'text-lg py-4 px-7',
    xl: 'text-md py-3 px-5',
    lg: 'text-md py-[0.625rem] px-[1.125rem]',
    md: 'text-sm py-[0.625rem] px-4',
    sm: 'text-sm py-2 px-[0.875rem]',
  };

  const colors: ColorTypes = {
    default: 'bg-white text-black border border-gray-300 hover:bg-gray-50 shadow-xs focus:ring-4 focus:ring-gray-100',
    primary: 'bg-primary-blue border-0 text-white hover:bg-tan-2 shadow-xs focus-visible:ring-primary-blue border-green hover:border-tan-2',
    gray: 'bg-gray-50 border-gray-50 border hover:border-gray-100 text-gray-800 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100',
    danger:
      'bg-red-50 text-red-500 hover:text-white focus:text-white border border-red-500 hover:border-red-700 hover:bg-red-700 focus:ring-4 focus:ring-red-700',
  };

  const colorClasses = colors[color];
  const sizeClasses = sizes[size];

  return href ? (
    <Link href={href} className={clsx(className, baseClasses, sizeClasses, colorClasses, disabled ? 'opacity-60' : '')} {...props}>
      {children}
    </Link>
  ) : (
    <button
      type={type}
      className={clsx(className, baseClasses, sizeClasses, colorClasses, disabled ? 'opacity-60' : '')}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
