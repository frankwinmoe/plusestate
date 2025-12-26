
-- DUMP DATA
TRUNCATE TABLE
 public.townships,
 public.regions,
 public.property_types,
 public.agencies,
 public.listing_favorites,
 public.listing_images,
 public.listing_messages,
 public.listing_reports,
 public.listing_views,
 public.listings
RESTART IDENTITY
CASCADE;

-- Test Data for Plus Estate Application

-- Agencies
INSERT INTO public.agencies (id, display_name, logo_url, phone, email, created_at) VALUES
('461220a1-58b3-4ff9-9bde-f377b4846110', 'Plus House Real Estate', null, '+959440611611', 'plus@plushouse.com', '2025-12-24 11:29:01+00'),
('e97db798-acee-41af-8a70-597d558e59b4', 'Myanmar Property Hub', null, '+959987654321', 'contact@mphub.com', '2025-12-24 11:29:01+00'),
('ffbf5c78-6e73-4334-aaf4-b7c7413da2e4', 'Golden Land Realty', null, '+959123456789', 'info@goldenland.com', '2025-12-24 11:29:01+00');


-- Property Types
INSERT INTO public.property_types (id, name_mm, name_en, sort_order) VALUES
('1', 'အမျိုးအစားအားလုံး', 'All Property Types', '1'),
('2', 'တိုက်ခန်း', 'Hotel / Restaurant', '2'),
('3', 'မီနီကွန်ဒို', 'Apartment', '3'),
('4', 'ကွန်ဒို', 'Mini Condo', '4'),
('5', 'လုံးချင်းအိမ်', 'Condominium', '5'),
('6', 'မြေကွက် ၊ ခြံကွက်', 'Detached House', '6'),
('7', 'ဆိုင်ခန်း ၊ ရုံးခန်း', 'Land / Plot', '7'),
('8', 'စက်မှု့ဇုန်', 'Shop / Office', '8'),
('9', 'ဟိုတယ် ၊ စားသောက်ဆိုင်', 'Industrial Zone', '9');

-- Regions
INSERT INTO public.regions (id, name_mm, name_en, sort_order) VALUES
('1', 'ရန်ကုန်တိုင်းဒေသကြီး', 'Yangon Region', '1'),
('2', 'မန္တလေးတိုင်းဒေသကြီး', 'Mandalay Region', '2'),
('3', 'ပဲခူးတိုင်းဒေသကြီး', 'Bago Region', '3'),
('4', 'ဧရာဝတီတိုင်းဒေသကြီး', 'Ayeyarwady Region', '4'),
('5', 'မကွေးတိုင်းဒေသကြီး', 'Magway Region', '5'),
('6', 'စစ်ကိုင်းတိုင်းဒေသကြီး', 'Sagaing Region', '6'),
('7', 'တနင်္သာရီတိုင်းဒေသကြီး', 'Taninthayi Region', '7'),
('8', 'ရှမ်းပြည်နယ်', 'Shan State', '8'),
('9', 'ကရင်ပြည်နယ်', 'Kayin State', '9'),
('10', 'မွန်ပြည်နယ်', 'Mon State', '10'),
('11', 'ရခိုင်ပြည်နယ်', 'Rakhine State', '11'),
('12', 'ချင်းပြည်နယ်', 'Chin State', '12'),
('13', 'ကချင်ပြည်နယ်', 'Kachin State', '13'),
('14', 'ကယားပြည်နယ်', 'Kayah State', '14'),
('15', 'နေပြည်တော်', 'Naypyidaw', '15');


-- Townships_of_Yangon Region
INSERT INTO public.townships (region_id, name_mm, name_en, sort_order) VALUES
(1, 'အလုံ', 'Ahlon', 1),
(1, 'ဗဟန်း', 'Bahan', 2),
(1, 'ဗိုလ်တထောင်', 'Botataung', 3),
(1, 'ဒဂုံဆိပ်ကမ်း', 'Dagon Seikkan', 4),
(1, 'ဒဂုံ', 'Dagon', 5),
(1, 'ဒလ', 'Dala', 6),
(1, 'ဒေါပုံ', 'Dawbon', 7),
(1, 'အရှေ့ဒဂုံ', 'East Dagon', 8),
(1, 'လှိုင်', 'Hlaing', 9),
(1, 'လှိုင်သာယာအရှေ့', 'Hlaingthaya East', 10),
(1, 'လှိုင်သာယာ', 'Hlaingthaya', 11),
(1, 'အင်းစိန်', 'Insein', 12),
(1, 'ကမာရွတ်', 'Kamayut', 13),
(1, 'ကျောက်တံတား', 'Kyauktada', 14),
(1, 'လမ်းမတော်', 'Lanmadaw', 15),
(1, 'လသာ', 'Latha', 16),
(1, 'မရမ်းကုန်း', 'Mayangon', 17),
(1, 'မင်္ဂလာတောင်ညွန့်', 'Mingala Taungnyunt', 18),
(1, 'မင်္ဂလာဒုံ', 'Mingaladon', 19),
(1, 'မြောက်ဒဂုံ', 'North Dagon', 20),
(1, 'မြောက်ဥက္ကလာပ', 'North Okkalapa', 21),
(1, 'ပုဗ္ဗတေဒန်', 'Pabedan', 22),
(1, 'ပဇွန်တောင်', 'Pazundaung ', 23),
(1, 'စမ်းချောင်း', 'Sanchaung', 24),
(1, 'ဆိပ်ကမ်း', 'Seikkan', 25),
(1, 'ဆိပ်ကြီးကနောင်တိုး', 'Seikkyi Kanaungto', 26),
(1, 'ရွှေပြည်သာ', 'Shwepyitha', 27),
(1, 'တောင်ဒဂုံ', 'South Dagon', 28),
(1, 'တောင်ဥက္ကလာပ', 'South Okkalapa', 29),
(1, 'တမ်းเว', 'Tamwe', 30),
(1, 'သကတေး', 'Thaketa', 31),
(1, 'သင်္ကန်းကျွန်း', 'Thingangyun', 32),
(1, 'ရန်ကင်း', 'Yankin', 33);

