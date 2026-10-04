import type { Strings } from './en';

export const ru: Strings = {
  scan: {
    permissionTitle: 'Доступ к камере',
    permissionBody: 'Камера нужна только чтобы считывать штрихкоды на товарах. Фотографии не делаются.',
    permissionButton: 'Разрешить камеру',
    permissionDenied: 'Доступ к камере выключен. Включите его в настройках телефона.',
    openSettings: 'Открыть настройки',
    hint: 'Наведите камеру на штрихкод',
  },
  lookup: {
    searching: 'Ищем…',
    networkError: 'Не удалось связаться с базой товаров. Проверьте интернет.',
    retry: 'Повторить',
    enterManually: 'Ввести вручную',
    cancel: 'Отмена',
  },
  confirm: {
    title: 'Это он?',
    yes: 'Да, это он',
    no: 'Нет, ввести вручную',
    source: 'Данные о товаре: Open Food Facts',
  },
  form: {
    notFound: 'Этого штрихкода мы пока не знаем. Введите данные сами.',
    name: 'Название',
    brand: 'Бренд',
    quantity: 'Вес или объём',
    rating: 'Ваша оценка',
    comment: 'Комментарий',
    commentPlaceholder: 'Что понравилось или не понравилось?',
    save: 'Сохранить',
    nameRequired: 'Введите название',
    ratingRequired: 'Поставьте оценку',
    cancel: 'Отмена',
  },
  item: {
    title: 'Ваша оценка',
    noComment: 'Без комментария',
    edit: 'Изменить',
    scanNext: 'Сканировать дальше',
  },
};
