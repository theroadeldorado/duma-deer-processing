import { ProfileT } from 'lib/types';
import { parseAsync } from 'json2csv';
import { admin } from 'lib/firebaseAdmin';
import fs from 'fs/promises';
import dayjs from 'dayjs';

export const exportUsers = async (data: ProfileT[]) => {
  const fields = {
    _id: 'ID',
    name: 'Name',
    email: 'Email',
    createdAt: 'Joined',
  };

  const formattedData = data.map((data) => {
    return {
      ...data,
      _id: data._id.toString(),
      createdAt: dayjs(data.createdAt).format('MM/DD/YYYY'),
    };
  });

  return saveCSV('Users', fields, formattedData);
};

export const saveCSV = async (prefix: string, fields: any, data: any) => {
  const formattedFields = Object.keys(fields).map((key) => {
    return { label: fields[key], value: key };
  });

  const csv = await parseAsync(data, { fields: formattedFields });
  const filename = `${prefix}-${dayjs().format('YYYY-MM-DD')}-${dayjs().valueOf()}.csv`;
  await fs.writeFile(`/tmp/${filename}`, csv);
  const bucket = admin.storage().bucket();

  const files = await bucket.upload(`/tmp/${filename}`, {
    destination: `exports/${filename}`,
    contentType: 'text/csv',
  });

  const url = await files[0].getSignedUrl({
    action: 'read',
    expires: dayjs().add(1, 'day').format(),
  });

  return url[0];
};
