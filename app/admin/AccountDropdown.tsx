'use client';
import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import Icon from '@/components/Icon';
import { useUser } from '@/providers/UserProvider';
import Avatar from '@/components/Avatar';
import Link from 'next/link';

const AccountDropdown = () => {
  const { displayName, email } = useUser();

  const links = [
    {
      name: 'Account',
      href: '/admin/account',
      icon: <Icon name='user' className='stroke-2' />,
    },
    {
      name: 'Log out',
      href: '/logout',
      icon: <Icon name='logout' className='stroke-2' />,
    },
  ];

  return (
    <Menu as='div' className='relative z-10'>
      <Menu.Button className='rounded-full transition-all duration-200 hover:ring-2 hover:ring-gray-200 hover:ring-offset-2'>
        {displayName && <Avatar name={displayName} className='h-7 w-7 text-xs' />}
      </Menu.Button>

      <Transition
        enter='transition duration-200 ease-out'
        enterFrom='scale-95 opacity-0'
        enterTo='scale-100 opacity-100'
        leave='transition duration-150 ease-in'
        leaveFrom='scale-100 opacity-100'
        leaveTo='scale-95 opacity-0'
      >
        <Menu.Items className='absolute right-0 top-2 z-50 min-w-[240px] overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-700 shadow-lg'>
          <div className='flex gap-3 border-b border-gray-200 px-4 py-3'>
            <Avatar name={displayName} />
            <div className='text-sm'>
              <p className='font-semibold'>{displayName}</p>
              <p className='text-gray-600'>{email}</p>
            </div>
          </div>
          {links.map(({ name, href, icon }) => (
            <Menu.Item key={name}>
              {({ active }) => (
                <Link className='flex items-center gap-2 border-b border-gray-200 p-4 text-sm font-medium text-gray-700 hover:bg-gray-50' href={href}>
                  {icon}
                  <span>{name}</span>
                </Link>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default AccountDropdown;
