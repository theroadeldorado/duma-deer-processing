import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload,
  faPenToSquare,
  faLock,
  faTrash,
  faEnvelope,
  faPlus,
  faArrowRightFromBracket,
  faUser,
  faRotateRight,
  faXmark,
  faBars,
  faEye,
  faEyeSlash,
  faAngleDown,
  faSpinnerThird,
  faFile,
  faFileImage,
  faFileZipper,
  faFileVideo,
  faArrowLeft,
} from '@fortawesome/pro-regular-svg-icons';
import { faCaretDown, faCaretUp } from '@fortawesome/pro-solid-svg-icons';

const icons = {
  download: faDownload,
  edit: faPenToSquare,
  lock: faLock,
  delete: faTrash,
  envelope: faEnvelope,
  plus: faPlus,
  logout: faArrowRightFromBracket,
  user: faUser,
  retry: faRotateRight,
  close: faXmark,
  menu: faBars,
  eye: faEye,
  eyeSlash: faEyeSlash,
  angleDown: faAngleDown,
  sortDown: faCaretDown,
  sortUp: faCaretUp,
  spinner: faSpinnerThird,
  file: faFile,
  fileImage: faFileImage,
  fileZip: faFileZipper,
  fileVideo: faFileVideo,
  arrowLeft: faArrowLeft,
};

type Props = {
  name: keyof typeof icons;
  [key: string]: any;
};

export default function Icon({ name, ...props }: Props) {
  return <FontAwesomeIcon icon={icons[name]} {...props} />;
}
