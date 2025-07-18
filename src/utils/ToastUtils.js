import { toast } from 'react-toastify';

const configPadrao = {
  position: "top-center",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
  theme: 'colored',
};

export const ToastUtils = {
  success: (msg, config = {}) => toast.success(msg, { ...configPadrao, ...config }),
  error: (msg, config = {}) => toast.error(msg, { ...configPadrao, ...config }),
  info: (msg, config = {}) => toast.info(msg, { ...configPadrao, ...config }),
  warn: (msg, config = {}) => toast.warn(msg, { ...configPadrao, ...config }),
  default: (msg, config = {}) => toast(msg, { ...configPadrao, ...config }),
};

export default ToastUtils;
