import District from '../models/location.model.js';
import CropType from '../models/cropType.model.js';
import LivestockBreed from '../models/livestockBreed.model.js';

// ==========================================
// Uganda districts seed data – 55 districts
// ==========================================
const DISTRICTS_DATA = [
  // ============ CENTRAL REGION ============
  {
    name: 'Kampala',
    region: 'Central',
    code: 'KLA',
    subcounties: [
      { name: 'Central Division', parishes: ['Nakasero', 'Kololo', 'Kampala Central', 'Old Kampala', 'Kisenyi'] },
      { name: 'Kawempe Division', parishes: ['Kawempe', 'Kazo', 'Makerere', 'Mulago', 'Wandegeya', 'Bwaise'] },
      { name: 'Makindye Division', parishes: ['Makindye', 'Kibuye', 'Nsambya', 'Katwe', 'Lukuli', 'Ggaba'] },
      { name: 'Nakawa Division', parishes: ['Nakawa', 'Ntinda', 'Naguru', 'Bukoto', 'Kiswa', 'Mbuya'] },
      { name: 'Rubaga Division', parishes: ['Rubaga', 'Namirembe', 'Lungujja', 'Ndeeba', 'Mutundwe', 'Busega'] }
    ]
  },
  {
    name: 'Wakiso',
    region: 'Central',
    code: 'WAK',
    subcounties: [
      { name: 'Kira', parishes: ['Kira', 'Kimwaanyi', 'Kasokoso', 'Bweyogerere', 'Kireka', 'Namugongo'] },
      { name: 'Entebbe Municipality', parishes: ['Entebbe', 'Katabi', 'Nakiwogo', 'Kiwafu', 'Lunyo'] },
      { name: 'Nangabo', parishes: ['Nangabo', 'Busukuma', 'Kiteezi', 'Gayaza', 'Gitta'] },
      { name: 'Kakiri', parishes: ['Kakiri', 'Gombe', 'Masulita', 'Katende'] },
      { name: 'Ssabagabo', parishes: ['Ssabagabo', 'Kajjansi', 'Kisugu', 'Bwebajja'] },
      { name: 'Nsangi', parishes: ['Nsangi', 'Maya', 'Namulanda', 'Buloba'] },
      { name: 'Wakiso Town Council', parishes: ['Wakiso', 'Maganjo', 'Kakungulu'] }
    ]
  },
  {
    name: 'Mukono',
    region: 'Central',
    code: 'MUK',
    subcounties: [
      { name: 'Mukono Municipality', parishes: ['Mukono Central', 'Namilyango', 'Wantoni', 'Goma'] },
      { name: 'Goma', parishes: ['Goma', 'Seeta', 'Namanve', 'Kyetume'] },
      { name: 'Ntenjeru', parishes: ['Ntenjeru', 'Kimenyedde', 'Kyampisi'] },
      { name: 'Nama', parishes: ['Nama', 'Nabbale', 'Kasawo'] },
      { name: 'Nakisunga', parishes: ['Nakisunga', 'Ntunda', 'Mpatta'] }
    ]
  },
  {
    name: 'Masaka',
    region: 'Central',
    code: 'MSK',
    subcounties: [
      { name: 'Masaka Municipality', parishes: ['Masaka Central', 'Katwe', 'Nyendo', 'Kimaanya'] },
      { name: 'Kyesiiga', parishes: ['Kyesiiga', 'Kyanamukaka'] },
      { name: 'Mukungwe', parishes: ['Mukungwe', 'Buwunga'] },
      { name: 'Kabonera', parishes: ['Kabonera', 'Kisekka'] }
    ]
  },
  {
    name: 'Lwengo',
    region: 'Central',
    code: 'LWE',
    subcounties: [
      { name: 'Kyazanga', parishes: ['Kyazanga', 'Lwengo', 'Kkingo', 'Ndagwe'] },
      { name: 'Ndagwe', parishes: ['Ndagwe', 'Kalamba', 'Kisoga'] },
      { name: 'Malongo', parishes: ['Malongo', 'Lwankoni'] }
    ]
  },
  {
    name: 'Mpigi',
    region: 'Central',
    code: 'MPI',
    subcounties: [
      { name: 'Mpigi Town Council', parishes: ['Mpigi', 'Bujuuko', 'Nkozi'] },
      { name: 'Muduma', parishes: ['Muduma', 'Kammengo', 'Kituntu'] },
      { name: 'Buwama', parishes: ['Buwama', 'Kamengo'] },
      { name: 'Muduuma', parishes: ['Muduuma', 'Kiringente'] }
    ]
  },
  {
    name: 'Kayunga',
    region: 'Central',
    code: 'KAY',
    subcounties: [
      { name: 'Kayunga Town Council', parishes: ['Kayunga', 'Busana', 'Kangulumira'] },
      { name: 'Nazigo', parishes: ['Nazigo', 'Galiraaya', 'Bbaale'] },
      { name: 'Busana', parishes: ['Busana', 'Nawangoma'] }
    ]
  },
  {
    name: 'Luwero',
    region: 'Central',
    code: 'LUW',
    subcounties: [
      { name: 'Luwero Town Council', parishes: ['Luwero', 'Kasana', 'Katikamu'] },
      { name: 'Wobulenzi', parishes: ['Wobulenzi', 'Bamunanika', 'Zirobwe'] },
      { name: 'Bombo', parishes: ['Bombo', 'Nyimbwa'] },
      { name: 'Kamira', parishes: ['Kamira', 'Makulubita'] }
    ]
  },
  {
    name: 'Mityana',
    region: 'Central',
    code: 'MIT',
    subcounties: [
      { name: 'Mityana Municipality', parishes: ['Mityana Central', 'Ttamu', 'Busimbi'] },
      { name: 'Busujju', parishes: ['Busujju', 'Kalangaalo'] },
      { name: 'Sekanyonyi', parishes: ['Sekanyonyi', 'Maanyi'] }
    ]
  },
  {
    name: 'Buikwe',
    region: 'Central',
    code: 'BUI',
    subcounties: [
      { name: 'Lugazi Municipality', parishes: ['Lugazi', 'Njeru', 'Buikwe'] },
      { name: 'Nyenga', parishes: ['Nyenga', 'Nkokonjeru'] },
      { name: 'Ssi-Bukunja', parishes: ['Ssi', 'Bukunja'] }
    ]
  },
  {
    name: 'Rakai',
    region: 'Central',
    code: 'RAK',
    subcounties: [
      { name: 'Rakai Town Council', parishes: ['Rakai', 'Kyotera', 'Kalisizo'] },
      { name: 'Kooki', parishes: ['Kooki', 'Lwanda', 'Kabira'] },
      { name: 'Kyotera', parishes: ['Kyotera', 'Kasasa'] }
    ]
  },
  {
    name: 'Sembabule',
    region: 'Central',
    code: 'SEM',
    subcounties: [
      { name: 'Sembabule Town Council', parishes: ['Sembabule', 'Lugusulu'] },
      { name: 'Mateete', parishes: ['Mateete', 'Ntuusi'] },
      { name: 'Mijwala', parishes: ['Mijwala', 'Lwemiyaga'] }
    ]
  },

  // ============ EASTERN REGION ============
  {
    name: 'Jinja',
    region: 'Eastern',
    code: 'JIN',
    subcounties: [
      { name: 'Jinja Municipality', parishes: ['Jinja Central', 'Walukuba', 'Mpumudde', 'Masese'] },
      { name: 'Butembe', parishes: ['Butembe', 'Kakira', 'Busede'] },
      { name: 'Budondo', parishes: ['Budondo', 'Buwenge'] },
      { name: 'Mafubira', parishes: ['Mafubira', 'Bugembe'] }
    ]
  },
  {
    name: 'Mbale',
    region: 'Eastern',
    code: 'MBL',
    subcounties: [
      { name: 'Mbale Municipality', parishes: ['Mbale Central', 'Industrial Area', 'Namabasa', 'Wanale'] },
      { name: 'Bungokho', parishes: ['Bungokho', 'Busiu', 'Namanyonyi'] },
      { name: 'Nakaloke', parishes: ['Nakaloke', 'Bukhaweka'] }
    ]
  },
  {
    name: 'Iganga',
    region: 'Eastern',
    code: 'IGA',
    subcounties: [
      { name: 'Iganga Municipality', parishes: ['Iganga Central', 'Nakavule'] },
      { name: 'Busembatya', parishes: ['Busembatya', 'Nawandala'] },
      { name: 'Nakalama', parishes: ['Nakalama', 'Bulamogi'] },
      { name: 'Namungalwe', parishes: ['Namungalwe', 'Ivukula'] }
    ]
  },
  {
    name: 'Tororo',
    region: 'Eastern',
    code: 'TOR',
    subcounties: [
      { name: 'Tororo Municipality', parishes: ['Tororo Central', 'Nagongera', 'Paya'] },
      { name: 'Kisoko', parishes: ['Kisoko', 'Mulanda'] },
      { name: 'Rubongi', parishes: ['Rubongi', 'Malaba'] },
      { name: 'Nagongera', parishes: ['Nagongera', 'Molo'] }
    ]
  },
  {
    name: 'Busia',
    region: 'Eastern',
    code: 'BUS',
    subcounties: [
      { name: 'Busia Municipality', parishes: ['Busia Central', 'Majanji', 'Sofia'] },
      { name: 'Masafu', parishes: ['Masafu', 'Buteba'] },
      { name: 'Dabani', parishes: ['Dabani', 'Lumino'] }
    ]
  },
  {
    name: 'Kamuli',
    region: 'Eastern',
    code: 'KAM',
    subcounties: [
      { name: 'Kamuli Municipality', parishes: ['Kamuli Central', 'Bugulumbya'] },
      { name: 'Nawanyago', parishes: ['Nawanyago', 'Namwendwa'] },
      { name: 'Balawoli', parishes: ['Balawoli', 'Buyende'] },
      { name: 'Wankole', parishes: ['Wankole', 'Kitayunjwa'] }
    ]
  },
  {
    name: 'Soroti',
    region: 'Eastern',
    code: 'SOR',
    subcounties: [
      { name: 'Soroti Municipality', parishes: ['Soroti Central', 'Opiyai', 'Aloet'] },
      { name: 'Arapai', parishes: ['Arapai', 'Kamuda'] },
      { name: 'Gweri', parishes: ['Gweri', 'Katine'] },
      { name: 'Serere', parishes: ['Serere', 'Kadungulu'] }
    ]
  },
  {
    name: 'Kumi',
    region: 'Eastern',
    code: 'KUM',
    subcounties: [
      { name: 'Kumi Municipality', parishes: ['Kumi Central', 'Nyero'] },
      { name: 'Ngora', parishes: ['Ngora', 'Mukura'] },
      { name: 'Ongino', parishes: ['Ongino', 'Kolir'] }
    ]
  },
  {
    name: 'Pallisa',
    region: 'Eastern',
    code: 'PAL',
    subcounties: [
      { name: 'Pallisa Town Council', parishes: ['Pallisa', 'Butebo'] },
      { name: 'Kibuku', parishes: ['Kibuku', 'Kadama'] },
      { name: 'Gogonyo', parishes: ['Gogonyo', 'Kasodo'] }
    ]
  },
  {
    name: 'Bugiri',
    region: 'Eastern',
    code: 'BGI',
    subcounties: [
      { name: 'Bugiri Municipality', parishes: ['Bugiri Central', 'Nankoma'] },
      { name: 'Buwunga', parishes: ['Buwunga', 'Kapyanga'] },
      { name: 'Bulidha', parishes: ['Bulidha', 'Nabukalu'] }
    ]
  },
  {
    name: 'Sironko',
    region: 'Eastern',
    code: 'SIR',
    subcounties: [
      { name: 'Sironko Town Council', parishes: ['Sironko', 'Budadiri'] },
      { name: 'Budadiri', parishes: ['Budadiri', 'Bumasifwa'] },
      { name: 'Buwalasi', parishes: ['Buwalasi', 'Buteza'] }
    ]
  },
  {
    name: 'Kapchorwa',
    region: 'Eastern',
    code: 'KPC',
    subcounties: [
      { name: 'Kapchorwa Municipality', parishes: ['Kapchorwa Central', 'Tegeres'] },
      { name: 'Sipi', parishes: ['Sipi', 'Kween'] },
      { name: 'Bukwo', parishes: ['Bukwo', 'Suam'] }
    ]
  },

  // ============ WESTERN REGION ============
  {
    name: 'Mbarara',
    region: 'Western',
    code: 'MBA',
    subcounties: [
      { name: 'Mbarara Municipality', parishes: ['Mbarara Central', 'Kamukuzi', 'Kakoba', 'Nyamitanga'] },
      { name: 'Rubaya', parishes: ['Rubaya', 'Kashare', 'Rwanyamahembe'] },
      { name: 'Bukiro', parishes: ['Bukiro', 'Rubindi'] },
      { name: 'Biharwe', parishes: ['Biharwe', 'Ruharo'] }
    ]
  },
  {
    name: 'Kabale',
    region: 'Western',
    code: 'KBA',
    subcounties: [
      { name: 'Kabale Municipality', parishes: ['Kabale Central', 'Rushoroza', 'Kigongi'] },
      { name: 'Ndorwa', parishes: ['Ndorwa', 'Hamurwa', 'Rubanda'] },
      { name: 'Kaharo', parishes: ['Kaharo', 'Kitumba'] },
      { name: 'Maziba', parishes: ['Maziba', 'Ikumba'] }
    ]
  },
  {
    name: 'Fort Portal',
    region: 'Western',
    code: 'FPT',
    subcounties: [
      { name: 'Fort Portal Municipality', parishes: ['Fort Portal Central', 'Kabarole', 'Rwengaju'] },
      { name: 'Burahya', parishes: ['Burahya', 'Kijura', 'Bukuku'] },
      { name: 'Busoro', parishes: ['Busoro', 'Buheesi'] },
      { name: 'Kibiito', parishes: ['Kibiito', 'Rubona'] }
    ]
  },
  {
    name: 'Kasese',
    region: 'Western',
    code: 'KAS',
    subcounties: [
      { name: 'Kasese Municipality', parishes: ['Kasese Central', 'Nyamwamba', 'Rukoki'] },
      { name: 'Bukonzo', parishes: ['Bukonzo', 'Maliba', 'Kilembe'] },
      { name: 'Hima', parishes: ['Hima', 'Katwe'] },
      { name: 'Muhokya', parishes: ['Muhokya', 'Karambi'] }
    ]
  },
  {
    name: 'Bushenyi',
    region: 'Western',
    code: 'BSH',
    subcounties: [
      { name: 'Bushenyi-Ishaka Municipality', parishes: ['Bushenyi Central', 'Ishaka', 'Nyakabirizi'] },
      { name: 'Kakanju', parishes: ['Kakanju', 'Kyeizooba'] },
      { name: 'Rubirizi', parishes: ['Rubirizi', 'Bunyaruguru'] }
    ]
  },
  {
    name: 'Ntungamo',
    region: 'Western',
    code: 'NTU',
    subcounties: [
      { name: 'Ntungamo Municipality', parishes: ['Ntungamo Central', 'Kyamate'] },
      { name: 'Ruhaama', parishes: ['Ruhaama', 'Rukoni'] },
      { name: 'Kajara', parishes: ['Kajara', 'Ruhija'] },
      { name: 'Isingiro', parishes: ['Isingiro', 'Rugaaga'] }
    ]
  },
  {
    name: 'Hoima',
    region: 'Western',
    code: 'HOI',
    subcounties: [
      { name: 'Hoima Municipality', parishes: ['Hoima Central', 'Mparo', 'Bujumbura'] },
      { name: 'Buseruka', parishes: ['Buseruka', 'Kigorobya'] },
      { name: 'Kitoba', parishes: ['Kitoba', 'Bugahya'] },
      { name: 'Kabwoya', parishes: ['Kabwoya', 'Kyangwali'] }
    ]
  },
  {
    name: 'Masindi',
    region: 'Western',
    code: 'MAS',
    subcounties: [
      { name: 'Masindi Municipality', parishes: ['Masindi Central', 'Kijungunta'] },
      { name: 'Budongo', parishes: ['Budongo', 'Biiso'] },
      { name: 'Pakanyi', parishes: ['Pakanyi', 'Bwijanga'] },
      { name: 'Miirya', parishes: ['Miirya', 'Kimengo'] }
    ]
  },
  {
    name: 'Kibale',
    region: 'Western',
    code: 'KBL',
    subcounties: [
      { name: 'Kibale Town Council', parishes: ['Kibale', 'Kagadi'] },
      { name: 'Kagadi', parishes: ['Kagadi', 'Muhorro'] },
      { name: 'Ndaiga', parishes: ['Ndaiga', 'Mabaale'] }
    ]
  },
  {
    name: 'Rukungiri',
    region: 'Western',
    code: 'RUK',
    subcounties: [
      { name: 'Rukungiri Municipality', parishes: ['Rukungiri Central', 'Nyarushanje'] },
      { name: 'Rubabo', parishes: ['Rubabo', 'Kebisoni'] },
      { name: 'Buyanja', parishes: ['Buyanja', 'Nyakagyeme'] }
    ]
  },
  {
    name: 'Kanungu',
    region: 'Western',
    code: 'KAN',
    subcounties: [
      { name: 'Kanungu Town Council', parishes: ['Kanungu', 'Kambuga'] },
      { name: 'Kinkizi', parishes: ['Kinkizi', 'Kayonza'] },
      { name: 'Bwindi', parishes: ['Bwindi', 'Mpungu'] }
    ]
  },
  {
    name: 'Kisoro',
    region: 'Western',
    code: 'KIS',
    subcounties: [
      { name: 'Kisoro Municipality', parishes: ['Kisoro Central', 'Nyakabande'] },
      { name: 'Bufumbira', parishes: ['Nyundo', 'Muramba', 'Cyanika'] },
      { name: 'Nyarusiza', parishes: ['Nyarusiza', 'Nkanka'] }
    ]
  },
  {
    name: 'Ibanda',
    region: 'Western',
    code: 'IBA',
    subcounties: [
      { name: 'Ibanda Municipality', parishes: ['Ibanda Central', 'Kagongo'] },
      { name: 'Ishongororo', parishes: ['Ishongororo', 'Kikyenkye'] },
      { name: 'Nyamarebe', parishes: ['Nyamarebe', 'Rukiri'] }
    ]
  },
  {
    name: 'Kamwenge',
    region: 'Western',
    code: 'KMW',
    subcounties: [
      { name: 'Kamwenge Town Council', parishes: ['Kamwenge', 'Mahyoro'] },
      { name: 'Kibale', parishes: ['Kibale', 'Ntara'] },
      { name: 'Kahunge', parishes: ['Kahunge', 'Biguli'] }
    ]
  },
  {
    name: 'Kyenjojo',
    region: 'Western',
    code: 'KYE',
    subcounties: [
      { name: 'Kyenjojo Town Council', parishes: ['Kyenjojo', 'Katooke'] },
      { name: 'Kyarusozi', parishes: ['Kyarusozi', 'Butunduzi'] },
      { name: 'Kihuura', parishes: ['Kihuura', 'Hapuuyo'] }
    ]
  },
  {
    name: 'Bundibugyo',
    region: 'Western',
    code: 'BUN',
    subcounties: [
      { name: 'Bundibugyo Town Council', parishes: ['Bundibugyo', 'Nyahuka'] },
      { name: 'Busaru', parishes: ['Busaru', 'Kirumya'] },
      { name: 'Harugali', parishes: ['Harugali', 'Mirambi'] }
    ]
  },

  // ============ NORTHERN REGION ============
  {
    name: 'Gulu',
    region: 'Northern',
    code: 'GUL',
    subcounties: [
      { name: 'Gulu Municipality', parishes: ['Gulu Central', 'Layibi', 'Bardege', 'Laroo', 'Pecetokwero'] },
      { name: 'Bungatira', parishes: ['Bungatira', 'Unyama', 'Lalogi'] },
      { name: 'Awach', parishes: ['Awach', 'Paicho'] },
      { name: 'Patiko', parishes: ['Patiko', 'Lakwana'] }
    ]
  },
  {
    name: 'Lira',
    region: 'Northern',
    code: 'LIR',
    subcounties: [
      { name: 'Lira Municipality', parishes: ['Lira Central', 'Adyel', 'Ojwina', 'Railway'] },
      { name: 'Aromo', parishes: ['Aromo', 'Agweng'] },
      { name: 'Barr', parishes: ['Barr', 'Agali'] },
      { name: 'Ogur', parishes: ['Ogur', 'Amach'] }
    ]
  },
  {
    name: 'Arua',
    region: 'Northern',
    code: 'ARU',
    subcounties: [
      { name: 'Arua Municipality', parishes: ['Arua Central', 'Oli', 'Adumi'] },
      { name: 'Ayivu', parishes: ['Ayivu', 'Manibe', 'Oluko'] },
      { name: 'Maracha', parishes: ['Maracha', 'Nyadri'] },
      { name: 'Terego', parishes: ['Terego', 'Omugo'] }
    ]
  },
  {
    name: 'Kitgum',
    region: 'Northern',
    code: 'KIT',
    subcounties: [
      { name: 'Kitgum Municipality', parishes: ['Kitgum Central', 'Pandwong'] },
      { name: 'Mucwini', parishes: ['Mucwini', 'Labongo Akwang'] },
      { name: 'Namokora', parishes: ['Namokora', 'Orom'] },
      { name: 'Lamwo', parishes: ['Lamwo', 'Padibe'] }
    ]
  },
  {
    name: 'Pader',
    region: 'Northern',
    code: 'PAD',
    subcounties: [
      { name: 'Pader Town Council', parishes: ['Pader', 'Atanga'] },
      { name: 'Acholi-Bur', parishes: ['Acholi-Bur', 'Awere'] },
      { name: 'Lapul', parishes: ['Lapul', 'Ogom'] }
    ]
  },
  {
    name: 'Apac',
    region: 'Northern',
    code: 'APC',
    subcounties: [
      { name: 'Apac Municipality', parishes: ['Apac Central', 'Akokoro'] },
      { name: 'Kwania', parishes: ['Kwania', 'Chegere'] },
      { name: 'Aduku', parishes: ['Aduku', 'Ibuje'] }
    ]
  },
  {
    name: 'Nebbi',
    region: 'Northern',
    code: 'NEB',
    subcounties: [
      { name: 'Nebbi Municipality', parishes: ['Nebbi Central', 'Nyaravur'] },
      { name: 'Pakwach', parishes: ['Pakwach', 'Panyimur'] },
      { name: 'Wadelai', parishes: ['Wadelai', 'Erussi'] }
    ]
  },
  {
    name: 'Moyo',
    region: 'Northern',
    code: 'MOY',
    subcounties: [
      { name: 'Moyo Town Council', parishes: ['Moyo', 'Dufile'] },
      { name: 'Obongi', parishes: ['Obongi', 'Itula'] },
      { name: 'Lefori', parishes: ['Lefori', 'Metu'] }
    ]
  },
  {
    name: 'Adjumani',
    region: 'Northern',
    code: 'ADJ',
    subcounties: [
      { name: 'Adjumani Town Council', parishes: ['Adjumani', 'Ciforo'] },
      { name: 'Pakele', parishes: ['Pakele', 'Ofua'] },
      { name: 'Dzaipi', parishes: ['Dzaipi', 'Adropi'] }
    ]
  },
  {
    name: 'Kotido',
    region: 'Northern',
    code: 'KOT',
    subcounties: [
      { name: 'Kotido Town Council', parishes: ['Kotido', 'Rengen'] },
      { name: 'Nakapelimoru', parishes: ['Nakapelimoru', 'Kacheri'] },
      { name: 'Panyangara', parishes: ['Panyangara', 'Kanawat'] }
    ]
  },
  {
    name: 'Moroto',
    region: 'Northern',
    code: 'MOR',
    subcounties: [
      { name: 'Moroto Municipality', parishes: ['Moroto Central', 'Nadunget'] },
      { name: 'Rupa', parishes: ['Rupa', 'Katikekile'] },
      { name: 'Tapac', parishes: ['Tapac', 'Lotome'] }
    ]
  },
  {
    name: 'Amuru',
    region: 'Northern',
    code: 'AMU',
    subcounties: [
      { name: 'Amuru Town Council', parishes: ['Amuru', 'Atiak'] },
      { name: 'Atiak', parishes: ['Atiak', 'Bibia'] },
      { name: 'Lamogi', parishes: ['Lamogi', 'Pabbo'] }
    ]
  },
  {
    name: 'Nwoya',
    region: 'Northern',
    code: 'NWO',
    subcounties: [
      { name: 'Anaka Town Council', parishes: ['Anaka', 'Koch-Goma'] },
      { name: 'Alero', parishes: ['Alero', 'Purongo'] },
      { name: 'Koch-Goma', parishes: ['Koch-Goma', 'Got-Apwoyo'] }
    ]
  },
  {
    name: 'Oyam',
    region: 'Northern',
    code: 'OYA',
    subcounties: [
      { name: 'Oyam Town Council', parishes: ['Oyam', 'Aber'] },
      { name: 'Minakulu', parishes: ['Minakulu', 'Acaba'] },
      { name: 'Ngai', parishes: ['Ngai', 'Iceme'] }
    ]
  },
  {
    name: 'Dokolo',
    region: 'Northern',
    code: 'DOK',
    subcounties: [
      { name: 'Dokolo Town Council', parishes: ['Dokolo', 'Bata'] },
      { name: 'Kangai', parishes: ['Kangai', 'Agwata'] },
      { name: 'Amolatar', parishes: ['Amolatar', 'Namasale'] }
    ]
  },
  {
    name: 'Kaabong',
    region: 'Northern',
    code: 'KAB',
    subcounties: [
      { name: 'Kaabong Town Council', parishes: ['Kaabong', 'Kapedo'] },
      { name: 'Sidok', parishes: ['Sidok', 'Kathile'] },
      { name: 'Dodoth', parishes: ['Lodiko', 'Kalapata'] }
    ]
  }
];