-- Townships_of_Mandalay_Region
INSERT INTO public.townships (region_id, name_mm, name_en, sort_order) VALUES
(2, 'အောင်မြေသာဇံ', 'Aungmyethazan Township', 1),
(2, 'ချမ်းအေးသာဇံ', 'Chanayethazan Township', 2),
(2, 'ချမ်းမြသာစည်', 'Chanmyathazi Township', 3),
(2, 'ကျောက်ပန်းတောင်း', 'Kyaukpadaung Township', 4),
(2, 'ကျောက်ဆည်', 'Kyaukse Township', 5),
(2, 'မဟာအောင်မြေ', 'Maha Aungmye Township', 6),
(2, 'မလှိုင်', 'Mahlaing Township', 7),
(2, 'မိတ္ထီလာ', 'Meiktila Township', 8),
(2, 'မိုးကုတ်', 'Mogok Township', 9),
(2, 'မြင်းခြံ', 'Myingyan Township', 10),
(2, 'မြစ်သား', 'Myittha Township', 11),
(2, 'နွားထိုးကြီး', 'Natogyi Township', 12),
(2, 'ငဇွန်', 'Ngazun Township', 13),
(2, 'ညောင်ဦး', 'Nyaung-U Township', 14),
(2, 'ပုသိမ်ကြီး', 'Patheingyi Township', 15),
(2, 'ပြည်ဘွယ်', 'Pyawbwe Township', 16),
(2, 'ပြည်ကြီးတံခွန်', 'Pyigyidagun Township', 17),
(2, 'စဉ့်ကူး', 'Singu Township', 18),
(2, 'စဉ့်ကိုင်', 'Sintgaing Township', 19),
(2, 'တံတားဦး', 'Tada-U Township', 20),
(2, 'တောင်သာ', 'Taungtha Township', 21),
(2, 'သပိတ်ကျင်း', 'Thabeikkyin Township', 22),
(2, 'သာစည်', 'Thazi Township', 23),
(2, 'ဝမ်းတွင်း', 'Wundwin Township', 24),
(2, 'ရမည်းသင်း', 'Yamethin Township', 25);

-- Townships_of_Bago_Region
INSERT INTO public.townships (region_id, name_mm, name_en, sort_order) VALUES
(3, 'ပဲခူး', 'Bago Township', 1),
(3, 'ဒိုက်ဦး', 'Daik-U Township', 2),
(3, 'ကြို့ပင်ကောက်', 'Gyobingauk Township', 3),
(3, 'ထန်းတပင်', 'Htantabin Township, Bago', 4),
(3, 'ကဝ', 'Kawa Township', 5),
(3, 'ကျောက်ကြီး', 'Kyaukkyi Township', 6),
(3, 'ကျောက်တံခါး', 'Kyauktaga Township', 7),
(3, 'လက်ပံတန်း', 'Letpadan Township', 8),
(3, 'မင်းလှ', 'Minhla Township, Bago', 9),
(3, 'မိုးညို', 'Monyo Township', 10),
(3, 'နတ်တလင်း', 'Nattalin Township', 11),
(3, 'ညောင်လေးပင်', 'Nyaunglebin Township', 12),
(3, 'အုတ်ဖို', 'Okpho Township', 13),
(3, 'အုတ်တွင်း', 'Oktwin Township', 14),
(3, 'ပန်တောင်း', 'Pandaung Township', 15),
(3, 'ပေါက်ခေါင်း', 'Paukkaung Township', 16),
(3, 'ပေါင်းတည်', 'Paungde Township', 17),
(3, 'ပြည်', 'Pyay Township', 18),
(3, 'ပျူ', 'Pyu Township', 19),
(3, 'ရွှေတောင်', 'Shwedaung Township', 20),
(3, 'ရွှေကျင်', 'Shwegyin Township', 21),
(3, 'တောင်ငူ', 'Taungoo Township', 22),
(3, 'သနပ်ပင်', 'Thanatpin Township', 23),
(3, 'သာယာဝတီ', 'Tharrawaddy Township', 24),
(3, 'သဲကုန်း', 'Thegon Township', 25),
(3, 'ဝေါ', 'Waw Township', 26),
(3, 'ရေဒဿ', 'Yedashe Township', 27),
(3, 'ဇီးကုန်း', 'Zigon Township', 28);

-- Townships_of_Ayeyarwady_Region
INSERT INTO public.townships (region_id, name_mm, name_en, sort_order) VALUES
(4, 'ဘိုကလေး', 'Bogale Township', 1),
(4, 'ဓနုဖြူ', 'Danubyu Township', 2),
(4, 'ဒေးဒရဲ', 'Dedaye Township', 3),
(4, 'အိမ်မဲ', 'Einme Township', 4),
(4, 'ဟင်္သာတ', 'Hinthada Township', 5),
(4, 'အင်္ဂပူ', 'Ingapu Township', 6),
(4, 'ကန်ကြီးတောင့်', 'Kangyidaunt Township', 7),
(4, 'ကျိုက်လတ်', 'Kyaiklat Township', 8),
(4, 'ကြံခင်း', 'Kyangin Township', 9),
(4, 'ကျောင်းကုန်း', 'Kyaunggon Township', 10),
(4, 'ကျုံပျော်', 'Kyonpyaw Township', 11),
(4, 'လပွတ္တာ', 'Labutta Township', 12),
(4, 'လေးမျက်နှာ', 'Lemyethna Township', 13),
(4, 'မအူပင်', 'Maubin Township', 14),
(4, 'မော်လမြိုင်ကျွန်း', 'Mawlamyinegyun Township', 15),
(4, 'မြန်အောင်', 'Myanaung Township', 16),
(4, 'မြောင်းမြ', 'Myaungmya Township', 17),
(4, 'ငပုတော', 'Ngapudaw Township', 18),
(4, 'ညောင်တုန်း', 'Nyaungdon Township', 19),
(4, 'ပန်းတနော်', 'Pantanaw Township', 20),
(4, 'ပုသိမ်', 'Pathein Township', 21),
(4, 'ဖျာပုံ', 'Pyapon Township', 22),
(4, 'သာပေါင်း', 'Thabaung Township', 23),
(4, 'ဝါးကမ', 'Wakema Township', 24),
(4, 'ရေကြည်', 'Yegyi Township', 25),
(4, 'ဇလွန်', 'Zalun Township', 26);

-- Townships_of_Magway_Region
INSERT INTO public.townships (region_id, name_mm, name_en, sort_order) VALUES
(5, 'အောင်လံ', 'Aunglan Township', 1),
(5, 'ချောက်', 'Chauk Township', 2),
(5, 'ဂန့်ဂေါ', 'Gangaw Township', 3),
(5, 'ထီးလင်း', 'Htilin Township', 4),
(5, 'ကမ္မ', 'Kamma Township', 5),
(5, 'မကွေး', 'Magway Township', 6),
(5, 'မင်းဘူး', 'Minbu Township', 7),
(5, 'မင်းဒုံ', 'Mindon Township', 8),
(5, 'မင်းလှ', 'Minhla Township, Magway', 9),
(5, 'မြိုင်', 'Myaing Township', 10),
(5, 'မြို့သစ်', 'Myothit Township', 11),
(5, 'နတ်မောက်', 'Natmauk Township', 12),
(5, 'ငဖဲ', 'Ngape Township', 13),
(5, 'ပခုက္ကူ', 'Pakokku Township', 14),
(5, 'ပေါက်', 'Pauk Township', 15),
(5, 'ပွင့်ဖြူ', 'Pwintbyu Township', 16),
(5, 'ဆလင်း', 'Salin Township', 17),
(5, 'စော', 'Saw Township', 18),
(5, 'ဆိပ်ဖြူ', 'Seikphyu Township', 19),
(5, 'စစ်ကိုင်းတယာ', 'Sidoktaya Township', 20),
(5, 'ဆင်ပေါင်ဝဲ', 'Sinbaungwe Township', 21),
(5, 'တောင်တွင်းကြီး', 'Taungdwingyi Township', 22),
(5, 'သရက်', 'Thayet Township', 23),
(5, 'ရေနံချောင်း', 'Yenangyaung Township', 24),
(5, 'ရေစကြို', 'Yesagyo Township', 25);

