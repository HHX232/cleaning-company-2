export const heroServices = [
  { label: "Уборка после происшествий" },
  { label: "Генеральная уборка квартир и домов" },
  { label: "Мойка окон и витрин" },
  { label: "Удаление грибка и плесени" },
];

export const heroStats = [
  { value: "1000+", label: "уборок выполнено" },
  { value: "24/7", label: "на связи" },
  { value: "15 лет", label: "на рынке" },
];

// Slides for the homepage "Причины заказать уборку" carousel. Photos are
// DB-backed (SiteImage keys "why-us-reason1".."why-us-reason5", editable at
// /admin) — only copy and tags stay here.
export const whyUsReasons = [
  {
    tag: "Пунктуальность",
    title: "Приезжаем точно в срок, 24/7",
    text: "Работаем круглосуточно и без выходных. Специалисты на связи в мессенджерах и всегда готовы выехать в удобное для вас время — без задержек и переносов.",
  },
  {
    tag: "Оборудование",
    title: "Профессиональная техника и химия",
    text: "Используем промышленное оборудование и сертифицированные чистящие средства — справляемся с загрязнениями, которые не берёт обычная бытовая уборка.",
  },
  {
    tag: "Доверие",
    title: "Работаем с частными лицами и бизнесом",
    text: "Удобные условия и прозрачные договорённости для дома, офиса или предприятия — от разовой уборки квартиры до контракта с юридическим лицом.",
  },
  {
    tag: "Спецподготовка",
    title: "Берёмся за самое сложное",
    text: "Убираем после пожара, потопа и других ЧП, устраняем антисанитарию — работаем в защитной экипировке и не отказываемся от сложных случаев.",
  },
  {
    tag: "Масштаб",
    title: "Любая сложность и высота",
    text: "От мойки фасадных окон высотных зданий до генеральной уборки больших помещений — подбираем команду и снаряжение под задачу любого масштаба.",
  },
];

// "Почему выбирают нас" — 8-reason grid shown site-wide (components/landing/WhyChooseUs.tsx),
// before its own dedicated page at /pochemu-vybirayut-nas.
export const whyChooseUs = {
  eyebrow: "Почему выбирают нас",
  title: "8 причин доверить уборку нам",
  description:
    "Мы делаем клининг простым и предсказуемым: честная цена, быстрый выезд и результат, за который " +
    "не стыдно. Вот почему нам доверяют тысячи клиентов по всей Беларуси.",
  advantages: [
    {
      icon: "🕒",
      title: "Работаем 24/7",
      text: "Принимаем заявки и выезжаем круглосуточно — даже ночью, в выходные и праздники.",
    },
    {
      icon: "₽",
      title: "Честная цена",
      text: "Фиксируем стоимость до начала работ. Никаких скрытых доплат «по факту».",
    },
    {
      icon: "⚡",
      title: "Выезд в день обращения",
      text: "Срочно нужна уборка? Приедем сегодня и приведём объект в порядок под ключ.",
    },
    {
      icon: "🧪",
      title: "Своя химия и техника",
      text: "Профессиональные моющие пылесосы, парогенераторы и сертифицированные средства.",
    },
    {
      icon: "👷",
      title: "Опытная команда",
      text: "Обученные клинеры со стажем, которые знают, как справиться с любым загрязнением.",
    },
    {
      icon: "🛡️",
      title: "Гарантия результата",
      text: "Не устроил результат? Вернёмся и переделаем бесплатно — без лишних вопросов.",
    },
    {
      icon: "🌍",
      title: "По всей Беларуси",
      text: "Работаем в Минске и выезжаем в область и другие города страны.",
    },
    {
      icon: "🤝",
      title: "Берёмся за сложное",
      text: "Убираем то, за что не берутся другие: после пожара, потопа, запущенные помещения.",
    },
  ],
};

// Homepage "Простой и понятный процесс" timeline — components/landing/HowItWorks.tsx.
export const howItWorksSteps = [
  {
    icon: "phone",
    title: "Заявка и знакомство",
    text: "Оставляете заявку на сайте или по телефону — перезваниваем в течение 15 минут, уточняем детали и считаем стоимость.",
  },
  {
    icon: "calendar",
    title: "Фиксация договорённостей",
    text: "Согласовываем дату, время и объём работ. Фиксируем цену в переписке — она не изменится.",
  },
  {
    icon: "bag",
    title: "Подготовка",
    text: "Наша команда приезжает со своим оборудованием и профессиональной химией — вам ничего не нужно готовить.",
  },
  {
    icon: "camera",
    title: "Уборка с фотоотчётом",
    text: "Работаем по чек-листу. По завершении присылаем фото до/после ключевых зон и проводим совместную приёмку.",
  },
  {
    icon: "badge",
    title: "Оплата и гарантия",
    text: "Оплата после приёмки. Если что-то не устроит — бесплатно исправим в тот же день.",
  },
];

