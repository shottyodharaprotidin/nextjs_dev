const BN_LOCATION_MAP = {
  dhaka: 'ঢাকা',
  bangladesh: 'বাংলাদেশ',
  "people's republic of bangladesh": 'বাংলাদেশ',

  chattogram: 'চট্টগ্রাম',
  chittagong: 'চট্টগ্রাম',
  cumilla: 'কুমিল্লা',
  comilla: 'কুমিল্লা',
  "cox's bazar": 'কক্সবাজার',
  'coxs bazar': 'কক্সবাজার',
  feni: 'ফেনী',
  noakhali: 'নোয়াখালী',
  lakshmipur: 'লক্ষ্মীপুর',
  laxmipur: 'লক্ষ্মীপুর',
  chandpur: 'চাঁদপুর',
  brahmanbaria: 'ব্রাহ্মণবাড়িয়া',
  khagrachhari: 'খাগড়াছড়ি',
  rangamati: 'রাঙ্গামাটি',
  bandarban: 'বান্দরবান',

  gazipur: 'গাজীপুর',
  narsingdi: 'নরসিংদী',
  narayanganj: 'নারায়ণগঞ্জ',
  manikganj: 'মানিকগঞ্জ',
  munshiganj: 'মুন্সিগঞ্জ',
  tangail: 'টাঙ্গাইল',
  kishoreganj: 'কিশোরগঞ্জ',
  faridpur: 'ফরিদপুর',
  rajbari: 'রাজবাড়ী',
  gopalganj: 'গোপালগঞ্জ',
  madaripur: 'মাদারীপুর',
  shariatpur: 'শরীয়তপুর',

  mymensingh: 'ময়মনসিংহ',
  jamalpur: 'জামালপুর',
  sherpur: 'শেরপুর',
  netrokona: 'নেত্রকোনা',

  sylhet: 'সিলেট',
  moulvibazar: 'মৌলভীবাজার',
  maulvibazar: 'মৌলভীবাজার',
  habiganj: 'হবিগঞ্জ',
  sunamganj: 'সুনামগঞ্জ',

  rajshahi: 'রাজশাহী',
  naogaon: 'নওগাঁ',
  natore: 'নাটোর',
  pabna: 'পাবনা',
  sirajganj: 'সিরাজগঞ্জ',
  bogura: 'বগুড়া',
  bogra: 'বগুড়া',
  joypurhat: 'জয়পুরহাট',
  chapainawabganj: 'চাঁপাইনবাবগঞ্জ',
  'chapai nawabganj': 'চাঁপাইনবাবগঞ্জ',

  rangpur: 'রংপুর',
  dinajpur: 'দিনাজপুর',
  thakurgaon: 'ঠাকুরগাঁও',
  panchagarh: 'পঞ্চগড়',
  nilphamari: 'নীলফামারী',
  lalmonirhat: 'লালমনিরহাট',
  gaibandha: 'গাইবান্ধা',
  kurigram: 'কুড়িগ্রাম',

  khulna: 'খুলনা',
  jashore: 'যশোর',
  jessore: 'যশোর',
  satkhira: 'সাতক্ষীরা',
  narail: 'নড়াইল',
  magura: 'মাগুরা',
  jhenaidah: 'ঝিনাইদহ',
  kushtia: 'কুষ্টিয়া',
  chuadanga: 'চুয়াডাঙ্গা',
  meherpur: 'মেহেরপুর',
  bagerhat: 'বাগেরহাট',

  barishal: 'বরিশাল',
  barisal: 'বরিশাল',
  bhola: 'ভোলা',
  pirojpur: 'পিরোজপুর',
  jhalokati: 'ঝালকাঠি',
  patuakhali: 'পটুয়াখালী',
  barguna: 'বরগুনা',

  singapore: 'সিঙ্গাপুর',
  malaysia: 'মালয়েশিয়া',
  'kuala lumpur': 'কুয়ালালামপুর',
  'petaling jaya': 'পেটালিং জায়া',
  puchong: 'পুচং',
  putrajaya: 'পুত্রাজায়া',
  'shah alam': 'শাহ আলম',
  subang: 'সুবাং',
  'subang jaya': 'সুবাং জায়া',
  klang: 'ক্লাং',
  cyberjaya: 'সাইবারজায়া',
  selangor: 'সেলাঙ্গর',
  penang: 'পেনাং',
  johor: 'জোহর',
  india: 'ভারত',
  kolkata: 'কলকাতা',
  delhi: 'দিল্লি',
  pakistan: 'পাকিস্তান',
  nepal: 'নেপাল',
  bhutan: 'ভুটান',
  sri: 'শ্রী',
  lanka: 'লঙ্কা',
  thailand: 'থাইল্যান্ড',
  indonesia: 'ইন্দোনেশিয়া',
  jakarta: 'জাকার্তা',
};

export const localizeLocationLabel = (label, locale = 'en') => {
  if (!label || locale !== 'bn') return label;

  return label
    .split(',')
    .map((part) => {
      const text = part.trim();
      const key = text.toLowerCase();
      return BN_LOCATION_MAP[key] || text;
    })
    .join(', ');
};
