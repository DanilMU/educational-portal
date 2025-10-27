
# Анализ и план реализации Backend для Образовательного Портала

## 1. Текущее состояние проекта

Проект `backend` представляет собой базовую заготовку на NestJS.

**Что уже есть:**
- **Основа NestJS:** Установлены и настроены основные зависимости (`@nestjs/core`, `@nestjs/common`).
- **База данных:** Настроен `docker-compose.yml` для запуска PostgreSQL.
- **ORM:** Интегрирована Prisma, есть файл `prisma/schema.prisma`, но он пока не содержит моделей.
- **Конфигурация:** Создан `ConfigModule` для управления переменными окружения.
- **Инструменты:** Настроены TypeScript, ESLint, Prettier и Jest для разработки и тестирования.

**Чего не хватает:**
Проект находится на начальной стадии. Отсутствуют все ключевые бизнес-модули, описанные в `roadmap(back).toml`. Нет моделей данных, бизнес-логики, контроллеров и механизмов аутентификации.

---

## 2. План реализации на основе `roadmap(back).toml`

Ниже представлена полная структура проекта, которую необходимо реализовать, и детальный план по каждому модулю.

### 2.1. Предлагаемая файловая структура

```
backend/
├── prisma/
│   └── schema.prisma         # Схема данных Prisma (модели, отношения)
├── src/
│   ├── app.module.ts           # Главный модуль приложения
│   ├── main.ts                 # Точка входа в приложение
│   │
│   ├── auth/                   # Модуль аутентификации
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   ├── guards/             # Guards (JWT, Roles)
│   │   └── strategies/         # Passport.js стратегии (JWT)
│   │
│   ├── users/                  # Модуль пользователей
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   │
│   ├── subjects/               # Модуль предметов
│   │   ├── subjects.module.ts
│   │   ├── subjects.controller.ts
│   │   ├── subjects.service.ts
│   │   └── dto/
│   │
│   ├── topics/                 # Модуль тем
│   │   ├── topics.module.ts
│   │   ├── topics.controller.ts
│   │   ├── topics.service.ts
│   │   └── dto/
│   │
│   ├── lessons/                # Модуль уроков
│   │   ├── lessons.module.ts
│   │   ├── lessons.controller.ts
│   │   ├── lessons.service.ts
│   │   └── dto/
│   │
│   ├── quizzes/                # Модуль тестов
│   │   ├── quizzes.module.ts
│   │   ├── quizzes.controller.ts
│   │   ├── quizzes.service.ts
│   │   └── dto/
│   │
│   ├── progress/               # Модуль прогресса
│   │   ├── progress.module.ts
│   │   ├── progress.controller.ts
│   │   ├── progress.service.ts
│   │   └── dto/
│   │
│   ├── certificates/           # Модуль сертификатов
│   │   ├── certificates.module.ts
│   │   ├── certificates.controller.ts
│   │   ├── certificates.service.ts
│   │   └── dto/
│   │
│   ├── files/                  # Модуль для работы с файлами
│   │   ├── files.module.ts
│   │   ├── files.service.ts
│   │   └── files.controller.ts
│   │
│   ├── notifications/          # Модуль уведомлений
│   │   ├── notifications.module.ts
│   │   └── notifications.service.ts
│   │
│   ├── common/                 # Общие компоненты
│   │   ├── decorators/         # Декораторы (e.g., User, Roles)
│   │   └── interfaces/         # Глобальные интерфейсы
│   │
│   └── config/                 # Файлы конфигурации
│       ├── cors.config.ts
│       └── index.ts
│
└── test/
    ├── app.e2e-spec.ts
    └── jest-e2e.json
```

### 2.2. Задачи по модулям

#### **Шаг 1: Настройка Prisma Schema**
- **Задача:** В `prisma/schema.prisma` определить все модели данных: `User`, `Subject`, `Topic`, `Lesson`, `Quiz`, `Question`, `Answer`, `UserProgress`, `Certificate`.
- **Пример:**
  ```prisma
  model User {
    id        Int      @id @default(autoincrement())
    email     String   @unique
    password  String
    role      Role     @default(STUDENT)
    // ... другие поля и отношения
  }

  enum Role {
    STUDENT
    ADMIN
    MODERATOR
  }
  ```

#### **Шаг 2: Модуль аутентификации (`auth`)**
- **Зависимости:** `nestjs/jwt`, `nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`.
- **Реализация:**
    - `auth.service.ts`: Логика регистрации, входа, валидации пользователя, создания и обновления токенов (access, refresh).
    - `auth.controller.ts`: Endpoints для `/login`, `/register`, `/refresh`.
    - `strategies/jwt.strategy.ts`: Валидация JWT токена.
    - `guards/jwt-auth.guard.ts`: Guard для защиты роутов.
    - `guards/roles.guard.ts`: Guard для проверки ролей.

#### **Шаг 3: Модуль пользователей (`users`)**
- **Реализация:**
    - `users.service.ts`: CRUD операции для пользователей.
    - `users.controller.ts`: Endpoints для управления пользователями (доступ для администраторов).
    - `dto/`: DTO для создания и обновления пользователя.

#### **Шаг 4: Основные учебные модули (`subjects`, `topics`, `lessons`, `quizzes`)**
- **Реализация:** Для каждого модуля создать `controller`, `service`, `module` и `dto`.
    - **Логика:** Реализовать CRUD-операции.
    - **Отношения:** Настроить связи между модулями (Subject -> Topics -> Lessons -> Quizzes).
    - **`lessons`:** Сервис должен поддерживать сохранение rich text.
    - **`quizzes`:** Сервис должен обрабатывать разные типы вопросов.

#### **Ша- 5: Прогресс и сертификаты (`progress`, `certificates`)**
- **`progress.service.ts`:** Логика для отслеживания прохождения уроков и тестов.
- **`certificates.service.ts`:**
    - **Зависимость:** `pdf-lib` или `puppeteer` для генерации PDF.
    - **Логика:** Генерация PDF-сертификата по завершении предмета.

#### **Шаг 6: Вспомогательные модули (`files`, `notifications`)**
- **`files.service.ts`:**
    - **Зависимость:** `@aws-sdk/client-s3` (для Selectel S3 API).
    - **Логика:** Загрузка, удаление и получение файлов.
- **`notifications.service.ts`:**
    - **Зависимости:** `resend`, `node-telegram-bot-api`.
    - **Логика:** Сервис для отправки email и сообщений в Telegram.

---

## 3. Следующие шаги

1.  **Установить зависимости:** Добавить в `package.json` все необходимые пакеты.
2.  **Определить модели:** Заполнить `prisma/schema.prisma`.
3.  **Создать модули:** Последовательно создавать каждый модуль, начиная с `auth` и `users`.
4.  **Написать тесты:** Параллельно с разработкой покрывать логику юнит- и e2e-тестами.