-- Townships_of_Sagaing_Region
INSERT INTO public.townships (region_id, name_mm, name_en, sort_order) VALUES
(6, 'အရာတော်', 'Ayadaw Township', 1),
(6, 'ဘန်းမောက်', 'Banmauk Township', 2),
(6, 'ဘုတလင်', 'Budalin Township', 3),
(6, 'ချောင်းဦး', 'Chaung-U Township', 4),
(6, 'ခန္တီး', 'Hkamti Township', 5),
(6, 'ဟုမ္မလင်း', 'Homalin District', 6),
(6, 'ထီးကြိုင်', 'Htigyaing Township', 7),
(6, 'အင်းတော်', 'Indaw Township', 8),
(6, 'ကလေး', 'Kale Township', 9),
(6, 'ကလေးဝ', 'Kalewa Township', 10),
(6, 'ကန့်ဘလူ', 'Kanbalu Township', 11),
(6, 'ကနီ', 'Kani Township', 12),
(6, 'ကသာ', 'Katha Township', 13),
(6, 'ကောလင်း', 'Kawlin Township', 14),
(6, 'ခင်ဦး', 'Khin-U Township', 15),
(6, 'ကျွန်းလှ', 'Kyunhla Township', 16),
(6, 'လဟယ်', 'Lahe Township', 17),
(6, 'လေရှီး', 'Leshi Township', 18),
(6, 'မော်လိုက်', 'Mawlaik Township', 19),
(6, 'မင်းကင်း', 'Mingin Township', 20),
(6, 'မုံရွာ', 'Monywa Township', 21),
(6, 'မြင်းမူ', 'Myinmu Township', 22),
(6, 'နန်းယွန်း', 'Nanyun Township', 23),
(6, 'ပလဲ', 'Pale Township', 24),
(6, 'ပေါင်းပြင်', 'Paungbyin Township', 25),
(6, 'ပင်လယ်ဘူး', 'Pinlebu Township', 26),
(6, 'စစ်ကိုင်း', 'Sagaing Township', 27),
(6, 'ဆားလင်းကြီး', 'Salingyi Township', 28),
(6, 'ရွှေဘို', 'Shwebo Township', 29),
(6, 'တဘိုင်ယင်', 'Tabayin Township', 30),
(6, 'တမူး', 'Tamu Township', 31),
(6, 'ဝက်လက်', 'Wetlet Township', 32),
(6, 'ဝန်းသို', 'Wuntho Township', 33),
(6, 'ရေဦး', 'Ye-U Township', 34),
(6, 'ယင်းမာပင်', 'Yinmabin Township', 35),
(6, 'ရွာဇင်', 'Ywa Zin', 36),
(6, 'ရွာဇင် (ခင်ဦး)', 'Ywa Zin, Khin-U', 37);

-- Townships_of_Taninthayi_Region
INSERT INTO public.townships (region_id, name_mm, name_en, sort_order) VALUES
(7, 'ဘုတ်ကပိုင်ခရိုင်', 'Bokepyin District', 1),
(7, 'ထားဝယ်', 'Dawei Township', 2),
(7, 'ကော့သောင်း', 'Kawthaung Township', 3),
(7, 'ကျွန်းစု', 'Kyunsu Township', 4),
(7, 'လောင်းလုံး', 'Launglon Township', 5),
(7, 'မြိတ်', 'Myeik Township', 6),
(7, 'ပုလော', 'Palaw Township', 7),
(7, 'တနင်္သာရီ', 'Tanintharyi Township', 8),
(7, 'သရက်ချောင်း', 'Thayetchaung Township', 9),
(7, 'ရေဖြူ', 'Yebyu Township', 10);

-- Townships_of_Shan_State
INSERT INTO public.townships (region_id, name_mm, name_en, sort_order) VALUES
(8, 'ဟဆီဆဲင်း', 'Hsi Hseng Township', 1),
(8, 'ကလော', 'Kalaw Township', 2),
(8, 'လင်းခေး', 'Langhko Township', 3),
(8, 'မောက်မယ်', 'Mawkmai Township', 4),
(8, 'မိုင်းတုံ', 'Mong Ton Township', 5),
(8, 'နမ့်ဆန်', 'Nansang Township', 6),
(8, 'ညောင်ရွှေ', 'Nyaungshwe Township', 7),
(8, 'တောင်ကြီး', 'Taunggyi Township', 8),
(8, 'ဟိုပန်', 'Hopang Township', 9),
(8, 'ဟိုပုံး', 'Hopong Township', 10),
(8, 'သိန္နီ', 'Hsenwi Township', 11),
(8, 'သီပေါ', 'Hsipaw Township', 12),
(8, 'ကျိုင်းတုံ', 'Kengtung Township', 13),
(8, 'ကိုန်းကြမ်း', 'Konkyan Township', 14),
(8, 'ကွမ်းဟင်း', 'Kunhing Township', 15),
(8, 'ကွမ်းလုံ', 'Kunlong Township', 16),
(8, 'ကွတ်ခိုင်', 'Kutkai District', 17),
(8, 'ကျောက်မဲ', 'Kyaukme Township', 18),
(8, 'ကျေးသီ', 'Kyethi Township', 19),
(8, 'လိုင်ခါ', 'Lai-Hka Township', 20),
(8, 'လားရှိုး', 'Lashio Township', 21),
(8, 'လောက်ကိုင်', 'Laukkaing Township', 22),
(8, 'လောက်ဆော့', 'Lawksawk Township', 23),
(8, 'လိုိုင်လင်', 'Loilem Township', 24),
(8, 'မဘိန်း', 'Mabein Township', 25),
(8, 'မန်တုံ', 'Mantong Township', 26),
(8, 'မိုင်းဖြတ်', 'Mong Hpyak Township', 27),
(8, 'မိုင်းဆတ်', 'Mong Hsat Township', 28),
(8, 'မိုင်းရှူး', 'Mong Hsu Township', 29),
(8, 'မိုင်းခက်', 'Mong Khet Township', 30),
(8, 'မိုင်းခုံ', 'Mong Kung Township', 31),
(8, 'မိုင်းနိုင်', 'Mong Nai Township', 32),
(8, 'မိုင်းပန်', 'Mong Pan Township', 33),
(8, 'မိုင်းပြင်', 'Mong Ping Township', 34),
(8, 'မိုင်းယန်းခရိုင်', 'Mong Yang District', 35),
(8, 'မိုင်းယောင်ခရိုင်', 'Mong Yawng District', 36),
(8, 'မိုင်းမော်', 'Mongmao Township', 37),
(8, 'မိုင်းမိတ်', 'Mongmit Township', 38),
(8, 'မိုင်းရယ်', 'Mongyai Township', 39),
(8, 'မူဆယ်', 'Mu Se Township', 40),
(8, 'နမ်ခမ်း', 'Namhkam Township', 41),
(8, 'နမ့်ဆန် (မြောက်)', 'Namhsan Township', 42),
(8, 'နမ့်တူ', 'Namtu Township', 43),
(8, 'နောင်ချို', 'Nawnghkio Township', 44),
(8, 'ပန်လုံ', 'Panglong, Southern Shan State', 45),
(8, 'ဖယ်ခုံ', 'Pekon Township', 46),
(8, 'ပင်းတယ', 'Pindaya Township', 47),
(8, 'ပင်လောင်း', 'Pinlaung Township', 48),
(8, 'တာချီလိတ်', 'Tachileik Township', 49),
(8, 'တန့်ယန်း', 'Tangyan Township', 50),
(8, 'ရပ်ဝန်း', 'Ywangan Township', 51);

