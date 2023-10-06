'use client';
import React from 'react';
import { EmailTemplateT } from 'lib/types';
import Button from 'components/Button';
import Input from 'components/Input';
import Form from 'components/Form';
import { useForm } from 'react-hook-form';
import useMutation from 'hooks/useMutation';
import { useRouter } from 'next/navigation';
import { EmailTemplateZ } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Textarea from '@/components/Textarea';
import { useQueryClient } from '@tanstack/react-query';
import EmailVariables from '@/components/EmailVars';
import EmailPreview from '@/components/EmailPreview';
import clsx from 'clsx';
import { Switch } from '@headlessui/react';

type Inputs = {
  name: string;
  subject: string;
  body: string;
};

type Props = {
  data: EmailTemplateT;
};

export default function EditForm({ data: { vars, ...data } }: Props) {
  const [preview, setPreview] = React.useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm<Inputs>({
    defaultValues: data,
    resolver: zodResolver(EmailTemplateZ),
  });

  const mutation = useMutation({
    url: `/api/email-templates/${data?._id}`,
    method: 'PUT',
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/templates']);
      router.push('/admin/templates');
    },
  });

  return (
    <Form form={form} onSubmit={mutation.mutate}>
      <div className='my-8 bg-white shadow sm:rounded-lg'>
        <div className='flex flex-col gap-4 p-6'>
          <Input type='text' name='name' label='Template Name' required large />

          <div>
            <Input type='text' name='subject' label='Subject' required className={clsx(preview && 'hidden')} />
            <EmailPreview body={form.watch('subject')} vars={vars} className={clsx(!preview && 'hidden')} />
          </div>

          <div>
            <Textarea name='body' label='Body' required rows={10} className={clsx(preview && 'hidden')} />
            <EmailPreview body={form.watch('body')} vars={vars} className={clsx(!preview && 'hidden')} />
          </div>

          <Switch.Group>
            <div className='flex items-center'>
              <Switch
                checked={preview}
                onChange={(checked) => setPreview(checked)}
                className={`${preview ? 'bg-blue-500' : 'bg-gray-400'}
                  relative inline-flex h-5 w-10 items-center rounded-full transition-all`}
              >
                <span
                  className={`transition-all ${preview ? 'translate-x-[1.36rem]' : 'translate-x-1'}
                    inline-block h-3.5 w-3.5 transform rounded-full bg-white`}
                />
              </Switch>
              <Switch.Label className='input-label ml-3'>Enable preview</Switch.Label>
            </div>
          </Switch.Group>

          <EmailVariables vars={vars} />
        </div>
        <div className='flex rounded-b-lg bg-gray-50 px-4 py-3 sm:px-6'>
          <Button type='submit' disabled={mutation.isLoading} className='ml-auto font-medium'>
            Save Template
          </Button>
        </div>
      </div>
    </Form>
  );
}
