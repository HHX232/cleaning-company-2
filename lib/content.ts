export const heroServices = [
  { label: "Уборка после происшествий" },
  { label: "Генеральная уборка квартир и домов" },
  { label: "Мойка окон и витрин" },
  { label: "Удаление грибка и плесени" },
];

export const heroStats = [
  { value: "500+", label: "уборок выполнено" },
  { value: "24/7", label: "на связи" },
  { value: "5 лет", label: "на рынке" },
];

// Photos for these two reasons are DB-backed now (SiteImage keys
// "why-us-reason1"/"why-us-reason2", editable at /admin) — only copy stays
// here.
export const whyUs = {
  reason1: {
    text: "Мы приедем в удобное для вас время без задержек и выполним работу качественно и в срок. Наши специалисты на связи 24/7 в мессенджерах и всегда готовы помочь.",
  },
  reason2: {
    text: "Работаем с физическими и юридическими лицами — удобные условия для дома, офиса или предприятия.",
  },
};

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

export const specialists = [
  { role: "Клинер-универсал", slotId: "staff-1", placeholder: "Фото специалиста", exp: "опыт от 3 лет" },
  { role: "Бригадир", slotId: "staff-2", placeholder: "Фото специалиста", exp: "опыт от 5 лет" },
  { role: "Специалист по спецуборке", slotId: "staff-3", placeholder: "Фото специалиста", exp: "опыт от 4 лет" },
  { role: "Менеджер по заявкам", slotId: "staff-4", placeholder: "Фото специалиста", exp: "на связи 24/7" },
];

// "Отзывы" now live in the Review table (admin-editable at /admin/reviews).

export const company = {
  name: "Специализированный-клининг",
  tagline: "Клининг квартир, домов и офисов",
  city: "Минск",
  phone: "+375 29 232-52-09",
  email: "info@specclean.by",
};

// Separate from company.phone above (the direct-call line) — this is the
// dedicated WhatsApp/Viber contact number.
const messengerPhone = "+375256432677";
const messengerPhoneDigits = messengerPhone.replace(/\D/g, "");

export const feedbackEmail = "mojkaokonbel@gmail.com";

// "chat" scrolls to the contact block until an actual in-site chat ships
// alongside the admin/orders backend.
export const contactLinks = {
  whatsapp: `https://wa.me/${messengerPhoneDigits}`,
  viber: `viber://chat?number=%2B${messengerPhoneDigits}`,
  telegram: "https://t.me/mojkaokonbel",
  email: `mailto:${feedbackEmail}`,
  chat: "#order",
};