-- Townships_of_Kayin_State
INSERT INTO public.townships (region_id, name_mm, name_en, sort_order) VALUES
(9, 'လှိုင်းဘွဲ့', 'Hlaingbwe Township', 1),
(9, 'ဘားအံ', 'Hpa-an Township', 2),
(9, 'ဖာပွန်', 'Hpapun Township', 3),
(9, 'ကော့ကရိတ်', 'Kawkareik Township', 4),
(9, 'ကြာအင်းဆိပ်ကြီး ခရိုင်', 'Kyain Seikgyi District', 5),
(9, 'မြဝတီ', 'Myawaddy Township', 6),
(9, 'သံတောင်ကြီး ခရိုင်', 'Thandaunggyi District', 7);

-- Townships_of_Mon_State
INSERT INTO public.townships (region_id, name_mm, name_en, sort_order) VALUES
(10, 'ဘီလင်း', 'Bilin Township', 1),
(10, 'ချောင်းဆုံ', 'Chaungzon Township', 2),
(10, 'ကျိုက်မရော', 'Kyaikmaraw Township', 3),
(10, 'ကျိုက်ထို', 'Kyaikto Township', 4),
(10, 'မော်လမြိုင်', 'Mawlamyine Township', 5),
(10, 'မုဒုံ', 'Mudon Township', 6),
(10, 'ပေါင်', 'Paung Township', 7),
(10, 'သံဖြူဇရပ်', 'Thanbyuzayat Township', 8),
(10, 'သထုံ', 'Thaton Township', 9),
(10, 'ရေး ခရိုင်', 'Ye District', 10);

-- Townships_of_Rakhine_State
INSERT INTO public.townships (region_id, name_mm, name_en, sort_order) VALUES
(11, 'အမ်း ခရိုင်', 'Ann District', 1),
(11, 'ဘူးသီးတောင်', 'Buthidaung Township', 2),
(11, 'ဂွ', 'Gwa Township', 3),
(11, 'ကျောက်ဖြူ', 'Kyaukphyu Township', 4),
(11, 'ကျောက်တော်', 'Kyauktaw Township', 5),
(11, 'မာနောင်', 'Manaung Township', 6),
(11, 'မောင်တော', 'Maungdaw Township', 7),
(11, 'မင်းပြား', 'Minbya Township', 8),
(11, 'မြောက်ဦး', 'Mrauk-U Township', 9),
(11, 'မြေပြန်', 'Myebon Township', 10),
(11, 'ပေါက်တော', 'Pauktaw Township', 11),
(11, 'ပုဏ္ဏားကျွန်း', 'Ponnagyun Township', 12),
(11, 'ရမ်းဗြဲ', 'Ramree Township', 13),
(11, 'ရသေ့တောင်', 'Rathedaung Township', 14),
(11, 'စစ်တွေ', 'Sittwe Township', 15),
(11, 'တောင်ကုတ်', 'Taungup Township', 16),
(11, 'သံတွဲ', 'Thandwe Township', 17);

-- Townships_of_Chin_State
INSERT INTO public.townships (region_id, name_mm, name_en, sort_order) VALUES
(12, 'ဖလမ်း', 'Falam Township', 1),
(12, 'ဟားခါး', 'Hakha Township', 2),
(12, 'ကန်ပက်လက်', 'Kanpetlet Township', 3),
(12, 'မတူပီ', 'Matupi Township', 4),
(12, 'မင်းတပ်', 'Mindat Township', 5),
(12, 'ပလက်ဝ ခရိုင်', 'Paletwa District', 6),
(12, 'တီးတိမ်', 'Tedim Township', 7),
(12, 'သန္တလန်', 'Thantlang Township', 8),
(12, 'တုံဇန်', 'Tonzang Township', 9);

-- Townships_of_Kachin_State
INSERT INTO public.townships (region_id, name_mm, name_en, sort_order) VALUES
(13, 'ဗန်းမော်', 'Bhamo Township', 1),
(13, 'ချစ်ပွီ', 'Chipwi Township', 2),
(13, 'ဖားကန့်', 'Hpakant Township', 3),
(13, 'ဆော့လော့', 'Hsawlaw Township', 4),
(13, 'အင်ဂျန်းယန်', 'Injangyang Township', 5),
(13, 'ခေါင်လန်ဖူး', 'Kawnglanghpu Township', 6),
(13, 'မချမ်းဘော', 'Machanbaw Township', 7),
(13, 'မန်စီ', 'Mansi Township', 8),
(13, 'မိုးကောင်း', 'Mogaung Township', 9),
(13, 'မိုးညှင်း', 'Mohnyin Township', 10),
(13, 'မိုးမောက်', 'Momauk Township', 11),
(13, 'မြစ်ကြီးနား', 'Myitkyina Township', 12),
(13, 'နောင်မွန်း', 'Nogmung Township', 13),
(13, 'ပူတာအို', 'Putao Township', 14),
(13, 'ဆဒုံး', 'Sadon', 15),
(13, 'ရွှေကူ', 'Shwegu Township', 16),
(13, 'စံပရဘွမ်', 'Sumprabum Township', 17),
(13, 'တနိုင်း ခရိုင်', 'Tanai District', 18),
(13, 'ဝိုင်းမော်', 'Waingmaw Township', 19);

-- Townships_of_Kayah_State
INSERT INTO public.townships (region_id, name_mm, name_en, sort_order) VALUES
(14, 'ဘော်လခဲ', 'Bawlakhe Township', 1),
(14, 'ဒီမောဆိုး', 'Demoso Township', 2),
(14, 'ဖားဆောင်း', 'Hpasawng Township', 3),
(14, 'ဖရူဆို', 'Hpruso Township', 4),
(14, 'လွိုင်ကော်', 'Loikaw Township', 5),
(14, 'မယ်ဆယ်', 'Mese Township', 6),
(14, 'ရှားတော', 'Shadaw Township', 7);

