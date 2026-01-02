import { showToast } from 'nextjs-toast-notify';

export const Notify = {
  success: (message: string, options?: any) => {
    showToast.success(message, {
       duration: 4000,
    progress: true,
    position: "top-right",
    transition: "topBounce",
    icon: '',
    sound: true,
    });
  },

  error: (message: string, options?: any) => {
    showToast.error(message, {
      duration: 4000,
      position: 'top-right',
      ...options,
    });
  },

  info: (message: string, options?: any) => {
    showToast.info(message, {
       duration: 4000,
    progress: true,
    position: "top-right",
    transition: "topBounce",
    icon: '',
    sound: true,
    });
  },

  warning: (message: string, options?: any) => {
    showToast.warning(message, {
       duration: 4000,
    progress: true,
    position: "top-right",
    transition: "topBounce",
    icon: '',
    sound: true,
    });
  },
};