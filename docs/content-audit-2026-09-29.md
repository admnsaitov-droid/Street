# Аудит контента Strapi — 29.09.2026

Источник: продакшн API (www.streetbarbell.com → admin.streetbarbell.com), все 5 локалей (en/es/fr/de/fi), 129 продуктов, 10 линеек, 3 пакета, 15 страниц.

## 1. Продукты с проблемами локализации записей (страница сломана/пустая в локали)

- **mb-779-flat-chest-press** — запись существует только в EN; в es/fr/de/fi API возвращает пустоту → страница продукта в этих локалях без данных (и без 3D-модели).

## 2. 3D-модели

- **mb-763-shoulder-press** — 3D-модель не привязана ни в одной локали (model3D пуст) — не прокинуто в Strapi.
- Все остальные 128 моделей: файлы существуют (HTTP 200), размер нормальный (~1–2 МБ, суммарно 188 МБ).
- У mb-779-flat-chest-press модель есть только в EN (см. п.1).

## 3. Неправильные изображения (references/галерея/превью)

Сверка номера модели в имени файла с номером модели продукта:

| Линейка | Продукт | Модель | Стоят изображения от | Где |
|---|---|---|---|---|
| Light | mb-769-pull-down-bar | MB 7.69 | **MB 7.70** | галерея, превью |
| Light | mb-770-seated-row | MB 7.70 | **MB 7.69** | галерея, превью |
| Light | mb-772-dumbell-set-heavy | MB 7.72 | **MB 7.71** (лёгкий сет) | references, галерея, превью |
| Pro | mb-7103-inclined-leverage-row | MB 7.103 | **MB 7.102** | references, галерея, превью |
| Kids | mb-7061-leg-press-for-kids | MB 7.06.1 | **MB 7.06** (взрослый) | references, галерея, превью |

MB 7.69 ↔ MB 7.70 перепутаны местами. Кросс-локальных расхождений нет (изображения одинаковы во всех локалях).

## 4. Продукты вообще без блока References (swiperMedias пуст) — 58 шт.

- **sb-cardio-line** (3): mb-780-upright-bike, mb-781-elliptical-trainer, mb-782-recumbent-bike
- **sb-gymnastic-line** (1): mb-708-stepper
- **sb-light-line** (2): mb-777-well-machine, mb-786-squat-platform
- **sb-plus-line** (9): mb-7293-shoulder-press, mb-7303-chest-press, mb-7313-butterfly, mb-7373-row, mb-7383-lat-pull, mb-7393-biceps-curl, mb-7423-triceps, mb-7473-multi-trainer, mb-7563-incline-chest-press
- **sb-standard-line** (25): mb-729-vertical-press, mb-730-vertical-press, mb-731-butterfly, mb-732-reverse-butterfly, mb-733-dumbbell-set-light, mb-734-dumbbell-set-heavy, mb-737-standing-row, mb-738-lat-pull, mb-739-biceps-curl, mb-740-squat, mb-741-combo-lift, mb-742-overhead-triceps, mb-743-leg-curl, mb-744-leg-extension, mb-745-standing-glute-press, mb-746-rope-pull-down, mb-747-multi-workout-station, mb-748-the-roof, mb-749-outer-thigh, mb-750-inner-thigh, mb-751-abdominal-crunch, mb-752-converging-chest-press, mb-753-divergent-standing-row, mb-754-convergent-vertical-press, mb-755-divergent-lat-pull
- **sb-workout-line** (18): mb-7601-horizontal-ladder-type-a, mb-76010-combined-wall-pull-and-parallel-bars, mb-76011-horizontal-ladder-type-d, mb-76013-horizontal-ladder-type-e, mb-76014-horizontal-ladder-type-f, mb-76015-combined-pull-up-and-wall-bars, mb-76016-horizontal-ladder-type-g, mb-76017-horizontal-ladder-type-h, mb-76018-three-level-pull-up-bars, mb-76019-wall-bars, mb-7602-horizontal-ladder-type-b, mb-7603-horizontal-ladder-type-c, mb-7604-wall-bars, mb-7605-low-parallel-bars, mb-7606-parallel-bars, mb-7607-australian-pull-up-bars, mb-7608-pull-up-bars-set, mb-7609-uneven-pull-up-and-parallel-bars

## 5. Переводы

### 5.1 Английский текст в неанглийских локалях (реальные баги)