-- Townships_of_Naypyidaw_Union_Territory
INSERT INTO public.townships (region_id, name_mm, name_en, sort_order) VALUES
(15, 'ဥတ္တရ ခရိုင်', 'Ottara District', 1),
(15, 'ဥတ္တရသီရိ', 'Ottarathiri Township', 2),
(15, 'တပ်ကုန်း', 'Tatkone Township', 3),
(15, 'ဇေယျာ ခရိုင်', 'Zeyathiri District', 4),
(15, 'ဇေယျာသီရိ', 'Zeyathiri Township', 5),
(15, 'ပုဗ္ဗသီရိ', 'Pobbathiri Township', 6),
(15, 'ဒက္ခိဏ ခရိုင်', 'Dekkhina District (Lewe District)', 7),
(15, 'ဒက္ခိဏသီရိ', 'Dekkhinathiri Township', 8),
(15, 'လယ်ဝေး', 'Lewe Township', 9),
(15, 'ပျဉ်းမနား ခရိုင်', 'Pyinmana District', 10),
(15, 'ပျဉ်းမနား', 'Pyinmana Township', 11),
(15, 'ဇမ္ဗူသီရိ', 'Zabuthiri Township', 12);


-- Listings

INSERT INTO "public"."listings" ("id", "listing_code", "kind", "status", "is_featured", "title", "description", "region_id", "township_id", "property_type_id", "floor_label", "bedrooms", "bathrooms", "width_ft", "length_ft", "area_sqft", "area_label", "currency", "price_amount", "price_unit_label", "price_per_sqft", "address_text", "lat", "lng", "agency_id", "owner_user_id", "views_count", "published_at", "created_at", "updated_at") VALUES ('2760a91f-fd3c-4cc1-97e8-ad74699aca0d', 'LS-0001', 'sale', 'published', 'true', 'ရွှေပါရမီ ကွန်ဒို အရောင်း (Hlaing, Parami Road)', '''လှိုင် ပါရမီလမ်းမကြီးပေါ်ရှိ အဆင့်မြင့်ပြင်ဆင်ပြီး ရွှေပါရမီကွန်ဒို အရောင်း။

• High Floor (ထောင့်ခန်း)
• အကျယ် 1834 sqft
• 2 Master Bedroom + 1 Bedroom
• 4 Aircons
• Fully Furnished

Condo Facilities:
• Car Parking (သီးသန့်)
• Swimming Pool
• GYM
• 24 Hours Security
• Lift

စျေးနှုန်း >>> 9800 Lakhs (ညှိနှိုင်း)
အိမ်ရှင်နှင့် တိုက်ရိုက်တွေ့ဆုံပြီး ညှိနှိုင်းနိုင်ပါသည်

Contact:
Plus House Real Estate
📞 09 440 611 611
Viber: 09 440 611 611''', '1', '1', '4', 'High Floor (Corner Unit)', '3', '2', null, null, '1834', '', 'MMK', '9800.00', 'Lakhs', null, 'Parami Main Road, Hlaing Township, Yangon', null, null, '461220a1-58b3-4ff9-9bde-f377b4846110', null, '0', null, '2025-12-24 12:23:14.798116+00', '2025-12-24 12:23:14.798116+00'), ('54ac3bff-bd4a-4f49-b662-a636dffca656', 'LS-0002', 'sale', 'published', 'true', 'Golden Parami Condo အရောင်း (High Floor Corner Unit)', 'ပါရမီလမ်းမပေါ်ရှိ Golden Parami Condo ထောင့်ခန်း အလွှာမြင့် view ကောင်းသော အခန်း အရောင်း။

• 8th Floor (Corner Unit – အပေါ် Penthouse ၁ ထပ်ရှိ)
• အကျယ် 1834 sqft
• 2 Master Bedrooms + 2 Bedrooms
• 4 Aircons
• Solar Battery 3000W (Master Bedroom)
• Balcony 2 ခု

Interior Features:
• နံရံကပ် ဗီရိုကြီး 2 လုံး
• ဘုရားစင် / ဖိနပ်စင်
• Kitchen Cabinet
• Dry Kitchen Cabinet
• Bar Counter

View:
• Parami Road View
• Shwedagon Pagoda View

Condo Facilities:
• Swimming Pool
• Gym
• 24 Hours Security
• 24 Hours Lift
• Maintenance Fees – 100,000 MMK

စျေးနှုန်း >>> 8,800 Lakhs (ညှိနှိုင်း)
အိမ်ပိုင်ရှင်နှင့် တိုက်ရိုက်တွေ့ဆုံပြီး ညှိနှိုင်းနိုင်ပါသည်

Contact:
Plus House Real Estate
📞 09 440 611 611
Viber / WhatsApp: 09 440 611 611', '1', '1', '4', '8th Floor (High Floor, Corner Unit)', '4', '3', null, null, '1834', null, 'MMK', '8800.00', 'Lakhs', null, 'Parami Main Road, Hlaing Township, Yangon', null, null, null, null, '0', null, '2025-12-24 12:24:33.68285+00', '2025-12-24 12:24:33.68285+00');


-- Listing Images
INSERT INTO public.listing_images (id, listing_id, image_url, sort_order, created_at) VALUES
('311a3c88-0d23-4b00-9c83-298365247a66', '2760a91f-fd3c-4cc1-97e8-ad74699aca0d', 'https://scontent.fbkk13-1.fna.fbcdn.net/v/t39.30808-6/487074170_1058254962988775_6212884872744344628_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=aa7b47&_nc_eui2=AeF81XL_BytclLWVKBRshrEwAAHGFRLDtv0AAcYVEsO2_QauZ-Z7IjOXgLB025av83TtK6w-0X-nGF1_61yij9Wv&_nc_ohc=-6r8PlKUg0cQ7kNvwGlKZZL&_nc_oc=Adl7D2A3bncem853dWj2SmXF-iskOA8imSTC1EyirLyd9q1co4papi5t_ddjyHZ9mOzBnBr0AVtTV0Pp12q6kAio&_nc_zt=23&_nc_ht=scontent.fbkk13-1.fna&_nc_gid=P9itKhAQq1aaZ_lQOyFZeA&oh=00_AfkijiC_2GNql6PaQDuCHSI6bvOnI9MKiYlP2IRa73YFoA&oe=6951BB17', '4', '2025-12-24 11:31:24+00'),
('38a1c374-c34e-42cb-8216-a8aadaa4f961', '2760a91f-fd3c-4cc1-97e8-ad74699aca0d', 'https://scontent.fbkk8-2.fna.fbcdn.net/v/t39.30808-6/487141221_1058254926322112_1495749333062429984_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_eui2=AeEdNzmD9c4DpMtoY5yrKruj9ve9zPFjJ8r2973M8WMnyvtJWXyXmytjlvwX-DlttdS_tZmBDMfGSAVfD6BaKOLQ&_nc_ohc=2VgfJNP8RjIQ7kNvwFJIOZT&_nc_oc=Adl_NU7hMaszLASBx0nWPXElUZPC-TIgBtigFLkSnuiDh5I2_ekK6Px_zTriLCUaE6kl2D-re1gsWQ4HmNVyv9Vm&_nc_zt=23&_nc_ht=scontent.fbkk8-2.fna&_nc_gid=7BfdZQ3zka2I5H2THDO5-A&oh=00_AfkHPDmgClk8_buohkcZj5KWZJTNGD76E7VdW_d2-MdXKg&oe=69519AAA', '5', '2025-12-24 11:31:46+00'),
('48c8b516-08a7-4e35-a3f1-9832402bba3e', '54ac3bff-bd4a-4f49-b662-a636dffca656', 'https://scontent.fbkk12-5.fna.fbcdn.net/v/t39.30808-6/598801246_1273630458117890_7426914913913443185_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG0z7-FL13qOf0F0hSFc-91rApof1l-F2ysCmh_WX4XbMEyyg0_SGUFq08EDdkKInh2SgSlQnDSV8rx-Vl6jrma&_nc_ohc=yjpOInF6vpYQ7kNvwFDG8uE&_nc_oc=AdmTax_WM6fD8Wind2q02ZY7xcKNJSMpgqmIovWfao2cXg8vtqhCvGDDVJ1d87xwiGrG_8aBLsfSRiJHEJfJZcOp&_nc_zt=23&_nc_ht=scontent.fbkk12-5.fna&_nc_gid=ToV0MWFSlwEl52og1RVQ2w&oh=00_Aflecqak-ROv1V8whQ56JvkHsC9dakElqHdXNlv_yVH8lA&oe=6951A7A1', '6', '2025-12-24 11:39:05.009031+00'),
('514cc669-adb7-4935-a87c-c80dce817f8c', '2760a91f-fd3c-4cc1-97e8-ad74699aca0d', 'https://scontent.fbkk12-3.fna.fbcdn.net/v/t39.30808-6/486681197_1058254969655441_1190537731308163418_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=aa7b47&_nc_eui2=AeHt-mrBi7_Riwk_u2TkO7-u-aBM9h_A6jT5oEz2H8DqNLJ1jlJveh-R6baU7fm5OmwfmWjEeSm8wwFADkGbASBZ&_nc_ohc=_CsD1R9hq3gQ7kNvwFKFe2a&_nc_oc=Adnw2pNoToSJ1QUdFlKw0jN0O-fWrPHilEuzZkRrIFCFYus4F62X8F2GcxOkOMYWSlfXErobgOctpTQXUnNdXFME&_nc_zt=23&_nc_ht=scontent.fbkk12-3.fna&_nc_gid=5aWlJesgl5dycjjkK_H6cg&oh=00_AfmRHluc8sIHDbND-3NKAEOgAFM9d1WltPLWjrAT0gEsTA&oe=6951AFAF', '6', '2025-12-24 11:32:12+00'),
('5a07fbb8-947a-4ed7-aaf2-6ec89510fe8a', '54ac3bff-bd4a-4f49-b662-a636dffca656', 'https://scontent.fbkk9-2.fna.fbcdn.net/v/t39.30808-6/600516684_1273630428117893_621341942343354604_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHUyKKNyqr9tEFM39HCK2B3cTCHtOqc8NxxMIe06pzw3P9K27nnGVwgh1WXPK-P30soYmhsB_1WwJwYR8TrAyVh&_nc_ohc=iSn6Y_fCHOIQ7kNvwFGGlZJ&_nc_oc=Adn_yPoY-Nw01jBszgVL9VLIpad1eSqC45Mozgoydh8STt37mZVVdNYa-S5zLVeHW-2doFo8yskcVIWaU3U1jKFB&_nc_zt=23&_nc_ht=scontent.fbkk9-2.fna&_nc_gid=Ad908I4sHcHC62tkA6a91Q&oh=00_AfnngZd-VcQ3EQObgRFFUEeMkMzNTU5-sK9YWazOGn6elA&oe=69519CBD', '5', '2025-12-24 11:38:50.48244+00'),
('6734b17b-746e-4441-b8da-ac0414c8fc1d', '54ac3bff-bd4a-4f49-b662-a636dffca656', 'https://scontent.fbkk13-1.fna.fbcdn.net/v/t39.30808-6/600972089_1273630768117859_4014907780648335445_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFhtUZZOpu9le2BHeOWN4Tsq-vODZdA9-Or684Nl0D340awfnJhNcbJxyCOjuiGURdjC3pFkQurgI3vrX1vsOXm&_nc_ohc=AU0YIJ56G9cQ7kNvwGi03pg&_nc_oc=AdnrJsPN2b4kzEbk2JyX0G9_U4-LHkyYEiZr9D02nW4T_HgSz5lDZxPHo0yEu4R4xVQGhJFsAoZgTvW_bER1CmuD&_nc_zt=23&_nc_ht=scontent.fbkk13-1.fna&_nc_gid=58shWGH9kjdRfeONM4AFNg&oh=00_AflYAhYIRcAHZwoTQTRypU2V-LWCj6U6mEYvdEzNLAA1cw&oe=6951ADE7', '1', '2025-12-24 11:37:24.475942+00'),
('6c7a3b76-4f5a-4a3b-bd64-0e16d0698af8', '2760a91f-fd3c-4cc1-97e8-ad74699aca0d', 'https://scontent.fbkk8-2.fna.fbcdn.net/v/t39.30808-6/487046659_1058254852988786_1291881328203589_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_eui2=AeGLu_ztkd8zKb_v6yAZPK6VP7fdav9ki0k_t91q_2SLSQVp2-Jo1OsqPyGr_vQ5RJU__sVwO369iajymiztt4hg&_nc_ohc=JTrdjjtqVvQQ7kNvwHSreQU&_nc_oc=Adn1Fa5r9gHGyic73Ynb6fd98ATIQKeu3NkBbZRsmw9T50iNsUt6mRLeb3CFQPKsw58LbPKMwjiHyTvDjXD0ElrT&_nc_zt=23&_nc_ht=scontent.fbkk8-2.fna&_nc_gid=P4BasOd2VIPX8lp1Pkwevg&oh=00_Afk8wb8l2qlqZ8WmAtu1FsiwvJdE-wXMuBLeb9P9nqN01w&oe=6951A31F', '11', '2025-12-24 11:33:55.4021+00'),
('74337c10-7da8-4128-83fd-e668d5242482', '2760a91f-fd3c-4cc1-97e8-ad74699aca0d', 'https://scontent.fbkk8-4.fna.fbcdn.net/v/t39.30808-6/486901537_1058255002988771_698441423172287295_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=aa7b47&_nc_eui2=AeHgmacha1yVog0xCns1WuZwv32TLG8Uyma_fZMsbxTKZrv38uT7AcLlFvR_pr1Z3XRSHY9eOhKl7om3FFnSth11&_nc_ohc=Z9QevdDy7TIQ7kNvwFPztdh&_nc_oc=Adls0Xk_zhfyBmCfwWOw22bJHDZG8Fn7mE9qtjhFRG0bP5KXz-hDeknAe4lfC1ZKSE6bbyp_8mH534ETPnK1zsE1&_nc_zt=23&_nc_ht=scontent.fbkk8-4.fna&_nc_gid=VqkzDlugCruoVBp-57ShlQ&oh=00_AfkioG_jH9bo1F7uU75y5ZxBbiPj4GckiRK-Seexp326LQ&oe=69519CE6', '3', '2025-12-24 11:31:08+00'),
('894be9ed-657e-436a-ac76-685a0909971c', '2760a91f-fd3c-4cc1-97e8-ad74699aca0d', 'https://scontent.fbkk13-2.fna.fbcdn.net/v/t39.30808-6/487038009_1058254826322122_1119720690767986871_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=aa7b47&_nc_eui2=AeEMDL3C4qTAdr2upwTnCbyUiy6rOVASOeOLLqs5UBI5401PEv0QC0xF-rqnHpk8CBeaVvEQrSg6khN6kYDKEZCI&_nc_ohc=j9vHj8YWAjIQ7kNvwHpzs1a&_nc_oc=AdmOqN25mfwvxKneJQiVM_XCBhuccYWCkcd6dQLzeQDAjcqe8sLuMMxeXS3Vp24PFDDstL7IuiOjzGUfiKJ7x6mQ&_nc_zt=23&_nc_ht=scontent.fbkk13-2.fna&_nc_gid=pP_aCqYOyrzOkMv4n7OiuQ&oh=00_AflsugqIG3802P_MSvolCilQ3KdasU4ll0utpbKL2eYPdQ&oe=6951AF9D', '1', '2025-12-24 11:30:37+00'),
('89f839d6-bc65-462c-9ac0-65fe1d62c210', '54ac3bff-bd4a-4f49-b662-a636dffca656', 'https://scontent.fbkk12-4.fna.fbcdn.net/v/t39.30808-6/601349516_1273630781451191_1997906732179444879_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFn8FXKUmGTBq4rYhdn4Ey41HzggAQSUhbUfOCABBJSFiYsT0i8q583loltmfe_9FcLvZQdtr6CDY8yRxyVbk7V&_nc_ohc=0Q6uVOIjhUQQ7kNvwFQ3uCS&_nc_oc=AdnKeFAgJZMEseo6eST53BnD43Oh6lcsHJdMT9PjfiSpyupPlFGrToHv3yjTwf2_KHNKBcPx7-G1ynjbdr-mm4D1&_nc_zt=23&_nc_ht=scontent.fbkk12-4.fna&_nc_gid=dUMha3ch_h71P5xpM_chng&oh=00_Afnq-DsNz3JS_xXWzvsuMvbZBqsb10839aGeouNRYbEgfQ&oe=6951A111', '2', '2025-12-24 11:38:00.129024+00'),
('8fdf6c38-124e-49df-8b0f-0dde983df45d', '2760a91f-fd3c-4cc1-97e8-ad74699aca0d', 'https://scontent.fbkk8-2.fna.fbcdn.net/v/t39.30808-6/486761585_1058255072988764_5380403345362377172_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_eui2=AeEbrF4SI1FwkhYxnC7lEu1KgIJGD1UJJ86AgkYPVQknziPFfivmJ7YPoqZs7gDNIYaTcMHwO71ms3DpWIwqqrfl&_nc_ohc=t4l11ZypqDEQ7kNvwHr2GvU&_nc_oc=Adl33LaooT2D_14tARGnda1jUXKb-Abs-axS48VoimyJHuKxPsP3YPUcoSJC4k0HpbzV_ITNGq9dp2hGxxmTU6W_&_nc_zt=23&_nc_ht=scontent.fbkk8-2.fna&_nc_gid=sc8oMVK040OvD_p93-zl6g&oh=00_AfktOZ1rsE7UW9KiyRSHqXqq8rdfZwnkTAlLz5zfZgq5WA&oe=695187FC', '8', '2025-12-24 11:32:43+00'),
('98e240b0-ee5c-4cc5-a82b-2dbbd33e3445', '2760a91f-fd3c-4cc1-97e8-ad74699aca0d', 'https://scontent.fbkk12-4.fna.fbcdn.net/v/t39.30808-6/487092025_1058254966322108_1229517665892592318_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=aa7b47&_nc_eui2=AeG04nLYepMzNvMEIb0Fu9IIjzRnlNL2NqGPNGeU0vY2oecvVwr1EoDPokG3I87iFxbEe12webhjQzWHkQahSk80&_nc_ohc=nZMEgYhtNI0Q7kNvwH9VXLp&_nc_oc=Adn584xXoz5iQHm9g05kBm4Uj5oBVNObSZP8F9_kj2iKKJyopCwPi5sMq1BPWz2XxkQSG96VZUH_ggbmHDoFqioV&_nc_zt=23&_nc_ht=scontent.fbkk12-4.fna&_nc_gid=LUFton3_uJyEfql6bo-2Tg&oh=00_AfnMpZoGo9Z7xbF6wwZwr1RnBnNOkHbOdGV7IAjG8C_Tjw&oe=6951A268', '2', '2025-12-24 11:30:55+00'),
('a9533427-f5bb-4c4f-a398-a7f5c288d0e2', '54ac3bff-bd4a-4f49-b662-a636dffca656', 'https://scontent.fbkk8-4.fna.fbcdn.net/v/t39.30808-6/598697673_1273630351451234_2750177927231113147_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEK1M_Qhc9Hwi3aGrdw1YIH9NsqFYKNr8L02yoVgo2vwthwt6e5iRlk2eAsDH_MMXzfCHax2IqY2wpzo56Brnwr&_nc_ohc=SMHN9XKYojcQ7kNvwFyCKmq&_nc_oc=AdkCmyanB5xPnPX0qDl1tjJOy2DdUpKSllJErJKSo7gL3NAgP_Xa9nORckpzHRq06HSbb4jVD2MweFchmbhxnDiu&_nc_zt=23&_nc_ht=scontent.fbkk8-4.fna&_nc_gid=kt4cJVQxWZowXwZuzTKXLw&oh=00_AfnTaSFPXnFSfpUGn1FDdEh3AUsJKJvyXoAJni_TeK2GTg&oe=6951BD09', '3', '2025-12-24 11:38:17.950108+00'),
('c186184d-06b6-417f-b707-a65b227c9194', '2760a91f-fd3c-4cc1-97e8-ad74699aca0d', 'https://scontent.fbkk12-2.fna.fbcdn.net/v/t39.30808-6/487171459_1058254959655442_2957605397300240826_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=aa7b47&_nc_eui2=AeEuoNgxCbSItqmCwA-EdJ6W8h5kwz2CLKbyHmTDPYIsps9ogDkJqntc4WWaEgNuPIxO1dQVrtejmzPNsAnWtfwB&_nc_ohc=mAgQpG7Z05MQ7kNvwGUJrGa&_nc_oc=AdmPZByAhjTyXM5_GZUwTSojdrtArIIbVxY3AZPz8WbIvElX2-JhSO8XHhGfX3KpwHLtr375LskWacEY7OLFI2gl&_nc_zt=23&_nc_ht=scontent.fbkk12-2.fna&_nc_gid=1CY2ECg1Z1i4OhdhxQ8_qA&oh=00_Afk3YYwxrhhnXVWYh5AoUB9yArc2E3mawBPxPuMK2jACpA&oe=6951AE12', '7', '2025-12-24 11:32:23+00'),
('c199c45a-4bce-446c-979d-1c24b7c1524f', '54ac3bff-bd4a-4f49-b662-a636dffca656', 'https://scontent.fbkk13-2.fna.fbcdn.net/v/t39.30808-6/600340796_1273630391451230_5766272406004825056_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEcEUo3icsHXPZ1haSU7UBkBbAT-YxbiP0FsBP5jFuI_T9OeTiwTYNux9rlU0Hgu-AQbj_ookyIlDslEPk4rubx&_nc_ohc=uexjfFVMPsYQ7kNvwFbl81n&_nc_oc=Adk2qeXzTG0-VV6T6kIDrHgzdNj7T9usE_CKdJzPnVCB1UHzbI497-W0L5eel8UdMkh5mZ1ArDv9cBhxJRrg1S6m&_nc_zt=23&_nc_ht=scontent.fbkk13-2.fna&_nc_gid=fxrUC7lptnoxN_P-z17uUw&oh=00_Afnc_J0mjXcXMdgS_Va5hy80gV1YNd_mw0aQ1yi4V30Zmw&oe=69518D7B', '4', '2025-12-24 11:38:35.89288+00'),
('cc7fb6b8-bfdd-4540-84a1-e024c70ffb88', '2760a91f-fd3c-4cc1-97e8-ad74699aca0d', 'https://scontent.fbkk13-2.fna.fbcdn.net/v/t39.30808-6/487202496_1058254996322105_7065657129658232436_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=aa7b47&_nc_eui2=AeESA-4T51E-rxH4G9NZ_vWootrutvMw8Emi2u628zDwSfKXw0bN5UXf6PGZ6SMIXeI7LifFLa-n27eyQFAQD9Qk&_nc_ohc=Iuk_HG7Nh50Q7kNvwGwNZXa&_nc_oc=AdkoEwZNg9zQ9R-Ci2U9APA124NQB2C5h1Rxwux5XNVAQZr-J3j8vle_ZRn_6Y5OJ-uqFiKahN_o8DNUzHJh56gW&_nc_zt=23&_nc_ht=scontent.fbkk13-2.fna&_nc_gid=26tVjNLx558_ssh2TweGJw&oh=00_AfnjrMn1KRv0L_GrusPXnvqDLwwsC7CdhBLrrR1Qxqp8bQ&oe=6951A327', '10', '2025-12-24 11:33:02+00'),
('e3d5f999-a25b-49e6-99a0-0fb972aa7b2c', '2760a91f-fd3c-4cc1-97e8-ad74699aca0d', 'https://scontent.fbkk9-2.fna.fbcdn.net/v/t39.30808-6/486860139_1058254866322118_2763796792247172300_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=aa7b47&_nc_eui2=AeGMckW5I2dOyE8StoMJqrgOHM4unlHF780czi6eUcXvzeahm6RM5MrfzDRG9Ru4eewOh0yjmbOkyuSjYgLE1BKc&_nc_ohc=ZGc0Bnt_t6cQ7kNvwEFM9ek&_nc_oc=Adl0CWh5pMGgrqEyAlkQY5YO56Z63DsBn4pTR0XRmduSjVfho1I9R4LCwSwXGXXZTtP8_yzsjXZjiq-9pyIsfenn&_nc_zt=23&_nc_ht=scontent.fbkk9-2.fna&_nc_gid=ATdBchovd_NhCeP-ckVwdw&oh=00_Afke0Aqi8XqSX0EkB4NKknOqpSKrC6ZgPNxu2y8-Q88o1w&oe=6951ADD5', '9', '2025-12-24 11:32:56+00');

-- Listing Views
INSERT INTO public.listing_views (id, listing_id, viewer_user_id, viewer_ip, user_agent, created_at) VALUES
('281f3110-9e8a-4510-939e-370e2484c17c', '2760a91f-fd3c-4cc1-97e8-ad74699aca0d', null, '192.168.1.10', 'Mozilla/5.0', '2025-12-24 12:01:34.472986+00'),
('c5a63c4c-2517-4aff-9f20-52c288da8b78', '2760a91f-fd3c-4cc1-97e8-ad74699aca0d', null, '192.168.1.11', 'Chrome/120.0', '2025-12-24 12:01:50.293017+00'),
('ed8328d1-ec9a-48da-9a99-57e6f714fe80', '54ac3bff-bd4a-4f49-b662-a636dffca656', null, '192.168.1.12', 'Safari/17.0', '2025-12-24 12:02:08.480638+00');


-- Listing Favorites
INSERT INTO public.listing_favorites (listing_id, user_id, created_at) VALUES
('2760a91f-fd3c-4cc1-97e8-ad74699aca0d', 'ef4f64d6-0017-4f84-8332-8fbb4cf75b23', '2025-12-24 12:05:26.031609+00'),  -- susu favorite listing 1
('2760a91f-fd3c-4cc1-97e8-ad74699aca0d', 'fab3357a-7c6c-42c4-8a9b-b3f6fd1c410a', '2025-12-24 12:04:58.622578+00'),  -- aung favorite listing 1
('54ac3bff-bd4a-4f49-b662-a636dffca656', 'ef4f64d6-0017-4f84-8332-8fbb4cf75b23', '2025-12-24 12:05:19.095841+00'); -- susu favorite listing 2

--  Listing Messages
INSERT INTO public.listing_messages (id, listing_id, sender_user_id, sender_name, sender_phone, sender_email, message_body, created_at) VALUES
('09eb2c96-34ec-4304-ae90-07fdbd2ae34c', '54ac3bff-bd4a-4f49-b662-a636dffca656', 'ef4f64d6-0017-4f84-8332-8fbb4cf75b23', 'Su Su', '+959444555666', 'susu@gmail.com', 'ဒီအပတ် လာကြည့်လို့ရမလား။', '2025-12-24 12:03:47.203508+00'),
('c1c1546f-b40a-4d2e-a690-8e0e0af33e0c', '2760a91f-fd3c-4cc1-97e8-ad74699aca0d', 'fab3357a-7c6c-42c4-8a9b-b3f6fd1c410a', 'Aung Min', '+959111222333', 'aungmin@gmail.com', 'ဈေးနှုန်း ညှိနှိုင်းလို့ရပါသလား။', '2025-12-24 12:03:00.700458+00');

-- Listing Reports
INSERT INTO public.listing_reports (listing_id, reason, details) VALUES
('54ac3bff-bd4a-4f49-b662-a636dffca656', 'Incorrect price', 'ဈေးနှုန်းက ဈေးကွက်ပေါက်ဈေးနဲ့ ယှဉ်ရင် အရမ်းနည်းနေပုံရတယ်။');
