import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
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
  { stars: 5, text: "[отзыв клиента о качестве и скорости уборки]", service: "Генеральная уборка квартиры", order: 0 },
  { stars: 5, text: "[отзыв клиента о работе после потопа]", service: "Уборка после происшествия", order: 1 },
  { stars: 5, text: "[отзыв клиента о мойке окон и витрин]", service: "Мойка окон", order: 2 },
  { stars: 5, text: "[отзыв клиента об уборке после ремонта]", service: "Уборка после ремонта", order: 3 },
  { stars: 5, text: "[отзыв клиента об уборке дома]", service: "Генеральная уборка дома", order: 4 },
  { stars: 5, text: "[отзыв клиента об уборке офиса]", service: "Уборка офиса", order: 5 },
  { stars: 5, text: "[отзыв клиента о поддерживающей уборке]", service: "Поддерживающая уборка", order: 6 },
  { stars: 5, text: "[отзыв клиента об уборке запущенной квартиры]", service: "Уборка запущенной квартиры", order: 7 },
  { stars: 5, text: "[отзыв клиента об удалении плесени]", service: "Удаление плесени", order: 8 },
  { stars: 5, text: "[отзыв клиента о срочной уборке перед заездом]", service: "Срочная уборка", order: 9 },
];

const adminEmail = "6380311jurasik@gmail.com";

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
      await prisma.galleryItem.create({ data: { title: item.title, meta: item.meta, order: item.order } });
    }
    console.log(`Seeded ${galleryItems.length} gallery items.`);
  }

  await prisma.aboutPage.upsert({
    where: { id: "about" },
    update: {},
    create: { id: "about", ...ABOUT_DEFAULTS },
  });
  console.log("Seeded About page (create-if-missing).");

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const password = randomBytes(9).toString("base64url");
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email: adminEmail, passwordHash, role: "ADMIN" } });
    console.log(`Seeded admin user. Login at /admin/login with:`);
    console.log(`  email:    ${adminEmail}`);
    console.log(`  password: ${password}`);
    console.log(`(Change this password after first login — there's no self-service change yet.)`);
  } else {
    console.log(`Admin user ${adminEmail} already exists, left untouched.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