- **Страница дистрибьютеров**: описания ~25 локаций (`locations[].description`) — английские во всех локалях es/fr/de/fi. Судя по всему, поле не локализовано в Strapi вовсе.
- **Контакты (es, fr)**: `getInTouchBlock.description`, `contactForm.mailErrorText`, `contactForm.phoneErrorText`, `metadata.metadescription` — на английском. (Это то, что было замечено на испанской версии контактов.)
- **Контакты (es, de)**: `note` и `policyText` в локализациях — на английском.

### 5.2 Непереведённые целиком юридические страницы (fr/de/fi)

- Privacy Policy — 28 блоков текста = EN в fr/de/fi
- Terms of Use — 52 блока = EN в fr/de/fi
- Cookie Policy — 11 блоков = EN в fr/de/fi
(в es эти страницы переведены)

### 5.3 Прочее непереведённое (все 4 локали, если не указано)

- **page:home** [es…]: 15 полей = EN, напр.: linesBlock.lines[3].linii.products[8].name, linesBlock.lines[3].linii.products[9].name, linesBlock.lines[3].linii.products[11].name, linesBlock.lines[3].linii.products[13].previewDescription
- **page:about** [es…]: 2 полей = EN, напр.: aboutPage.history.mediaMain.poster.name, aboutPage.history.mediaSecondary.poster.name
- **page:distribution-page** [es…]: 3 полей = EN, напр.: distributionPage.locations[35].description, distributionPage.locations[38].description, distributionPage.locations[43].locationItem
- **page:footer** [es…]: 1 полей = EN, напр.: data.companyData.adress
- **page:packages** [es…]: 2 полей = EN, напр.: package[0].lines[0].produkties[6].productInfo.musclesDescription, package[1].lines[0].produkties[3].productInfo.musclesDescription
- **page:projects-page** [es…]: 55 полей = EN, напр.: projectsPage.markers[1].address, projectsPage.markers[4].address, projectsPage.markers[5].address, projectsPage.markers[6].address
- **page:news-page** [es…]: 1 полей = EN, напр.: newsPage.metadata.metadescription
- **page:lines** [es…]: 18 полей = EN, напр.: linesPageData.lines[4].linii.products[8].name, linesPageData.lines[4].linii.products[9].name, linesPageData.lines[4].linii.products[11].name, linesPageData.lines[4].linii.products[13].previewDescription
- **line:sb-boxing-line** [es…]: 1 полей = EN, напр.: products[2].name
- **line:sb-eco-line** [es…]: 2 полей = EN, напр.: lineContent.description, products[3].name
- **line:sb-gymnastic-line** [es…]: 1 полей = EN, напр.: products[1].name
- **line:sb-kids-line** [es…]: 6 полей = EN, напр.: products[0].swiperMedias[1].poster.name, products[1].swiperMedias[1].poster.name, products[2].swiperMedias[1].poster.name, products[3].swiperMedias[4].poster.name
- **line:sb-pro-line** [es…]: 2 полей = EN, напр.: description, lineContent.description
- **line:sb-workout-line** [es…]: 24 полей = EN, напр.: products[8].name, products[9].name, products[9].productImages[0].name, products[10].productImages[0].name
- **product:mb-7-02-1-walker-for-kids** [es…]: 1 полей = EN, напр.: swiperMedias[4].poster.name
- **product:mb-703-combined-pull-down-and-leg-raise-station** [es…]: 1 полей = EN, напр.: name
- **product:mb-7071-pendulum-for-kids** [es…]: 1 полей = EN, напр.: swiperMedias[1].poster.name
- **product:mb-7081-stepper-for-kids** [es…]: 1 полей = EN, напр.: swiperMedias[1].poster.name
- **product:mb-7091-twister-for-kids** [es…]: 1 полей = EN, напр.: swiperMedias[1].poster.name
- **product:mb-7100-crossover** [es…]: 4 полей = EN, напр.: productImages[0].name, productImages[1].name, productImages[2].name
- **product:mb-7103-inclined-leverage-row** [es…]: 4 полей = EN, напр.: productImages[0].name, swiperMedias[0].poster.name, swiperMedias[1].poster.name
- **product:mb-7111-ski-walker-for-kids** [es…]: 1 полей = EN, напр.: swiperMedias[1].poster.name
- **product:mb-7221-legs-spreading-for-kids** [es…]: 1 полей = EN, напр.: swiperMedias[1].poster.name
- **product:mb-743-leg-curl** [es…]: 1 полей = EN, напр.: productInfo.productDescriptionSection[0].text
- **product:mb-76010-combined-wall-pull-and-parallel-bars** [es…]: 3 полей = EN, напр.: name, productImages[0].name
- **product:mb-76011-horizontal-ladder-type-d** [es…]: 2 полей = EN, напр.: productImages[0].name
- **product:mb-76012-combined-horizontal-ladder-wall-and-uneven-pull-up** [es…]: 3 полей = EN, напр.: name, productImages[0].name
- **product:mb-76013-horizontal-ladder-type-e** [es…]: 2 полей = EN, напр.: productImages[0].name
- **product:mb-76014-horizontal-ladder-type-f** [es…]: 5 полей = EN, напр.: previewDescription, productImages[0].name, productInfo.description, productInfo.descriptionMain
- **product:mb-76015-combined-pull-up-and-wall-bars** [es…]: 2 полей = EN, напр.: productImages[0].name
- **product:mb-76016-horizontal-ladder-type-g** [es…]: 2 полей = EN, напр.: productImages[0].name
- **product:mb-76017-horizontal-ladder-type-h** [es…]: 2 полей = EN, напр.: productImages[0].name
- **product:mb-76018-three-level-pull-up-bars** [es…]: 2 полей = EN, напр.: productImages[0].name
- **product:mb-76019-wall-bars** [es…]: 2 полей = EN, напр.: productImages[0].name
- **product:mb-7609-uneven-pull-up-and-parallel-bars** [es…]: 1 полей = EN, напр.: name
- **product:mb-767-seated-dips** [es…]: 1 полей = EN, напр.: swiperMedias[0].poster.name
- **product:mb-768-multi-bar** [es…]: 1 полей = EN, напр.: productInfo.musclesDescription
- **product:mb-774-leg-press** [es…]: 3 полей = EN, напр.: productImages[0].name, productImages[1].name
- **product:mb-775-incline-bench-press-at-a-45-degree-angle** [es…]: 4 полей = EN, напр.: name, productImages[0].name, productImages[1].name
- **product:mb-788-adjustable-hyperextension-machine** [es…]: 1 полей = EN, напр.: name
- **product:mb-790-adjustable-resistance-multi-station** [es…]: 1 полей = EN, напр.: name
- **product:mb-793-multi-station-punching-bag-stand** [es…]: 1 полей = EN, напр.: name
- **product:mb-794-adjustable-hyperextenstion-bench** [es…]: 1 полей = EN, напр.: name
- **product:mv-775-incline-bench-press-at-a-45-degree-angle** [es…]: 1 полей = EN, напр.: name
- **package:large** [es…]: 1 полей = EN, напр.: package.lines[0].produkties[6].productInfo.musclesDescription
- **package:medium** [es…]: 1 полей = EN, напр.: package.lines[0].produkties[3].productInfo.musclesDescription

