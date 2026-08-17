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
  { tab: "flats", name: "Генеральная", price: "от 100 руб.", order: 0 },
  { tab: "flats", name: "Поддерживающая", price: "от 100 руб.", order: 1 },
  { tab: "flats", name: "Ежедневная", price: "от 100 руб.", order: 2 },
  { tab: "flats", name: "Точечная", price: "от 100 руб.", order: 3 },
  { tab: "flats", name: "Разовая", price: "от 100 руб.", order: 4 },
  { tab: "flats", name: "После ремонта", price: "от 200 руб.", order: 5 },
  { tab: "flats", name: "После аренды", price: "договорная", order: 6 },
  { tab: "flats", name: "Однокомнатной", price: "от 100 руб.", order: 7 },
  { tab: "flats", name: "Двухкомнатной", price: "от 150 руб.", order: 8 },
  { tab: "houses", name: "Генеральная", price: "от 150 руб.", order: 0 },
  { tab: "houses", name: "После ремонта", price: "от 250 руб.", order: 1 },
  { tab: "houses", name: "Коттедж", price: "договорная", order: 2 },
  { tab: "houses", name: "Дача", price: "от 120 руб.", order: 3 },
  { tab: "rooms", name: "Уборка офисов", price: "от 120 руб.", order: 0 },
  { tab: "rooms", name: "Бизнес-центры", price: "договорная", order: 1 },
  { tab: "rooms", name: "Рестораны и кафе", price: "от 150 руб.", order: 2 },
  { tab: "special", name: "После пожара/потопа", price: "договорная", order: 0 },
  { tab: "special", name: "После смерти", price: "договорная", order: 1 },
  { tab: "special", name: "Удаление плесени", price: "от 100 руб.", order: 2 },
  { tab: "windows", name: "Мойка окон", price: "от 80 руб.", order: 0 },
  { tab: "windows", name: "Мойка витрин", price: "от 100 руб.", order: 1 },
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
  { field: "EXTRA" as const, isFixed: true, key: "ozone", label: "Озонирование", value: 25, order: 0 },
  { field: "EXTRA" as const, isFixed: true, key: "generalCleaning", label: "Генеральная уборка", value: 30, order: 1 },
  { field: "EXTRA" as const, isFixed: true, key: "trash", label: "Вывоз мусора", value: 15, order: 2 },
  { field: "EXTRA" as const, isFixed: true, key: "chemistry", label: "Химия", value: 20, order: 3 },
  { field: "EXTRA" as const, isFixed: true, key: "odorRemoval", label: "Устранение запаха", value: 20, order: 4 },
  { field: "EXTRA" as const, isFixed: true, key: "pestControl", label: "Уничтожение насекомых", value: 35, order: 5 },
];

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
  { key: "why-us-reason1", file: "reason1.webp", mimeType: "image/webp" },
  { key: "why-us-reason2", file: "reason2.webp", mimeType: "image/webp" },
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
  console.log(`Seeded ${calculatorOptions.length} calculator options.`);

  if ((await prisma.review.count()) === 0) {
    await prisma.review.createMany({ data: reviews });
    console.log(`Seeded ${reviews.length} reviews.`);
  }

  if ((await prisma.priceRow.count()) === 0) {
    await prisma.priceRow.createMany({ data: priceRows });
    console.log(`Seeded ${priceRows.length} price rows.`);
  }

  if ((await prisma.galleryItem.count()) === 0) {
    for (const item of galleryItems) {
      await prisma.galleryItem.create({
        data: {
          title: item.title,
          meta: item.meta,
          order: item.order,
          beforeUrl: item.beforeUrl,
          afterUrl: item.afterUrl,
        },
      });
    }
    console.log(`Seeded ${galleryItems.length} gallery items.`);
  }

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
