import { EmailVarCode, EmailVarExamples, EmailVar } from '@/lib/enums';
import clsx from 'clsx';
import React from 'react';
import { Tooltip } from 'react-tooltip';

type Props = {
  body: string;
  vars: string[];
  className?: string;
};

const EmailPreview = ({ body, vars, className }: Props) => {
  // Replace all variables (#variable#) with their examples
  const preview = vars.reduce((acc, cur) => {
    const code = EmailVarCode[cur as EmailVar];
    const regex = new RegExp(code, 'g');

    if (cur.endsWith('Link')) {
      return acc.replace(regex, `<span class='variable-${cur} underline text-blue-500'>${EmailVarExamples[cur as EmailVar]}</span>`);
    }

    if (cur.endsWith('Preview')) {
      return acc.replace(regex, `<p class='variable-${cur} bg-gray-50 p-4 text-blue-500'>${EmailVarExamples[cur as EmailVar]}</p>`);
    }

    return acc.replace(regex, `<span class='variable-${cur} text-blue-500'>${EmailVarExamples[cur as EmailVar]}</span>`);
  }, body);

  return (
    <div className={clsx(className)}>
      <div className='w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 font-normal shadow-sm'>
        <div dangerouslySetInnerHTML={{ __html: preview }} className='whitespace-pre-line' />
      </div>

      <p className='text-brand-gray-dark mt-2 text-sm'>*Variables are highlighted in blue with the example text.</p>

      {/* Add a tooltip for each var */}
      {vars.map((v) => (
        <Tooltip key={v} anchorSelect={`.variable-${v}`}>
          <span>{EmailVarCode[v as EmailVar]}</span>
        </Tooltip>
      ))}
    </div>
  );
};

export default EmailPreview;