// Crop types seed data
const CROP_TYPES_DATA = [
  // Grains & Cereals
  {
    name: 'Maize',
    category: 'Grains & Cereals',
    commonVarieties: ['Longe 10H', 'Longe 5', 'NARO Hybrid 2', 'PAN 691', 'DK 8031'],
    seasonality: {
      firstSeason: [3, 4, 5],
      secondSeason: [9, 10, 11],
      yearRound: false
    },
    averageYield: { value: 2.5, unit: 'tonnes/acre' },
    description: 'Staple cereal crop widely grown across Uganda',
    icon: '🌽'
  },
  {
    name: 'Rice',
    category: 'Grains & Cereals',
    commonVarieties: ['NERICA 4', 'NERICA 1', 'WITA 9', 'K85'],
    seasonality: {
      firstSeason: [3, 4, 5, 6],
      secondSeason: [9, 10, 11],
      yearRound: false
    },
    averageYield: { value: 1.5, unit: 'tonnes/acre' },
    description: 'Paddy rice grown in wetlands and irrigated areas',
    icon: '🌾'
  },
  {
    name: 'Millet',
    category: 'Grains & Cereals',
    commonVarieties: ['Finger Millet', 'Pearl Millet', 'SEREMI 1', 'SEREMI 2'],
    seasonality: {
      firstSeason: [3, 4, 5],
      secondSeason: [9, 10],
      yearRound: false
    },
    description: 'Drought-resistant cereal crop',
    icon: '🌾'
  },

  // Legumes & Pulses
  {
    name: 'Beans',
    category: 'Legumes & Pulses',
    commonVarieties: ['NABE 15', 'NABE 16', 'K132', 'K131', 'Masindi Yellow'],
    seasonality: {
      firstSeason: [2, 3, 4],
      secondSeason: [8, 9, 10],
      yearRound: false
    },
    averageYield: { value: 0.8, unit: 'tonnes/acre' },
    description: 'Common beans - major protein source',
    icon: '🫘'
  },
  {
    name: 'Groundnuts',
    category: 'Legumes & Pulses',
    commonVarieties: ['Red Beauty', 'Serenut 1', 'Serenut 2', 'Serenut 3'],
    seasonality: {
      firstSeason: [3, 4, 5],
      secondSeason: [9, 10],
      yearRound: false
    },
    description: 'Peanuts for oil and consumption',
    icon: '🥜'
  },
  {
    name: 'Soybeans',
    category: 'Legumes & Pulses',
    commonVarieties: ['Maksoy 1N', 'Maksoy 2N', 'Maksoy 3N'],
    seasonality: {
      firstSeason: [3, 4, 5],
      secondSeason: [9, 10],
      yearRound: false
    },
    description: 'High-protein legume crop',
    icon: '🫛'
  },

  // Vegetables
  {
    name: 'Tomatoes',
    category: 'Vegetables',
    commonVarieties: ['MT56', 'Moneymaker', 'Roma VF', 'Marglobe'],
    seasonality: {
      firstSeason: [],
      secondSeason: [],
      yearRound: true
    },
    description: 'Fresh market and processing tomatoes',
    icon: '🍅'
  },
  {
    name: 'Cabbage',
    category: 'Vegetables',
    commonVarieties: ['Gloria', 'Copenhagen Market', 'Drumhead'],
    seasonality: {
      firstSeason: [],
      secondSeason: [],
      yearRound: true
    },
    description: 'Fresh vegetable for salads and cooking',
    icon: '🥬'
  },
  {
    name: 'Onions',
    category: 'Vegetables',
    commonVarieties: ['Red Creole', 'Bombay Red', 'Texas Grano'],
    seasonality: {
      firstSeason: [],
      secondSeason: [],
      yearRound: true
    },
    description: 'Bulb onions for cooking',
    icon: '🧅'
  },

  // Fruits
  {
    name: 'Bananas',
    category: 'Fruits',
    commonVarieties: ['Matooke', 'Bogoya', 'Sukali Ndiizi', 'Gonja'],
    seasonality: {
      firstSeason: [],
      secondSeason: [],
      yearRound: true
    },
    description: 'Cooking and dessert bananas',
    icon: '🍌'
  },
  {
    name: 'Pineapples',
    category: 'Fruits',
    commonVarieties: ['Smooth Cayenne', 'Queen Victoria'],
    seasonality: {
      firstSeason: [],
      secondSeason: [],
      yearRound: true
    },
    description: 'Fresh fruit and juice production',
    icon: '🍍'
  },
  {
    name: 'Mangoes',
    category: 'Fruits',
    commonVarieties: ['Apple Mango', 'Tommy Atkins', 'Kent', 'Ngowe'],
    seasonality: {
      firstSeason: [11, 12, 1, 2],
      secondSeason: [5, 6, 7],
      yearRound: false
    },
    description: 'Fresh fruit for local and export markets',
    icon: '🥭'
  },

  // Root Crops
  {
    name: 'Cassava',
    category: 'Root Crops',
    commonVarieties: ['NASE 14', 'NASE 19', 'TME 14', 'Magana'],
    seasonality: {
      firstSeason: [],
      secondSeason: [],
      yearRound: true
    },
    description: 'Starchy root crop for food and processing',
    icon: '🥔'
  },
  {
    name: 'Sweet Potatoes',
    category: 'Root Crops',
    commonVarieties: ['NASPOT 1', 'NASPOT 10', 'NASPOT 11', 'Ejumula'],
    seasonality: {
      firstSeason: [3, 4, 5],
      secondSeason: [9, 10],
      yearRound: false
    },
    description: 'Orange and white-fleshed varieties',
    icon: '🍠'
  },

  // Cash Crops
  {
    name: 'Coffee',
    category: 'Cash Crops',
    commonVarieties: ['Robusta', 'Arabica', 'Erecta'],
    seasonality: {
      firstSeason: [10, 11, 12, 1],
      secondSeason: [5, 6, 7],
      yearRound: false
    },
    description: 'Major export crop - Robusta and Arabica',
    icon: '☕'
  },
  {
    name: 'Tea',
    category: 'Cash Crops',
    commonVarieties: ['Clone 6/8', 'Clone 301', 'Clone 303'],
    seasonality: {
      firstSeason: [],
      secondSeason: [],
      yearRound: true
    },
    description: 'Export tea for processing',
    icon: '🍵'
  },
  {
    name: 'Cotton',
    category: 'Cash Crops',
    commonVarieties: ['BPA', 'Albar', 'NACO'],
    seasonality: {
      firstSeason: [3, 4, 5],
      secondSeason: [],
      yearRound: false
    },
    description: 'Fiber crop for textile industry',
    icon: '🌿'
  }
];