*Примечание: имена продуктов (product name) могут намеренно оставаться английскими — отфильтруйте по смыслу. Крупнейшие кластеры: sb-workout-line (24 поля описаний перекладин/лестниц), projects-page (55 полей — заголовки и адреса маркеров), home/lines (описания и превью продуктов Cardio-линейки).*

### 5.4 Ложные срабатывания проверены вручную

- Тексты Light-линейки на французском корректны (детектор путал fr/es) — реальных «не тот язык» кроме англ. описаний дистрибьютеров не найдено.

## 6. Тяжёлые медиа (главная причина медленной отдачи)

| Файл | Размер | Где |
|---|---|---|
| FEDOR SITE 1080 (1).mp4 | 50.5 MB | видео на главной |
| About us.MOV | 42.1 MB | About (QuickTime .MOV — может не играть в части браузеров, перекодировать в mp4/h264!) |
| DSC09929.png | 22.9 MB | фото |
| Bg Distributor.jpg / Bg Distrib2.jpg | 15.7 / 13.9 MB | фоны |
| BG Main.png | 7.9 MB | фон главной |
| Man *.png (схемы мышц) | ~6 MB × ~20 шт | страницы продуктов |

Всего 77 файлов тяжелее 2 МБ (540 МБ). Рекомендация: перекодировать видео (h264/webm, ~5–8 МБ), PNG → WebP/AVIF.
