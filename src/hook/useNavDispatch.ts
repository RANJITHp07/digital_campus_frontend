import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '@/redux/store';

export const useNavDispatch = () => {
  const navigation = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const appSelector = useAppSelector;

  return { dispatch, navigation, appSelector };
};
