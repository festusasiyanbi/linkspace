import {useCallback} from 'react';
import Toast from 'react-native-toast-message';

const useToast = () => {
  const showToastMessage = useCallback(
    (
      type: 'error' | 'success' | 'info' | 'warning',
      text1: string,
      text2: string,
    ) => {
      Toast.show({
        type,
        text1,
        text2,
      });
    },
    [],
  );

  const showErrorToast = useCallback(
    (title: string, message: string) => {
      showToastMessage('error', title, message);
    },
    [showToastMessage],
  );

  const showSuccessToast = useCallback(
    (title: string, message: string) => {
      showToastMessage('success', title, message);
    },
    [showToastMessage],
  );
  const showInfoToast = useCallback(
    (title: string, message: string) => {
      showToastMessage('info', title, message);
    },
    [showToastMessage],
  );
  const showWarningToast = useCallback(
    (title: string, message: string) => {
      showToastMessage('info', title, message);
    },
    [showToastMessage],
  );

  return {
    showErrorToast,
    showSuccessToast,
    showInfoToast,
    showWarningToast,
  };
};

export default useToast;
