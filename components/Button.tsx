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
  const baseClasses = 'font-semibold rounded-lg inline-flex items-center justify-center';

  const sizes: SizeTypes = {
    '2xl': 'text-lg py-4 px-7',
    xl: 'text-md py-3 px-5',
    lg: 'text-md py-[0.625rem] px-[1.125rem]',
    md: 'text-sm py-[0.625rem] px-4',
    sm: 'text-sm py-2 px-[0.875rem]',
  };

  const colors: ColorTypes = {
    default: 'bg-white text-black border border-gray-300 hover:bg-gray-50 shadow-xs focus:ring-4 focus:ring-gray-100',
    primary: 'bg-blue-500 text-white border hover:bg-blue-600 shadow-xs focus:ring-4 focus:ring-blue-100 border-blue-500 hover:border-blue-600',
    gray: 'bg-gray-50 border-gray-50 border hover:border-gray-100 text-gray-800 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100',
    danger: 'bg-red-50 text-red-700 border border-red-50 hover:border-red-100 hover:bg-red-100 focus:ring-4 focus:ring-red-100',
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