// Livestock breeds seed data
const LIVESTOCK_BREEDS_DATA = [
  // Cattle
  {
    name: 'Friesian',
    animalType: 'Cattle',
    purpose: ['Dairy'],
    characteristics: {
      averageWeight: { value: 600, unit: 'kg' },
      maturityAge: '2 years',
      productionRate: '20-30 litres/day'
    },
    description: 'High milk-producing dairy cattle',
    icon: '🐄'
  },
  {
    name: 'Ankole',
    animalType: 'Cattle',
    purpose: ['Meat', 'Dual Purpose'],
    characteristics: {
      averageWeight: { value: 400, unit: 'kg' },
      maturityAge: '3 years',
      productionRate: '5-10 litres/day'
    },
    description: 'Indigenous long-horned cattle',
    icon: '🐄'
  },
  {
    name: 'Jersey',
    animalType: 'Cattle',
    purpose: ['Dairy'],
    characteristics: {
      averageWeight: { value: 450, unit: 'kg' },
      maturityAge: '2 years',
      productionRate: '15-25 litres/day'
    },
    description: 'Dairy cattle with high butterfat content',
    icon: '🐄'
  },

  // Goats
  {
    name: 'Boer Goat',
    animalType: 'Goats',
    purpose: ['Meat'],
    characteristics: {
      averageWeight: { value: 80, unit: 'kg' },
      maturityAge: '6 months',
      productionRate: 'Fast growth rate'
    },
    description: 'Meat goat breed from South Africa',
    icon: '🐐'
  },
  {
    name: 'Toggenburg',
    animalType: 'Goats',
    purpose: ['Dairy'],
    characteristics: {
      averageWeight: { value: 60, unit: 'kg' },
      maturityAge: '8 months',
      productionRate: '3-5 litres/day'
    },
    description: 'Dairy goat breed',
    icon: '🐐'
  },
  {
    name: 'Mubende Goat',
    animalType: 'Goats',
    purpose: ['Meat', 'Dual Purpose'],
    characteristics: {
      averageWeight: { value: 30, unit: 'kg' },
      maturityAge: '6 months'
    },
    description: 'Indigenous Ugandan goat breed',
    icon: '🐐'
  },

  // Poultry
  {
    name: 'Kuroiler',
    animalType: 'Poultry',
    purpose: ['Meat', 'Layers'],
    characteristics: {
      averageWeight: { value: 3, unit: 'kg' },
      maturityAge: '5 months',
      productionRate: '150-200 eggs/year'
    },
    description: 'Dual-purpose chicken breed',
    icon: '🐔'
  },
  {
    name: 'Layers (ISA Brown)',
    animalType: 'Poultry',
    purpose: ['Layers'],
    characteristics: {
      averageWeight: { value: 2, unit: 'kg' },
      maturityAge: '4.5 months',
      productionRate: '300+ eggs/year'
    },
    description: 'High egg-producing chicken',
    icon: '🐔'
  },
  {
    name: 'Broilers (Cobb 500)',
    animalType: 'Poultry',
    purpose: ['Meat'],
    characteristics: {
      averageWeight: { value: 2.5, unit: 'kg' },
      maturityAge: '6 weeks',
      productionRate: 'Fast growth'
    },
    description: 'Meat chicken breed',
    icon: '🐔'
  },
  {
    name: 'Local Chicken',
    animalType: 'Poultry',
    purpose: ['Meat', 'Layers'],
    characteristics: {
      averageWeight: { value: 1.5, unit: 'kg' },
      maturityAge: '6 months',
      productionRate: '60-100 eggs/year'
    },
    description: 'Indigenous village chicken',
    icon: '🐔'
  },

  // Pigs
  {
    name: 'Large White',
    animalType: 'Pigs',
    purpose: ['Meat', 'Breeding'],
    characteristics: {
      averageWeight: { value: 250, unit: 'kg' },
      maturityAge: '6 months',
      productionRate: '10-12 piglets/litter'
    },
    description: 'Popular pig breed for pork production',
    icon: '🐷'
  },
  {
    name: 'Landrace',
    animalType: 'Pigs',
    purpose: ['Meat', 'Breeding'],
    characteristics: {
      averageWeight: { value: 280, unit: 'kg' },
      maturityAge: '6 months',
      productionRate: '11-13 piglets/litter'
    },
    description: 'Long-bodied pig breed',
    icon: '🐷'
  },

  // Fish
  {
    name: 'Tilapia',
    animalType: 'Fish',
    purpose: ['Meat'],
    characteristics: {
      averageWeight: { value: 0.5, unit: 'kg' },
      maturityAge: '6 months',
      productionRate: 'Fast growth in ponds'
    },
    description: 'Common fish for aquaculture',
    icon: '🐟'
  },
  {
    name: 'Catfish',
    animalType: 'Fish',
    purpose: ['Meat'],
    characteristics: {
      averageWeight: { value: 1, unit: 'kg' },
      maturityAge: '6 months',
      productionRate: 'Hardy and fast-growing'
    },
    description: 'African catfish for fish farming',
    icon: '🐟'
  }
];

