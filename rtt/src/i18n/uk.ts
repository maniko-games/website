import type { Strings } from './en';

export const uk: Strings = {
  scan: {
    permissionTitle: 'Доступ до камери',
    permissionBody: 'Камера потрібна лише щоб зчитувати штрихкоди на товарах. Фотографії не робляться.',
    permissionButton: 'Дозволити камеру',
    permissionDenied: 'Доступ до камери вимкнено. Увімкніть його в налаштуваннях телефона.',
    openSettings: 'Відкрити налаштування',
    hint: 'Наведіть камеру на штрихкод',
  },
  lookup: {
    searching: 'Шукаємо…',
    networkError: 'Не вдалося зв’язатися з базою товарів. Перевірте інтернет.',
    retry: 'Повторити',
    enterManually: 'Ввести вручну',
    cancel: 'Скасувати',
  },
  confirm: {
    title: 'Це він?',
    yes: 'Так, це він',
    no: 'Ні, ввести вручну',
    source: 'Дані про товар: Open Food Facts',
  },
  form: {
    notFound: 'Цього штрихкоду ми поки не знаємо. Введіть дані самі.',
    name: 'Назва',
    brand: 'Бренд',
    quantity: 'Вага або об’єм',
    rating: 'Ваша оцінка',
    comment: 'Коментар',
    commentPlaceholder: 'Що сподобалось чи не сподобалось?',
    save: 'Зберегти',
    nameRequired: 'Введіть назву',
    ratingRequired: 'Поставте оцінку',
    cancel: 'Скасувати',
  },
  item: {
    title: 'Ваша оцінка',
    noComment: 'Без коментаря',
    edit: 'Змінити',
    scanNext: 'Сканувати далі',
  },
};
