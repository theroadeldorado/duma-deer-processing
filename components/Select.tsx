import { useFormContext, Controller } from 'react-hook-form';
import SelectBase from 'components/SelectBase';
import { FieldWrapper } from 'components/FieldWrapper';

type Props = {
  name: string;
  className?: string;
  required?: boolean;
  isMulti?: boolean;
  label?: string;
  isClearable?: boolean;
  defaultValue?: string;
  options: {
    value: string;
    label: string;
  }[];
  [x: string]: any;
};

export default function Select({
  name,
  className,
  label,
  required,
  isMulti,
  options,
  isClearable,
  defaultValue,
  onChange: customOnChange,
  ...props
}: Props) {
  const { control } = useFormContext();

  return (
    <FieldWrapper name={name} label={label} className={className}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={{ required: required ? 'This field is required' : false }}
        render={({ field: { onChange, value, ref, ...field } }) => {
          let selected = null;
          if (isMulti) {
            selected = value?.length ? value.map((value: string) => options?.find((it) => it.value === value)) : [];
          } else {
            selected = options?.find((it) => it.value === value) || '';
          }
          const onSelect = (value: any) => {
            if (isMulti) {
              const newValue = value?.map((option: any) => option.value);
              customOnChange?.(newValue);
              onChange(newValue);
            } else {
              onChange(value?.value);
              customOnChange?.(value?.value);
            }
          };
          return (
            <SelectBase
              options={options}
              onChange={onSelect}
              value={selected}
              cacheOptions
              isClearable={isClearable}
              defaultOptions
              isMulti={isMulti}
              noOptionsMessage={({ inputValue }: any) => (inputValue.length ? 'No Results' : 'Select...')}
              instanceId={name}
              {...field}
              {...props}
            />
          );
        }}
      />
    </FieldWrapper>
  );
}
