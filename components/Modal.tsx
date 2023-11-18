import React from 'react';

const Modal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/50'>
      <div className='relative  w-full max-w-[1200px] rounded-2xl bg-white p-4  shadow-md'>
        <button
          className='absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary-blue text-white hover:bg-orange-600'
          onClick={onClose}
        >
          <svg xmlns='http://www.w3.org/2000/svg' className='h-auto w-5 max-w-full' viewBox='0 0 384 512'>
            <path
              fill='currentColor'
              d='M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z'
            />
          </svg>
        </button>
        <div className='max-h-[90vh] overflow-scroll p-10'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
