import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export type HeroService = { label: string };
export type HeroStat = { value: string; label: string };
export type ReasonSlide = { tag: string; title: string; text: string };
export type IconCard = { icon: string; title: string; text: string };
export type FaqItem = { question: string; answer: string };

export type HomeContent = {
  heroEyebrow: string;
  heroTitleMain: string;
  heroTitleHighlight: string;
  heroTitleSuffix: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroServices: HeroService[];
  heroStats: HeroStat[];
  reasons: ReasonSlide[];
  reasonsSectionTitle: string;
  specialistsTitle: string;
  calculatorTitle: string;
  reviewsTitle: string;
  galleryTitle: string;
  promotionsTitle: string;
  servicesTitle: string;
  pricesTitle: string;
  howItWorksTitle: string;
  howItWorksLead: string;
  howItWorks: IconCard[];
  serviceGuaranteesTitle: string;
  serviceGuarantees: IconCard[];
  faqSectionTitle: string;
  faqItems: FaqItem[];
  ctaBannerTitle: string;
  ctaBannerCtaLabel: string;
  ctaBannerParagraphs: string[];
};

// Shown when no HomeContent row exists yet; also seeded into the DB so the
// admin has editable content out of the box. Matches the copy that used to
// be hardcoded in components/landing/Hero.tsx and lib/content.ts.
export const HOME_CONTENT_DEFAULTS: HomeContent = {
  heroEyebrow: "Клининг по всей Беларуси",
  heroTitleMain: "Чистота",
  heroTitleHighlight: "любой",
  heroTitleSuffix: "сложности",
  heroSubtitle: "Доступны 24/7 — приедем, когда это нужно именно вам. Все клининговые услуги в одном месте.",
  heroCtaPrimary: "Заказать уборку",
  heroCtaSecondary: "Смотреть услуги ↓",
  heroServices: [
    { label: "Уборка после происшествий" },
    { label: "Генеральная уборка квартир и домов" },
    { label: "Мойка окон и витрин" },
    { label: "Удаление грибка и плесени" },
  ],
  heroStats: [
    { value: "1000+", label: "уборок выполнено" },
    { value: "24/7", label: "на связи" },
    { value: "15 лет", label: "на рынке" },
  ],
  reasons: [
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
  ],
  reasonsSectionTitle: "Причины заказать уборку",
  specialistsTitle: "Наши специалисты",
  calculatorTitle: "Подробный расчёт стоимости",
  reviewsTitle: "Отзывы клиентов",
  galleryTitle: "Примеры работ",
  promotionsTitle: "Наши акции",
  servicesTitle: "Наши услуги",
  pricesTitle: "Цены на клининг в Минске",
  howItWorksTitle: "Простой и понятный процесс без сюрпризов по цене",
  howItWorksLead:
    "От первой заявки до приёмки уборки вы понимаете, что будет происходить, сколько это стоит и когда мы приедем.",
  howItWorks: [
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
  ],
  serviceGuaranteesTitle: "Уборка с понятными условиями и личной ответственностью",
  serviceGuarantees: [
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
  ],
  faqSectionTitle: "Вопросы и ответы",
  faqItems: [
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
  ],
  ctaBannerTitle: "Специализированный-клининг – уборка любой сложности 24/7!",
  ctaBannerCtaLabel: "Заказать консультацию",
  ctaBannerParagraphs: [
    "Произошёл потоп, пожар или другое ЧП? Мы оперативно выезжаем 24/7 и быстро устраняем последствия, бережно очищая помещения с помощью профессиональных технологий.",
    "Работаем там, где другие не берутся: убираем запущенные квартиры, помещения после смерти и ликвидируем антисанитарию, используя безопасные средства и современное оборудование.",
    "Оставьте заявку – наш специалист готов выехать в любое время, чтобы быстро и качественно решить вашу проблему!",
  ],
};

export const getHomeContent = unstable_cache(
  async (): Promise<HomeContent> => {
    const row = await prisma.homeContent.findUnique({ where: { id: "home" } });
    if (!row) return HOME_CONTENT_DEFAULTS;
    return {
      heroEyebrow: row.heroEyebrow,
      heroTitleMain: row.heroTitleMain,
      heroTitleHighlight: row.heroTitleHighlight,
      heroTitleSuffix: row.heroTitleSuffix,
      heroSubtitle: row.heroSubtitle,
      heroCtaPrimary: row.heroCtaPrimary,
      heroCtaSecondary: row.heroCtaSecondary,
      heroServices: (row.heroServices as HeroService[] | null) ?? [],
      heroStats: (row.heroStats as HeroStat[] | null) ?? [],
      reasons: (row.reasons as ReasonSlide[] | null) ?? [],
      reasonsSectionTitle: row.reasonsSectionTitle,
      specialistsTitle: row.specialistsTitle,
      calculatorTitle: row.calculatorTitle,
      reviewsTitle: row.reviewsTitle,
      galleryTitle: row.galleryTitle,
      promotionsTitle: row.promotionsTitle,
      servicesTitle: row.servicesTitle,
      pricesTitle: row.pricesTitle,
      howItWorksTitle: row.howItWorksTitle,
      howItWorksLead: row.howItWorksLead,
      howItWorks: (row.howItWorks as IconCard[] | null) ?? [],
      serviceGuaranteesTitle: row.serviceGuaranteesTitle,
      serviceGuarantees: (row.serviceGuarantees as IconCard[] | null) ?? [],
      faqSectionTitle: row.faqSectionTitle,
      faqItems: (row.faqItems as FaqItem[] | null) ?? [],
      ctaBannerTitle: row.ctaBannerTitle,
      ctaBannerCtaLabel: row.ctaBannerCtaLabel,
      ctaBannerParagraphs: (row.ctaBannerParagraphs as string[] | null) ?? [],
    };
  },
  ["home-content"],
  { revalidate: 600 },
);
