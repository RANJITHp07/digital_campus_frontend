import { useCallback } from 'react';
import { useNavDispatch } from '@/hook/useNavDispatch';
import { changeType } from '@/redux/features/classroom-slice/reducer';

const useNavigation = () => {
  const { navigation, dispatch } = useNavDispatch();

  const navigate = useCallback(
    (type:string) => {
      if (window.location.pathname !== 'classroom') {
        navigation.push('/classroom');
      }
      dispatch(changeType(type));
    },
    [dispatch, navigation]
  );

  return navigate;
};

export default useNavigation;
