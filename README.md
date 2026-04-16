# 📋 User Service API

## ⚠️ Важное примечание о безопасности

Все секретные данные (ключи, токены, пароли), представленные в коде (например,
JWT_SECRET), используются исключительно для демонстрации и тестирования. В
реальном проекте я бы хранил эти данные в:

- В переменных окружения (.env).
- Никогда бы не закомитил секреты в репозиторий.
- Для production скорее всего использовался бы менеджер секретов.

## 🚀 Запуск сервера

### Требования

- Node.js (версия 18 или выше)
- PostgreSQL (версия 14 или выше)
- npm или yarn

### Установка и запуск

#### 1. Клонировать репозиторий

- `git clone <repository-url>`
- `cd <project-directory>`

#### 2. Установить зависимости

`npm install`

#### 3. Настроить переменные окружения

Создайте .env файл и заполните его по примеру из .env-example

##### `Пример заполненных данных`

- `PORT=3000`
- `DATABASE_URL="postgresql://postgres:123456@localhost:5432/test-db?schema=public"`
- `JWT_SECRET="HROQx6dTIAE8nbGOyczv2oGdT9jEyQNGSrnLEm76Now"`

#### 4. Применить миграции базы данных

`npx prisma migrate deploy`

#### 5. Сгенерировать Prisma Client

`npx prisma generate`

#### 6. Запустить сервер в режиме разработки

`npm run dev`

#### Или собрать и запустить в production режиме

- `npm run build`
- `npm start`

## Используемые технологии:

| Технология     | Назначение                       |
| -------------- | -------------------------------- |
| Node.js        | Среда выполнения JavaScript      |
| Express        | Веб-фреймворк                    |
| TypeScript     | Типизированный JavaScript        |
| Prisma         | ORM для работы с БД              |
| PostgreSQL     | Реляционная база данных          |
| Passport.js    | Аутентификация (JWT стратегия)   |
| JSON Web Token | Создание и верификация JWT       |
| bcrypt         | Хэширование паролей              |
| Zod            | Валидация данных                 |
| dotenv         | Управление переменными окружения |

## Функциональность приложения

| Функциональность                                                | Статус |
| --------------------------------------------------------------- | ------ |
| Регистрация пользователя                                        | ✅     |
| Авторизация пользователя (JWT)                                  | ✅     |
| Получение пользователя по ID (админ или владелец)               | ✅     |
| Получение списка пользователей (только админ)                   | ✅     |
| Блокировка пользователя (админ или владелец)                    | ✅     |
| Разблокировка пользователя (админ)                              | ✅     |
| Модель пользователя (ФИО, дата, email, пароль, роль, статус)    | ✅     |
| TypeScript                                                      | ✅     |
| Express(фреймворк) + Prisma(ORM) + PostgreSQL(субд) без nest js | ✅     |

## 📚 Документация API

#### Базовый URL

`http://localhost:PORT/api/user`

#### Общие заголовки

Для защищенных endpoint'ов требуется передавать JWT токен:

`Authorization: Bearer <your-jwt-token>`

### 1. Регистрация пользователя

#### Endpoint: POST /registration

Описание: Создает нового пользователя со статусом INACTIVE

##### Тело запроса(пример):

```
{
  "firstName": "Иван",
  "lastName": "Иванов",
  "middleName": "Иванович",
  "birthday": "1990-01-01T00:00:00.000Z",
  "email": "ivan@example.com",
  "password": "password123"
}
```

middleName(отчество) - необязательное поле

##### Ответ (201 Created):

```
{
  "success": true,
  "data": {
    "user": {
      "id": "ckl8j3h4k0000abc123",
      "firstName": "Иван",
      "lastName": "Иванов",
      "middleName": "Иванович",
      "birthday": "1990-01-01T00:00:00.000Z",
      "email": "ivan@example.com",
      "role": "USER",
      "status": "INACTIVE",
      "createAt": "2024-01-01T12:00:00.000Z"
    },
    "message": "Регистрация успешна. Подтвердите email для активации аккаунта."
  }
}
```

### 2. Авторизация пользователя

#### Endpoint: POST /auth

Описание: Аутентифицирует пользователя и возвращает JWT токен

##### Тело запроса(пример):

```
{
  "email": "ivan@example.com",
  "password": "password123"
}
```

##### Ответ (200 OK):

```
{
  "success": true,
  "data": {
    "user": {
      "id": "ckl8j3h4k0000abc123",
      "firstName": "Иван",
      "lastName": "Иванов",
      "middleName": "Иванович",
      "birthday": "1990-01-01T00:00:00.000Z",
      "email": "ivan@example.com",
      "role": "USER",
      "status": "ACTIVE",
      "createAt": "2024-01-01T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "message": "Вход выполнен успешно"
  }
}
```

### 3. Получение списка пользователей

#### Endpoint: GET /getAllUsers

Описание: Возвращает список всех пользователей. Доступно только администраторам.

##### Ответ (200 OK):

```
{
  "success": true,
  "data": [
    {
      "id": "ckl8j3h4k0000abc123",
      "firstName": "Иван",
      "lastName": "Иванов",
      "middleName": "Иванович",
      "birthday": "1990-01-01T00:00:00.000Z",
      "email": "ivan@example.com",
      "role": "USER",
      "status": "ACTIVE",
      "createAt": "2024-01-01T12:00:00.000Z",
      "updateAt": "2024-01-01T12:00:00.000Z",
      "banAt": null
    }
  ]
}
```

### 4. Получение пользователя по ID

#### Endpoint: GET /getUserById/:userId

Описание: Возвращает данные пользователя. Доступно администратору или самому
пользователю.

##### Ответ (200 OK):

```
{
  "success": true,
  "data": {
    "id": "ckl8j3h4k0000abc123",
    "firstName": "Иван",
    "lastName": "Иванов",
    "middleName": "Иванович",
    "birthday": "1990-01-01T00:00:00.000Z",
    "email": "ivan@example.com",
    "role": "USER",
    "status": "ACTIVE",
    "createAt": "2024-01-01T12:00:00.000Z",
    "updateAt": "2024-01-01T12:00:00.000Z",
    "banAt": null
  }
}
```

### 5. Блокировка пользователя

#### Endpoint: POST /blockedUser/:userId

Описание: Блокирует пользователя. Доступно администратору или самому
пользователю. `Внимание`: пользователь с ролью USER может блокировать только
себя!

##### Ответ (200 OK):

```
{
  "success": true,
  "data": {
    "user": {
      "id": "ckl8j3h4k0000abc123",
      "firstName": "Иван",
      "lastName": "Иванов",
      "email": "ivan@example.com",
      "role": "USER",
      "status": "INACTIVE",
      "banAt": "2024-01-15T10:30:00.000Z"
    },
    "message": "Пользователь успешно заблокирован"
  }
}
```

### 6. Разблокировка пользователя

#### Endpoint: POST /unBlockedUser/:userId

Описание: Разблокирует пользователя. Доступно только администратору.

##### Ответ (200 OK):

```
{
  "success": true,
  "data": {
    "user": {
      "id": "ckl8j3h4k0000abc123",
      "firstName": "Иван",
      "lastName": "Иванов",
      "email": "ivan@example.com",
      "role": "USER",
      "status": "ACTIVE"
    },
    "message": "Пользователь успешно разблокирован"
  }
}
```

### 🏥 Health Check

#### Endpoint: GET /health

Описание: Проверка работоспособности сервера

##### Ответ (200 OK):

```
{
  "status": "OK",
  "timestamp": "2026-04-16T10:30:00.000Z",
  "service": "effective-mobile"
}
```
