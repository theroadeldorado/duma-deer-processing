import { EmailVar, EmailVarExamples, EmailVarCode } from '@/lib/enums';
import clsx from 'clsx';

type Props = {
  vars: EmailVar[];
};

export default function EmailVariables({ vars }: Props) {
  return (
    <div className='rounded-lg border border-gray-200 p-8'>
      <table className='min-w-full divide-y divide-gray-200 border-b border-gray-200'>
        <thead>
          <tr>
            <th className='pb-3 text-left text-xs font-semibold '>Variable</th>
            <th className='pb-3 text-left text-xs font-semibold '>Example</th>
          </tr>
        </thead>
        <tbody>
          {vars.map((varName) => (
            <tr key={varName} className='border-t border-gray-200'>
              <td className='py-3'>
                <span className='inline-flex rounded-2xl bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700'>{EmailVarCode[varName]}</span>
              </td>
              <td className={clsx('py-3 text-sm text-gray-600', varName.endsWith('Link') ? 'underline' : '')}>{EmailVarExamples[varName]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
