# LifeForge Backend
LifeForge - сервис для работы с таблицами и контентом от клиента

# Список технологий
1. NestJS - Typescript фреймворк для создания серверных приложений
2. Multer - модуль для загрузки файлов с клиента
2. Puppeteer - модуль для создание скриншотов страницы клиента
3. TypeScript - язык программирования
4. MariaDB - база данных
5. Sequelize - ORM для MariaDB
6. Swagger - документация endpoint'ов проекта

# Статус проекта: В разработке

# Как запускать
## Необходимое ПО
Для запуска проекта необходимо установить 
- [NodeJS](https://nodejs.org/en/download)
- [Git](https://git-scm.com/downloads)
- Установить NestJs CLI (npm i -g @nestjs/cli)

## Клонировать проект
```
git clone https://github.com/CosmosForge/server.git
cd server
```

## Установить зависимости
Через pnpm
```
pnpm i
```

или npm
```
npm i
```

или yarn
```
yarn install
```

## Заполнить файл .env
- DB_HOST= *хост бд*
- DB_PORT= *порт базы данных/ 3306*
- DB_USER= *имя юзера*
- DB_PASS= *пароль к юзеру*
- DB_TYPE= *mysql*
- DB_NAME_PRODUCTION= *название созданной бд*
- KEY= *секретный ключ для токена*
- TOKEN_EXPIRATION= *время жизни токена*
- FRONT_URL = *URL для разрешения подключения от фронта*

## Запустить
В обычном режиме
```
nest start
```

или в режиме разработки
```
nest start --watch
```

# Благодарности
- [Дмитрий Крейвальд Валерьевич](https://github.com/DJDims) - за полезные советы, тестирование проекта
- [Юрий Валентинович Мельников](https://github.com/Dew25) - за полезные советы