// Seed function
export async function seedReferenceData() {
  try {
    console.log('🌱 Starting reference data seeding...');

    // Seed districts
    console.log('📍 Seeding districts...');
    await District.deleteMany({});
    const districts = await District.insertMany(DISTRICTS_DATA);
    console.log(`✅ Seeded ${districts.length} districts`);

    // Seed crop types
    console.log('🌾 Seeding crop types...');
    await CropType.deleteMany({});
    const cropTypes = await CropType.insertMany(CROP_TYPES_DATA);
    console.log(`✅ Seeded ${cropTypes.length} crop types`);

    // Seed livestock breeds
    console.log('🐄 Seeding livestock breeds...');
    await LivestockBreed.deleteMany({});
    const breeds = await LivestockBreed.insertMany(LIVESTOCK_BREEDS_DATA);
    console.log(`✅ Seeded ${breeds.length} livestock breeds`);

    console.log('🎉 Reference data seeding completed successfully!');

    return {
      districts: districts.length,
      cropTypes: cropTypes.length,
      breeds: breeds.length
    };
  } catch (error) {
    console.error('❌ Error seeding reference data:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  import('../index.js').then(() => {
    seedReferenceData()
      .then(() => {
        console.log('✅ Seeding complete');
        process.exit(0);
      })
      .catch((error) => {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
      });
  });
}
