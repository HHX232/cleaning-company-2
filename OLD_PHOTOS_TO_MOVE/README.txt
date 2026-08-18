Файлы-кандидаты на замену старыми не удалены, а перечислены здесь. Переместите их из репозитория (или удалите) вручную перед пушем, если согласны с заменами.

Полностью не используются нигде в seedData.ts/homeImageDefaults.ts (можно смело убирать):
- public/images/services/windows-apartment.webp
- public/images/services/windows-house.webp
- public/images/services/apt-general.webp
- public/images/services/apt-renovation.webp
- public/images/posters/pexels-tima-miroshnichenko-6195290.webp (старое фото 1 блока "Причины заказать уборку")
- public/images/posters/pexels-ron-lach-10573241.webp (старое фото 2 блока "Причины заказать уборку")
- public/images/portfolio/metal-before.webp / metal-after.webp
- public/images/portfolio/flood-before.webp / flood-after.webp
- public/images/portfolio/death-before.webp / death-after.webp
- public/images/portfolio/tile-before.webp / tile-after.webp
  (старые 4 примера в блоке "Примеры работ" — заменены на 35 новых пар в
  public/images/portfolio/work/, загруженных заказчиком)

Не используется кодом (не путать с "можно удалять" выше — это просто исходники,
не мусор): public/images/portfolio/new/ — 70 сырых JPG от заказчика (35 пар
до/после), из них сделаны финальные webp в public/images/portfolio/work/. Сами
JPG можно оставить как архив или убрать при переносе — на сайт они не влияют.

То же самое для public/images/portfolio/windows_new/ — 34 сырых JPG (17 пар
до/после для портфолио мойки окон), финальные webp сделаны в
public/images/portfolio/windows-work/. Исходники можно оставить как архив.

Не трогать: public/images/services/spec-extreme.webp — всё ещё используется
6 страницами категории "Спецуборка" (эти страницы пока не менялись, фото для
них позже пришлёт заказчик).

Переиспользованы, а не удалены: public/images/services/com-industrial.webp и
public/images/services/windows-office.webp раньше были "лишними" фото услуг,
теперь стали фото-дефолтами слайдов 2 и 5 блока "Причины заказать уборку" —
их удалять не нужно, они снова в деле.
