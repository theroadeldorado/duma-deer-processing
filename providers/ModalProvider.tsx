import React from 'react';

// lib
import { KeyValueT } from 'lib/types';

// components
import ModalWrapper from 'components/ModalWrapper';

// modals
import ChangePass from '@/components/modals/ChangePass';

type Modal = {
  id: string;
  title: string;
  Component: React.ElementType;
  width?: string;
};

const modals: Modal[] = [
  {
    id: 'changePass',
    title: 'Change Password',
    Component: ChangePass,
  },
];

type ModalId = 'changePass';

type Context = {
  open: (id: ModalId, props?: KeyValueT) => void;
  close: () => void;
};

export const FieldContext = React.createContext<Context>({
  open: (id, props) => {},
  close: () => {},
});

type Props = {
  children: React.ReactNode;
};

const ModalProvider = ({ children }: Props) => {
  const [modalId, setModalId] = React.useState<ModalId | null>(null);
  const [closing, setClosing] = React.useState(false);
  const [modalProps, setModalProps] = React.useState<KeyValueT>({});
  const modal = modals.find((it) => it.id === modalId) || null;
  const Component = modal?.Component as React.ElementType;

  const open = React.useCallback((id: ModalId, props?: KeyValueT) => {
    setModalId(id);
    setModalProps(props || {});
  }, []);

  const close = React.useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setModalId(null);
      setClosing(false);
    }, 500);
  }, []);

  const handleDismiss = () => {
    close();
    modalProps?.onDismiss?.();
  };

  return (
    <FieldContext.Provider value={{ open, close }}>
      {children}
      <ModalWrapper title={modal?.title || ''} open={!!modal && !closing} width={modal?.width} onClose={handleDismiss}>
        {modal && <Component {...modalProps} />}
      </ModalWrapper>
    </FieldContext.Provider>
  );
};

const useModal = () => {
  const state = React.useContext(FieldContext);
  return { ...state };
};

export { ModalProvider, useModal };
