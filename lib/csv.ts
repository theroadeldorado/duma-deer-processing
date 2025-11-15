import { ProfileT, DeerT } from 'lib/types';
import { parseAsync } from 'json2csv';
import { admin } from 'lib/firebaseAdmin';
import fs from 'fs/promises';
import dayjs from 'dayjs';

export const exportDeers = async (data: DeerT[]) => {
  const fields = {
    createdAt: 'Date',
    firstName: 'First Name',
    lastName: 'Last Name',
    tagNumber: 'Tag #',
    address: 'Address',
    city: 'City',
    state: 'State',
    zip: 'Zip',
    phone: 'Phone',
    communication: 'Communication',
    stateHarvestedIn: 'Harvested In',
    buckOrDoe: 'Doe/Buck',
    cape: 'Keep Cape',
    hide: 'Keep Hide',
    euroMount: 'Euro Mount',
    capeHideNotes: 'Cape/Hide Notes',
    skinnedOrBoneless: 'Skinned/Boneless',
    skinnedBonelessNotes: 'Skinned/Boneless Notes',
    backStrapsPreference: 'Back Straps 1 Preference',
    backStrapNotes: 'Back Straps Notes',
    hindLegPreference1: 'Hind Leg Preference 1',
    hindLegPreference2: 'Hind Leg Preference 2',
    hindLegNotes: 'Hind Leg Notes',
    tenderizedCubedSteaks: 'Tenderized Cubed Steaks',
    roast: 'Roast',
    roastNotes: 'Roast Notes',
    groundVenison: 'Ground Venison',
    groundVenisonAmount: 'Ground Venison Amount',
    groundVenisonNotes: 'Ground Venison Notes',
    trailBolognaRegular: 'Trail Bologna Regular',
    trailBolognaCheddarCheese: 'Trail Bologna Cheddar Cheese',
    trailBolognaHotPepperJackCheese: 'Trail Bologna Hot Pepper Jack Cheese',
    smokedJalapenoCheddarBrats: 'Smoked Jalapeño Cheddar Brats',
    garlicRingBologna: 'Garlic Ring Bologna',
    summerSausageMild: 'Summer Sausage Mild',
    summerSausageHot: 'Summer Sausage Hot',
    smokedKielbasaSausage: 'Smoked Kielbasa Sausage',
    italianSausageLinksMild: 'Italian Sausage Links Mild',
    italianSausageLinksHot: 'Italian Sausage Links Hot',
    countryBreakfastSausage: 'Country Breakfast Sausage',
    babyLinksCountry: 'Breakfast Linkss Country',
    babyLinksMaple: 'Breakfast Linkss Maple',
    snackSticksRegular: 'Snack Sticks Regular',
    snackSticksCheddarCheese: 'Snack Sticks Cheddar Cheese',
    snackSticksHotPepperJackCheese: 'Snack Sticks Hot Pepper Jack Cheese',
    snackSticksHotHotPepperJackCheese: 'Snack Sticks Hot Hot Pepper Jack Cheese',
    snackSticksHoneyBBQ: 'Snack Sticks Honey BBQ',
    hotDogsRegular: 'Hot Dogs Regular',
    hotDogsCheddarCheese: 'Hot Dogs Cheddar Cheese',
    hotDogsHotPepperJackCheese: 'Hot Dogs Hot Pepper Jack Cheese',
    jerkyRestructuredHot: 'Jerky Restructured Hot',
    jerkyRestructuredMild: 'Jerky Restructured Mild',
    jerkyRestructuredTeriyaki: 'Jerky Restructured Teriyaki',
    recapNotes: 'Recap Notes',
    amountPaid: 'Amount Paid',
    totalPrice: 'Total Price',
    _id: 'ID',
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