// Homepage "Уборка с понятными условиями" green benefits block —
// components/landing/ServiceGuarantees.tsx.
export const serviceGuarantees = [
  {
    icon: "clock",
    title: "Освободим для вас 5–8 часов в неделю",
    text: "Вместо уборки вы займётесь тем, что действительно важно. Подбираем график под вас, а не наоборот.",
  },
  {
    icon: "trophy",
    title: "Профессиональная чистота, а не «как получится»",
    text: "Используем профессиональную технику и сертифицированные гипоаллергенные средства — безопасно для детей, питомцев и аллергиков.",
  },
  {
    icon: "shield",
    title: "Проверенные специалисты, никаких случайных людей",
    text: "Каждый клинер проходит проверку и инструктаж. Бережно относимся к вещам, заранее уточняем важные детали.",
  },
  {
    icon: "wallet",
    title: "Фиксированная цена и гарантия результата",
    text: "Стоимость известна заранее и не меняется в процессе. Если что-то не устроит — бесплатно исправим в течение 24 часов.",
  },
  {
    icon: "heart",
    title: "Не конвейер, а индивидуальный подход",
    text: "Учитываем ваши пожелания и особенности объекта, подстраиваемся под ваш график и привычки.",
  },
];

// Prices themselves are admin-editable now (PriceRow model, /admin/prices,
// lib/priceData.ts) — the tab categories stay a fixed structural list.
export type PriceTabId = "flats" | "houses" | "rooms" | "special" | "windows";

export const priceTabs: { id: PriceTabId; label: string }[] = [
  { id: "flats", label: "Квартиры" },
  { id: "houses", label: "Дома" },
  { id: "rooms", label: "Помещения" },
  { id: "special", label: "Спецуборка" },
  { id: "windows", label: "Окна" },
];

// Calculator field/pricing options now live in the CalculatorOption table
// (lib/calculatorOptionsData.ts, admin-editable at /admin/calculator) —
// this is just the decorative, unwired "Количество комнат" selector that
// was never part of the pricing formula.
export const roomOptions = ["1", "2", "3", "4", "5+"];

// "Примеры работ" is DB-driven now (GalleryItem model, /admin/gallery,
// lib/galleryData.ts).

export const faq = [
  {
    question: "Какие виды уборки вы проводите?",
    answer:
      "Генеральную, поддерживающую, послестроительную уборку, спецуборку после происшествий, мойку окон и витрин — для квартир, домов и коммерческих помещений.",
  },
  {
    question: "Могу ли я заказать срочную уборку?",
    answer:
      "Да, мы работаем 24/7 и можем выехать на срочную уборку в любое время, включая выходные и праздничные дни.",
  },
  {
    question: "Вы работаете только в Минске или и в других городах?",
    answer: "Мы принимаем заявки по всей Беларуси, выезжая в другие города по договорённости.",
  },
  {
    question: "Как проходит уборка в запущенных квартирах?",
    answer:
      "Специалисты выезжают в защитной экипировке, вывозят мусор, обрабатывают поверхности профессиональной химией и устраняют запахи и загрязнения любой сложности.",
  },
  {
    question: "Вы работаете только с физическими или и с юридическими лицами?",
    answer:
      "Мы работаем и с физическими, и с юридическими лицами — предлагаем удобные условия для дома, офиса или предприятия.",
  },
];

// Homepage "Наши специалисты" is driven by the TeamMember table
// (/admin/team) — see components/landing/Specialists.tsx.

// "Отзывы" now live in the Review table (admin-editable at /admin/reviews).

export const company = {
  name: "Специализированный-клининг",
  tagline: "Клининг квартир, домов и офисов",
  city: "Минск",
  phone: "+375 25 790-54-70",
  email: "speckliningbel@yandex.by",
};

// Same number as company.phone above — kept as a separate constant since
// WhatsApp/Viber need the raw digits while company.phone is the formatted
// display string.
const messengerPhone = company.phone;
const messengerPhoneDigits = messengerPhone.replace(/\D/g, "");

export const feedbackEmail = "speckliningbel@yandex.by";

// "chat" scrolls to the contact block until an actual in-site chat ships
// alongside the admin/orders backend.
export const contactLinks = {
  whatsapp: `https://wa.me/${messengerPhoneDigits}`,
  viber: `viber://chat?number=%2B${messengerPhoneDigits}`,
  telegram: "https://t.me/speckliningbel",
  email: `mailto:${feedbackEmail}`,
  chat: "#order",
};
