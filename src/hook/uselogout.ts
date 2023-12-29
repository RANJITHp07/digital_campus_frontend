import {useRouter} from 'next/navigation'
import Cookies from 'js-cookie';

const useLogout = () => {
  const navigation = useRouter();

  const logout = () => {
    Cookies.remove('accessToken');
    navigation.push('/login');
  };

  return logout;
};

export default useLogout;
