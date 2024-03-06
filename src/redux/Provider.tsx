'use client';
// redux
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/redux/store';

interface Props {
  children: React.ReactNode;
}
export const Providers = ({ children }: Props) => {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
};
