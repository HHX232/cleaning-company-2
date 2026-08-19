import { readFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { putImage } from "../lib/imageStorage";
import { servicePages as pages, serviceBlocks, galleryItems } from "./seedData";
import { ABOUT_DEFAULTS } from "../lib/aboutData";

const prisma = new PrismaClient();



const teamMembers = [
  { name: "Кирилл", role: "Старший специалист по уборке", order: 0 },
  { name: "Юрий", role: "Координатор экстренных уборок", order: 1 },
  { name: "Татьяна", role: "Эксперт по генеральной уборке", order: 2 },
  { name: "Александр", role: "Мастер по очистке после ЧП", order: 3 },
];

const priceRows = [
  // Уборка квартир
  { tab: "flats", name: "Генеральная", price: "от 5 руб./м²", order: 0 },
  { tab: "flats", name: "Ежедневная", price: "от 2 руб./м²", order: 1 },
  { tab: "flats", name: "Точечная", price: "от 100 руб.", order: 2 },
  { tab: "flats", name: "Разовая", price: "от 5 руб./м²", order: 3 },
  { tab: "flats", name: "Поддерживающая", price: "от 3 руб./м²", order: 4 },
  { tab: "flats", name: "После ремонта", price: "от 8 руб./м²", order: 5 },
  { tab: "flats", name: "Комплексная", price: "от 5 руб./м²", order: 6 },
  { tab: "flats", name: "Срочная уборка", price: "от 10 руб./м²", order: 7 },
  { tab: "flats", name: "После аренды", price: "от 8 руб./м²", order: 8 },
  { tab: "flats", name: "Однокомнатная", price: "от 350 руб.", order: 9 },
  { tab: "flats", name: "Двухкомнатная", price: "от 450 руб.", order: 10 },
  { tab: "flats", name: "Трёхкомнатная", price: "от 550 руб.", order: 11 },
  { tab: "flats", name: "Четырёхкомнатная", price: "650 руб.", order: 12 },
  { tab: "flats", name: "Уборка кухни", price: "от 150 руб.", order: 13 },
  { tab: "flats", name: "Уборка ванной", price: "от 100 руб.", order: 14 },
  { tab: "flats", name: "Антисанитарных квартир", price: "от 500 руб.", order: 15 },
  { tab: "flats", name: "Запущенных квартир", price: "от 500 руб.", order: 16 },
  { tab: "flats", name: "Уборка балкона", price: "от 100 руб.", order: 17 },
  // Уборка домов
  { tab: "houses", name: "Генеральная", price: "от 6 руб./м²", order: 0 },
  { tab: "houses", name: "Точечная", price: "от 200 руб.", order: 1 },
  { tab: "houses", name: "Срочная", price: "от 12 руб./м²", order: 2 },
  { tab: "houses", name: "Коттедж", price: "от 550 руб.", order: 3 },
  { tab: "houses", name: "Дача", price: "от 350 руб.", order: 4 },
  { tab: "houses", name: "После ремонта", price: "от 10 руб./м²", order: 5 },
  // Уборка помещений
  { tab: "rooms", name: "Офисов", price: "от 5 руб./м²", order: 0 },
  { tab: "rooms", name: "Бизнес-центров", price: "от 5 руб./м²", order: 1 },
  { tab: "rooms", name: "Торговых помещений", price: "от 5 руб./м²", order: 2 },
  { tab: "rooms", name: "Салонов красоты", price: "от 6 руб./м²", order: 3 },
  { tab: "rooms", name: "Медицинских центров", price: "от 8 руб./м²", order: 4 },
  { tab: "rooms", name: "Ресторанов и кафе", price: "от 7 руб./м²", order: 5 },
  { tab: "rooms", name: "Служебных помещений", price: "от 5 руб./м²", order: 6 },
  { tab: "rooms", name: "Производственных помещений", price: "от 5 руб./м²", order: 7 },
  { tab: "rooms", name: "Учебных заведений", price: "от 5 руб./м²", order: 8 },
  { tab: "rooms", name: "Нежилых помещений", price: "от 3 руб./м²", order: 9 },
  { tab: "rooms", name: "Складских помещений", price: "от 5 руб./м²", order: 10 },
  { tab: "rooms", name: "Паркинга", price: "от 3 руб./м²", order: 11 },
  { tab: "rooms", name: "Автосалонов", price: "от 5 руб./м²", order: 12 },
  { tab: "rooms", name: "Фитнес-клубов", price: "от 5 руб./м²", order: 13 },
  { tab: "rooms", name: "Магазинов", price: "от 5 руб./м²", order: 14 },
  { tab: "rooms", name: "Бассейнов, бань и саун", price: "от 10 руб./м²", order: 15 },
  // Спецуборка
  { tab: "special", name: "После пожара", price: "от 15 руб./м²", order: 0 },
  { tab: "special", name: "После потопа", price: "от 10 руб./м²", order: 1 },
  { tab: "special", name: "После прорыва канализации", price: "от 15 руб./м²", order: 2 },
  { tab: "special", name: "Слив воды с потолка", price: "от 250 руб.", order: 3 },
  { tab: "special", name: "Удаление плесени", price: "от 350 руб.", order: 4 },
  { tab: "special", name: "После гибели питомца", price: "от 500 руб.", order: 5 },
  { tab: "special", name: "Дезинфекция", price: "от 350 руб.", order: 6 },
  { tab: "special", name: "Расчистка участка", price: "от 500 руб.", order: 7 },
  { tab: "special", name: "После смерти человека", price: "от 15 руб./м²", order: 8 },
  { tab: "special", name: "Удаление запахов", price: "от 350 руб.", order: 9 },
  { tab: "special", name: "Очень грязные квартиры", price: "от 550 руб.", order: 10 },
  { tab: "special", name: "После Плюшкина", price: "от 15 руб./м²", order: 11 },
  { tab: "special", name: "Антисанитарные помещения", price: "от 15 руб./м²", order: 12 },
  { tab: "special", name: "После алкоголиков", price: "от 10 руб./м²", order: 13 },
  { tab: "special", name: "После больных людей", price: "от 10 руб./м²", order: 14 },
  { tab: "special", name: "Вывоз мусора", price: "от 500 руб.", order: 15 },
  { tab: "special", name: "Демонтаж", price: "от 500 руб.", order: 16 },
  { tab: "special", name: "Травля насекомых", price: "от 350 руб.", order: 17 },
  { tab: "special", name: "Голубиный помёт", price: "от 250 руб.", order: 18 },
  { tab: "special", name: "Холодный туман", price: "от 350 руб.", order: 19 },
  // Окна
  { tab: "windows", name: "Сезонная мойка", price: "от 15 руб./створка", order: 0 },
  { tab: "windows", name: "После ремонта", price: "от 25 руб./створка", order: 1 },
  { tab: "windows", name: "Мойка витрин", price: "от 5 руб./м²", order: 2 },
  { tab: "windows", name: "В квартире", price: "от 100 руб.", order: 3 },
  { tab: "windows", name: "В доме", price: "от 200 руб.", order: 4 },
  { tab: "windows", name: "В офисе", price: "от 150 руб.", order: 5 },
];

const promos = [
  {
    badge: "-10%",
    title: "Первая уборка",
    text: "Скидка 10% на первый заказ для новых клиентов — квартиры и дома.",
    order: 0,
  },
  {
    badge: "-15%",
    title: "Уборка + мойка окон",
    text: "Закажите генеральную уборку вместе с мойкой окон и сэкономьте 15%.",
    order: 1,
  },
  {
    badge: "5%",
    title: "Приведи друга",
    text: "Скидка 5% вам и другу при заказе уборки по рекомендации.",
    order: 2,
  },
];


const calculatorOptions = [
  // OBJECT_TYPE — multiplier
  { field: "OBJECT_TYPE" as const, key: "standard", label: "Без происшествий", value: 1, order: 0 },
  { field: "OBJECT_TYPE" as const, key: "death", label: "После смерти", value: 2.2, order: 1 },
  { field: "OBJECT_TYPE" as const, key: "flood", label: "После потопа", value: 1.6, order: 2 },
  { field: "OBJECT_TYPE" as const, key: "fire", label: "После пожара", value: 1.8, order: 3 },
  // DIRT — multiplier
  { field: "DIRT" as const, key: "light", label: "Легкая", value: 1, order: 0 },
  { field: "DIRT" as const, key: "medium", label: "Средняя", value: 1.5, order: 1 },
  { field: "DIRT" as const, key: "heavy", label: "Тяжёлая", value: 2.5, order: 2 },
  // BUILDING_TYPE — multiplier
  { field: "BUILDING_TYPE" as const, key: "apartment", label: "Квартира", value: 1, order: 0 },
  { field: "BUILDING_TYPE" as const, key: "house", label: "Дом", value: 1.15, order: 1 },
  { field: "BUILDING_TYPE" as const, key: "building", label: "Здание", value: 1.3, order: 2 },
  // REGION — multiplier
  { field: "REGION" as const, key: "minsk", label: "Минск", value: 1, order: 0 },
  { field: "REGION" as const, key: "minskRegion", label: "Минский район", value: 1.15, order: 1 },
  { field: "REGION" as const, key: "otherCity", label: "Другой город", value: 1.35, order: 2 },
  // URGENCY — multiplier
  { field: "URGENCY" as const, key: "planned", label: "Планово", value: 1, order: 0 },
  { field: "URGENCY" as const, key: "tomorrow", label: "Завтра", value: 1.2, order: 1 },
  { field: "URGENCY" as const, key: "today", label: "Сегодня", value: 1.5, order: 2 },
  // STAFF — divider
  { field: "STAFF" as const, key: "1", label: "1 человек", value: 1, order: 0 },
  { field: "STAFF" as const, key: "2", label: "2 человека", value: 1.6, order: 1 },
  { field: "STAFF" as const, key: "3", label: "Бригада 3+", value: 2.4, order: 2 },
  // EXTRA — flat ruble price
  { field: "EXTRA" as const, isFixed: true, key: "odorRemoval", label: "Устранение запаха", value: 20, order: 0 },
  { field: "EXTRA" as const, isFixed: true, key: "pestControl", label: "Устранение насекомых", value: 35, order: 1 },
  { field: "EXTRA" as const, isFixed: true, key: "windowWashing", label: "Мойка окон", value: 30, order: 2 },
  { field: "EXTRA" as const, isFixed: true, key: "dryCleaning", label: "Химчистка", value: 25, order: 3 },
  { field: "EXTRA" as const, isFixed: true, key: "demolition", label: "Демонтаж", value: 40, order: 4 },
  { field: "EXTRA" as const, isFixed: true, key: "trash", label: "Вывоз мусора", value: 15, order: 5 },
];

// Extras dropped/renamed away from — deleted below so they don't linger as
// orphaned rows the admin calculator page and upsert-by-key wouldn't touch.
const removedCalculatorOptionKeys = [{ field: "EXTRA", key: "ozone" }, { field: "EXTRA", key: "generalCleaning" }, { field: "EXTRA", key: "chemistry" }];

const reviews = [
  {
    stars: 5,
    text: "Заказывала генеральную уборку после зимы — окна, кухня, все шкафы. Приехали двое клинеров, работали часа четыре, ушли только когда я сама всё проверила. Квартира как после ремонта, только без ремонта.",
    service: "Генеральная уборка квартиры",
    order: 0,
  },
  {
    stars: 5,
    text: "Соседи сверху затопили квартиру, вода была везде. Ребята приехали в тот же день, вывезли мокрую мебель, просушили полы, обработали от плесени. Без них я бы неделю приходила в себя, а тут за один день разгребли всё.",
    service: "Уборка после происшествия",
    order: 1,
  },
  {
    stars: 5,
    text: "Мыли окна на 9 этаже без балкона — переживала, как они это сделают. Приехали со спецоборудованием, всё аккуратно, ни разводов, ни капель на подоконниках. Соседка теперь тоже их номер записала.",
    service: "Мойка окон",
    order: 2,
  },
  {
    stars: 5,
    text: "После ремонта квартира была в пыли и мелкой стружке буквально везде, даже в розетках. Убирали часа три, вымыли даже плинтусы изнутри. Заезжать в чистую квартиру после ремонта — совсем другое ощущение.",
    service: "Уборка после ремонта",
    order: 3,
  },
  {
    stars: 5,
    text: "У нас двухэтажный дом за городом, убирать своими силами уже не тянули. Клининг приезжает раз в месяц, работают быстро и без суеты, ничего не переставляют не на место. Дом реально дышит после них.",
    service: "Генеральная уборка дома",
    order: 4,
  },
  {
    stars: 5,
    text: "Заказываем уборку офиса на 20 человек два раза в неделю. Ни разу не было претензий — приходят рано утром до начала рабочего дня, всё чисто, кофемашину и холодильник тоже в порядке держат.",
    service: "Уборка офиса",
    order: 5,
  },
  {
    stars: 5,
    text: "Взяла поддерживающую уборку раз в неделю, потому что с двумя детьми руки не доходят до генеральной. Приходит одна и та же девушка, уже знает, где что лежит, работает быстро и без лишних вопросов.",
    service: "Поддерживающая уборка",
    order: 6,
  },
  {
    stars: 5,
    text: "Убирали квартиру бабушки, которая много лет не делала генеральную уборку — там реально было тяжело работать. Приехала бригада из трёх человек, вывезли несколько мешков мусора, отмыли всё до блеска. Спасибо, что взялись за такой сложный объект.",
    service: "Уборка запущенной квартиры",
    order: 7,
  },
  {
    stars: 5,
    text: "В ванной появилась плесень по швам плитки, сами вывести не смогли. Вызвала клининг — обработали спецсредствами, показали, что делали, дали рекомендации, чтобы не появлялась снова. Уже два месяца прошло, всё чисто.",
    service: "Удаление плесени",
    order: 8,
  },
  {
    stars: 5,
    text: "Нужна была срочная уборка перед приездом гостей, записалась буквально за несколько часов. Ребята подстроились под моё время, приехали день в день и всё успели. Спасли ситуацию, честно.",
    service: "Срочная уборка",
    order: 9,
  },
];

const whyUsPhotos = [
  { key: "why-us-reason1", file: "posters/whyus-punctual.webp", mimeType: "image/webp" },
  { key: "why-us-reason2", file: "services/com-industrial.webp", mimeType: "image/webp" },
  { key: "why-us-reason3", file: "posters/whyus-trusted.webp", mimeType: "image/webp" },
  { key: "why-us-reason4", file: "posters/whyus-specialized.webp", mimeType: "image/webp" },
  { key: "why-us-reason5", file: "services/windows-office.webp", mimeType: "image/webp" },
];

async function main() {
  for (const page of pages) {
    await prisma.servicePage.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }
  console.log(`Seeded ${pages.length} service pages.`);

  // No natural unique key on team members — reseed is a clean replace.
  await prisma.teamMember.deleteMany();
  await prisma.teamMember.createMany({ data: teamMembers });
  console.log(`Seeded ${teamMembers.length} team members.`);

  // Seed the two WhyUs photos that used to be static files: bytes go to S3,
  // metadata row to the DB (putImage handles both), so the homepage doesn't
  // regress to a placeholder before someone re-uploads them from /admin.
  for (const photo of whyUsPhotos) {
    const data = readFileSync(path.join(__dirname, "..", "public", "images", photo.file));
    await putImage(photo.key, data, photo.mimeType);
  }
  console.log(`Seeded ${whyUsPhotos.length} why-us photos into S3 + SiteImage.`);

  if ((await prisma.promo.count()) === 0) {
    await prisma.promo.createMany({ data: promos });
    console.log(`Seeded ${promos.length} promos.`);
  }

  for (const block of serviceBlocks) {
    await prisma.serviceBlock.upsert({
      where: { slotId: block.slotId },
      update: block,
      create: block,
    });
  }
  console.log(`Seeded ${serviceBlocks.length} service blocks.`);

  for (const option of calculatorOptions) {
    await prisma.calculatorOption.upsert({
      where: { field_key: { field: option.field, key: option.key } },
      update: option,
      create: option,
    });
  }
  for (const removed of removedCalculatorOptionKeys) {
    await prisma.calculatorOption.deleteMany({ where: removed });
  }
  console.log(`Seeded ${calculatorOptions.length} calculator options.`);

  if ((await prisma.review.count()) === 0) {
    await prisma.review.createMany({ data: reviews });
    console.log(`Seeded ${reviews.length} reviews.`);
  }

  // No natural unique key on price rows — reseed is a clean replace.
  await prisma.priceRow.deleteMany();
  await prisma.priceRow.createMany({ data: priceRows });
  console.log(`Seeded ${priceRows.length} price rows.`);

  // No natural unique key on gallery items — reseed is a clean replace.
  await prisma.galleryItem.deleteMany();
  await prisma.galleryItem.createMany({
    data: galleryItems.map((item) => ({
      title: item.title,
      meta: item.meta,
      category: item.category,
      order: item.order,
      beforeUrl: item.beforeUrl,
      afterUrl: item.afterUrl,
    })),
  });
  console.log(`Seeded ${galleryItems.length} gallery items.`);

  await prisma.aboutPage.upsert({
    where: { id: "about" },
    update: {},
    create: { id: "about", ...ABOUT_DEFAULTS },
  });
  console.log("Seeded About page (create-if-missing).");

  // Admin login is a single hardcoded credential pair (ADMIN_EMAIL /
  // ADMIN_PASSWORD_HASH env vars, see lib/auth.ts) — nothing to seed.
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
