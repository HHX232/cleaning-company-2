import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export type ProcessStep = { num: string; title: string; text: string };
export type ServiceFaqItem = { question: string; answer: string };

export type ServiceSharedContent = {
  heroCtaLabel: string;
  processSteps: ProcessStep[];
  midBannerStaffName: string;
  midBannerStaffRoles: string[];
  midBannerTitle: string;
  midBannerParagraphs: string[];
  midBannerCtaLabel: string;
  howToOrderTitle: string;
  howToOrderIntro: string;
  howToOrderOutroLead: string;
  howToOrderOutroBold: string;
  howToOrderOutroTail: string;
  teamTitle: string;
  teamSubtitle1: string;
  teamSubtitle2: string;
  calculatorTitle: string;
  reviewsTitle: string;
  galleryTitle: string;
  serviceFaq: ServiceFaqItem[];
  seoText: string[];
  consultationEyebrow: string;
  consultationTitle: string;
  consultationSubtitle: string;
  consultationPerks: string[];
  consultationCtaLabel: string;
};

// Shown when no ServiceSharedContent row exists yet; also seeded into the
// DB so the admin has editable content out of the box. Matches the copy
// that used to be hardcoded in lib/serviceCategoryContent.ts, shared across
// all individual service pages (app/[slug]/page.tsx).
export const SERVICE_SHARED_DEFAULTS: ServiceSharedContent = {
  heroCtaLabel: "Заказать уборку",
  processSteps: [
    {
      num: "01",
      title: "Заявка и консультация",
      text: "Для заказа уборки оставьте заявку на сайте или перезвоните нам по телефону. Мы гарантируем максимально быстрый выезд для решения ваших проблем.",
    },
    {
      num: "02",
      title: "Согласование работ",
      text: "Согласуем стоимость уборки, удобную дату, время и оформим заказ. Цена услуги полностью зависит от объема работы и не меняется в процессе.",
    },
    {
      num: "03",
      title: "Уборка",
      text: "Наши клинеры приедут на объект и проведут профессиональный клининг, оставив после себя безупречную чистоту и полный порядок.",
    },
    {
      num: "04",
      title: "Оплата",
      text: "Вы проверяете качество уборки, принимаете её и оплачиваете стоимость нашей услуги. Каждый заказчик, компания или частное лицо, могут использовать любой удобный способ оплаты.",
    },
  ],
  midBannerStaffName: "Виктория",
  midBannerStaffRoles: ["Специалист по клинингу", "Эксперт по чистоте"],
  midBannerTitle: "Специализированный клининг – уборка любой сложности 24/7!",
  midBannerParagraphs: [
    "Произошёл потоп, пожар или другое ЧП? Мы оперативно выезжаем 24/7 и быстро устраняем последствия, бережно очищая помещения с помощью профессиональных технологий.",
    "Работаем там, где другие не берутся: убираем запущенные квартиры, помещения после смерти и ликвидируем антисанитарию, используя безопасные средства и современное оборудование.",
    "Оставьте заявку – наш специалист готов выехать в любое время, чтобы быстро и качественно решить вашу проблему!",
  ],
  midBannerCtaLabel: "Заказать консультацию",
  howToOrderTitle: "Как заказать уборку в Минске",
  howToOrderIntro:
    "Заказать профессиональную уборку в Минске и по всей Беларуси теперь проще, чем когда-либо! Мы работаем с квартирами, коттеджами, офисами, а также проводим спецуборки после ЧП, устранение антисанитарии и генеральную очистку сложных объектов. Наши специалисты быстро и качественно справляются даже с самыми трудными случаями: после пожара, затопления, ремонта или запущенного состояния жилья. Чистый пол и окна, сверкающая сантехника, свежий воздух без неприятных запахов – всё это делает жизнь комфортнее.",
  howToOrderOutroLead:
    "Чтобы избавиться от хлопот и навести идеальную чистоту в доме или офисе, достаточно заказать уборку у профессионалов. Работаем",
  howToOrderOutroBold: "круглосуточно, без выходных",
  howToOrderOutroTail: "и готовы срочно выехать на заказ!",
  teamTitle: "Наша команда",
  teamSubtitle1: "Профессионалы своего дела с большим опытом работы",
  teamSubtitle2: "Справятся с любыми задачами",
  calculatorTitle: "Подробный расчёт стоимости",
  reviewsTitle: "Отзывы клиентов",
  galleryTitle: "Примеры работ",
  serviceFaq: [
    {
      question: "Какие виды уборки вы проводите?",
      answer:
        "Мы занимаемся как обычными уборками (генеральными, послестроительными, послеремонтными), так и спецуборками после пожара, потопа, ликвидацией антисанитарии и даже уборкой после смерти.",
    },
    {
      question: "Могу ли я заказать срочную уборку?",
      answer: "Да, мы работаем 24/7 и можем выехать на срочную уборку в любое время, включая выходные и праздничные дни.",
    },
    {
      question: "Вы работаете только в Минске или и в других городах?",
      answer: "Мы предоставляем услуги по всей Беларуси, и при необходимости можем договориться о выезде в другие города.",
    },
    {
      question: "Как проходит уборка в запущенных квартирах?",
      answer:
        "Мы проводим комплексную уборку, начиная с удаления мусора, антисанитарии и заканчивая глубокой дезинфекцией всех поверхностей, чтобы вернуть помещению чистоту и порядок.",
    },
    {
      question: "Вы работаете только с физическими или и с юридическими лицами?",
      answer:
        "Мы предоставляем услуги как для физических, так и для юридических лиц. У нас есть гибкие предложения для бизнеса, включая уборку офисов и коммерческих помещений.",
    },
  ],
  seoText: [
    "Забудьте о бесконечной уборке дома или офиса. Наша профессиональная клининговая компания предлагает решение, которое сэкономит ваше время и обеспечит идеальную чистоту. Наши опытные клинеры используют специализированное оборудование и эффективные средства, гарантируя безупречные результаты. Они разработают индивидуальный план, учитывающий ваши потребности и распорядок. Доверьтесь профессионалам и освободите себя для более важных дел.",
    "Мы предлагаем всеобъемлющие клининговые услуги для ваших потребностей. Выбирайте из ежедневной уборки для постоянного поддержания чистоты, генеральной уборки для тщательной очистки всех поверхностей, уборки после ремонта для устранения строительного мусора, профессиональной мойки окон для кристальной прозрачности, или глубокой химической чистки мягкой мебели и ковров для восстановления их первоначального вида. Мы предоставим идеальные результаты вне зависимости от ваших требований.",
    "Стоимость клининговых услуг в Минске зависит от нескольких ключевых факторов. Тип услуги, площадь помещения и сложность работ напрямую влияют на цену. Ежедневная уборка, генеральная уборка или мытьё окон - каждый вид услуги имеет свою стоимость. Чем больше площадь, тем выше цена. Уборка после ремонта или генеральная уборка - более трудоёмкие работы, которые дороже. При выборе надёжной клининговой компании внимательно изучите отзывы клиентов, опыт работы компании и наличие профессиональных лицензий. Компании с длительным стажем обычно предоставляют более качественные услуги. Также обратите внимание на гибкость графика - возможность подстроиться под ваши потребности.",
    "Вы можете доверить уборку профессиональной клининговой компании и обеспечить себе чистое и уютное пространство без лишних усилий. Это особенно важно в динамичном Минске, где каждая минута на счету. Выбирайте надежных партнеров и наслаждайтесь чистотой вашего дома или офиса.",
  ],
  consultationEyebrow: "Не определились с услугой?",
  consultationTitle: "Закажите бесплатную консультацию с менеджером",
  consultationSubtitle: "На бесплатной консультации вы сможете:",
  consultationPerks: ["Задать необходимые вопросы", "Узнать стоимость вашей уборки", "Оформить заказ на уборку"],
  consultationCtaLabel: "Оставить заявку",
};

