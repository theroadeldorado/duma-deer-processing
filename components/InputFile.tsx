import { useFormContext, Controller } from 'react-hook-form';
import UppyFile from '@/components/UppyFile';
import { FieldWrapper } from '@/components/FieldWrapper';
import { FileT } from '@/lib/types';
import UploadedFile from '@/components/UploadedFile';

type Props = {
  name: string;
  label?: string;
  required?: boolean;
  isMulti?: boolean;
};

export default function FileInputMulti({ name, label, isMulti, required }: Props) {
  const { control } = useFormContext();

  return (
    <div>
      <FieldWrapper name={name} label={label} required={required}>
        <Controller
          control={control}
          name={name}
          rules={{ required: required ? 'This field is required' : false }}
          render={({ field: { onChange, value } }) => {
            const handleDelete = async (url: string) => {
              if (!confirm('Are you sure you want to delete this file?')) return;
              setTimeout(() => onChange(value?.filter((file: FileT) => file.url !== url)), 100); //hack to prevent immediately opening uppy file selector
            };

            const handleAppend = (files: FileT[]) => {
              onChange([...(value || []), ...files]);
            };

            return (
              <>
                {!!value?.length && (
                  <div className='mb-4 grid gap-2'>
                    {value?.map((file: FileT) => (
                      <UploadedFile key={file.filename} file={file} onDelete={() => handleDelete(file.url)} />
                    ))}
                  </div>
                )}
                {(isMulti || !!value?.length) && <UppyFile limit={isMulti ? 10 : 1} onSuccess={handleAppend} />}
              </>
            );
          }}
        />
      </FieldWrapper>
    </div>
  );
}
