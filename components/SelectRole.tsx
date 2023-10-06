import Select from 'components/Select';
import { RoleTypeLabel } from 'lib/enums';

const roleOptions = Object.entries(RoleTypeLabel).map(([key, value]) => ({
  value: key,
  label: value,
}));

export default function SelectRole(props: any) {
  return <Select {...props} options={roleOptions} />;
}