export const getServiceSharedContent = unstable_cache(
  async (): Promise<ServiceSharedContent> => {
    const row = await prisma.serviceSharedContent.findUnique({ where: { id: "service-shared" } });
    if (!row) return SERVICE_SHARED_DEFAULTS;
    return {
      heroCtaLabel: row.heroCtaLabel,
      processSteps: (row.processSteps as ProcessStep[] | null) ?? [],
      midBannerStaffName: row.midBannerStaffName,
      midBannerStaffRoles: (row.midBannerStaffRoles as string[] | null) ?? [],
      midBannerTitle: row.midBannerTitle,
      midBannerParagraphs: (row.midBannerParagraphs as string[] | null) ?? [],
      midBannerCtaLabel: row.midBannerCtaLabel,
      howToOrderTitle: row.howToOrderTitle,
      howToOrderIntro: row.howToOrderIntro,
      howToOrderOutroLead: row.howToOrderOutroLead,
      howToOrderOutroBold: row.howToOrderOutroBold,
      howToOrderOutroTail: row.howToOrderOutroTail,
      teamTitle: row.teamTitle,
      teamSubtitle1: row.teamSubtitle1,
      teamSubtitle2: row.teamSubtitle2,
      calculatorTitle: row.calculatorTitle,
      reviewsTitle: row.reviewsTitle,
      galleryTitle: row.galleryTitle,
      serviceFaq: (row.serviceFaq as ServiceFaqItem[] | null) ?? [],
      seoText: (row.seoText as string[] | null) ?? [],
      consultationEyebrow: row.consultationEyebrow,
      consultationTitle: row.consultationTitle,
      consultationSubtitle: row.consultationSubtitle,
      consultationPerks: (row.consultationPerks as string[] | null) ?? [],
      consultationCtaLabel: row.consultationCtaLabel,
    };
  },
  ["service-shared-content"],
  { revalidate: 600 },
);
