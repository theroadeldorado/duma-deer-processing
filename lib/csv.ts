import { ProfileT, DeerT } from 'lib/types';
import { parseAsync } from 'json2csv';
import { admin } from 'lib/firebaseAdmin';
import fs from 'fs/promises';
import dayjs from 'dayjs';

export const exportDeers = async (data: DeerT[]) => {
  const fields = {
    createdAt: 'Date',
    name: 'Name',
    phone: 'Phone',
    communication: 'Communication',
    tagNumber: 'Tag Number',
    address: 'Address',
    city: 'City',
    state: 'State',
    zip: 'Zip',
    cape: 'Cape',
    hide: 'Hide',
    capeHideNotes: 'Cape/Hide Notes',
    isSkinned: 'Is Skinned',
    skinnedBonelessNotes: 'Skinned/Boneless Notes',
    backStrapsPreference: 'Back Straps 1 Preference',
    backStrap2Preference: 'Back Straps 2 Preference',
    backStrapNotes: 'Back Straps Notes',
    hindLegPreference1: 'Hind Leg Preference 1',
    hindLegPreference2: 'Hind Leg Preference 2',
    hindLegNotes: 'Hind Leg Notes',
    tenderizedCubedSteaks: 'Tenderized Cubed Steaks',
    hindLegJerky1: 'Hind Leg Jerky 1',
    hindLegJerky2: 'Hind Leg Jerky 2',
    roast: 'Roast',
    roastNotes: 'Roast Notes',
    groundVenison: 'Ground Venison',
    groundVenisonNotes: 'Ground Venison Notes',
    trailBolognaRegular: 'Trail Bologna Regular',
    trailBolognaCheddarCheese: 'Trail Bologna Cheddar Cheese',
    trailBolognaHotPepperJackCheese: 'Trail Bologna Hot Pepper Jack Cheese',
    trailBolognaNotes: 'Trail Bologna Notes',
    garlicRingBologna: 'Garlic Ring Bologna',
    garlicRingBolognaNotes: 'Garlic Ring Bologna Notes',
    summerSausageMild: 'Summer Sausage Mild',
    summerSausageHot: 'Summer Sausage Hot',
    summerSausageNotes: 'Summer Sausage Notes',
    smokedKielbasaSausage: 'Smoked Kielbasa Sausage',
    smokedKielbasaSausageNotes: 'Smoked Kielbasa Sausage Notes',
    italianSausageLinksMild: 'Italian Sausage Links Mild',
    italianSausageLinksHot: 'Italian Sausage Links Hot',
    italianSausageLinksNotes: 'Italian Sausage Links Notes',
    countryBreakfastSausage: 'Country Breakfast Sausage',
    countryBreakfastSausageNotes: 'Country Breakfast Sausage Notes',
    babyLinksCountry: 'Baby Links Country',
    babyLinksMaple: 'Baby Links Maple',
    babyLinksNotes: 'Baby Links Notes',
    snackSticksRegular: 'Snack Sticks Regular',
    snackSticksCheddarCheese: 'Snack Sticks Cheddar Cheese',
    snackSticksHotPepperJackCheese: 'Snack Sticks Hot Pepper Jack Cheese',
    snackSticksHotHotPepperJackCheese: 'Snack Sticks Hot Hot Pepper Jack Cheese',
    snackSticksHoneyBBQ: 'Snack Sticks Honey BBQ',
    snackSticksNotes: 'Snack Sticks Notes',
    hotDogsRegular: 'Hot Dogs Regular',
    hotDogsCheddarCheese: 'Hot Dogs Cheddar Cheese',
    hotDogsHotPepperJackCheese: 'Hot Dogs Hot Pepper Jack Cheese',
    hotDogsNotes: 'Hot Dogs Notes',
    jerkyRestructuredHot: 'Jerky Restructured Hot',
    jerkyRestructuredMild: 'Jerky Restructured Mild',
    jerkyRestructuredTeriyaki: 'Jerky Restructured Teriyaki',
    jerkyRestructuredNotes: 'Jerky Restructured Notes',
    recapNotes: 'Recap Notes',
  };

  const formattedData = data.map((data) => {
    return {
      ...data,
      createdAt: dayjs(data.createdAt).format('MM/DD/YYYY'),
    };
  });

  return saveCSV('Deers', fields, formattedData);
};

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
