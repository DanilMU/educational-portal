
# Анализ и план реализации Backend для Образовательного Портала

## 1. Текущее состояние проекта

Проект `backend` представляет собой активно разрабатываемый сервис на NestJS.

**Что уже есть:**
- **Основа NestJS:** Установлены и настроены основные зависимости.
- **База данных:** Настроен `docker-compose.yml` для запуска PostgreSQL.
- **ORM:** Интегрирована Prisma, в `prisma/schema.prisma` определены все модели данных.
- **Модуль аутентификации (`auth`):** Реализована регистрация, вход, JWT-стратегия и защитный guard.
- **Модуль пользователей (`users`):** Создана основа модуля (сервис, контроллер).
- **Конфигурация:** Настроены `ConfigModule`, CORS, Swagger.
- **Инструменты:** Настроены TypeScript, ESLint, Prettier и Jest.

**Чего не хватает:**
- **Модуль пользователей (`users`):** Необходимо завершить реализацию, добавив DTO.
- **Модули прогресса и сертификатов:** `progress` и `certificates` отсутствуют.
- **Вспомогательные модули:** `files` (для загрузки файлов) и `notifications` (для уведомлений) не реализованы.
- **Тестирование:** Юнит- и e2e-тесты для существующей бизнес-логики не написаны.

---

## 2. План реализации на основе `roadmap(back).toml`

Ниже представлена полная структура проекта, которую необходимо реализовать, и детальный план по каждому модулю.

### 2.1. Предлагаемая файловая структура
```
backend/
├── prisma/
│   └── schema.prisma                 # Схема данных Prisma (модели, отношения)
├── src/
│   ├── app.module.ts                 # Главный модуль приложения
│   ├── main.ts                       # Точка входа в приложение
│   │
│   ├── api/
│   │   ├── api.module.ts             # Корневой модуль API
│   │   ├── auth/                     # Модуль аутентификации
│   │   │   ├── auth.controller.ts    # Контроллер аутентификации
│   │   │   ├── auth.module.ts        # Модуль аутентификации
│   │   │   ├── auth.service.ts       # Сервис аутентификации
│   │   │   ├── dto/                  # DTO для аутентификации
│   │   │   │   ├── login.dto.ts      # DTO для логина
│   │   │   │   ├── register.dto.ts   # DTO для регистрации
│   │   │   │   └── index.ts          # Экспорт DTO
│   │   │   └── interfaces/           # Интерфейсы для аутентификации
│   │   │       └── jwt.interface.ts  # Интерфейс JWT полезной нагрузки
│   │   │
│   │   └── users/                    # Модуль пользователей
│   │       ├── dto/                  # DTO для пользователей
│   │       │   ├── get-me.dto.ts
│   │       │   ├── update-auto-renewal.dto.ts
│   │       │   └── index.ts
│   │       ├── users.controller.ts
│   │       ├── users.module.ts
│   │       └── users.service.ts
│   │
│   ├── common/                       # Общие утилиты, декораторы, гварды
│   │   ├── decorators/               # Декораторы
│   │   │   ├── authorized.decorator.ts
│   │   │   ├── protected.decorator.ts
│   │   │   └── index.ts
│   │   ├── guards/                   # Гварды (JWT, Roles)
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── index.ts
│   │   ├── strategies/               # Стратегии Passport.js (JWT)
│   │   │   └── jwt.strategy.ts
│   │   └── utils/                    # Утилиты
│   │       ├── is-dev.util.ts
│   │       └── ms.util.ts
│   │
│   ├── config/                       # Конфигурация приложения
│   │   ├── cors.config.ts
│   │   ├── jwt.config.ts
│   │   ├── swagger.config.ts
│   │   └── index.ts
│   │
│   ├── infra/                        # Инфраструктура (Prisma, Redis и т.д.)
│   │   ├── prisma/                   # Prisma
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   └── infra.module.ts
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
│   └── notifications/          # Модуль уведомлений
│       ├── notifications.module.ts
│       └── notifications.service.ts
│
└── test/
    ├── app.e2e-spec.ts
    └── jest-e2e.json
```

### 2.2. Задачи по модулям

#### **Шаг 1: Настройка Prisma Schema**
- [x] **Задача:** В `prisma/schema.prisma` определить все модели данных: `User`, `Subject` (с необязательным `description`), `Topic`, `Lesson`, `Quiz`, `Question`, `Answer`, `UserProgress`, `Certificate`.

#### **Шаг 2: Модуль аутентификации (`auth`)**
- **Зависимости:** `nestjs/jwt`, `nestjs/passport`, `passport`, `passport-jwt`, `argon2`.
- **Реализация:**
    - [x] `auth.service.ts`: Логика регистрации, входа, валидации пользователя.
    - [x] `auth.controller.ts`: Endpoints для `/login`, `/register`.
    - [x] `strategies/jwt.strategy.ts`: Валидация JWT токена.
    - [x] `guards/jwt-auth.guard.ts`: Guard для защиты роутов.
    - [x] `auth.service.ts`: Реализовать обновление токенов (refresh token).
    - [x] `auth.controller.ts`: Добавить endpoint для `/refresh`.
    - [x] `guards/roles.guard.ts`: Guard для проверки ролей.

#### **Шаг 3: Модуль пользователей (`users`)**
- **Реализация:**
    - [x] `users.service.ts`: CRUD операции для пользователей.
    - [x] `users.controller.ts`: Endpoints для управления пользователями.
    - [x] `dto/`: DTO для создания и обновления пользователя.

#### **Шаг 4: Основные учебные модули (`subjects`, `topics`, `lessons`, `quizzes`)**
- [x] **Реализация:** Для каждого модуля созданы `controller`, `service`, `module` и `dto`.
- [x] **Отношения:** Настроены связи между модулями в `prisma/schema.prisma`.
- [x] **Логика:** Реализованы CRUD-операции для всех модулей, включая полную логику `update` для `quizzes`.
- [x] **`lessons`:** Сервис поддерживает сохранение rich text (HTML) в строковом поле.
- [x] **`quizzes`:** Сервис обрабатывает разные типы вопросов, реализована логика проверки тестов.

#### **Шаг 5: Прогресс и сертификаты (`progress`, `certificates`)**
- [x] **`progress.service.ts`:** Логика для отслеживания прохождения уроков и тестов.
- [ ] **`certificates.service.ts`:**
    - **Зависимость:** `pdf-lib` или `puppeteer` для генерации PDF.
    - **Логика:** Генерация PDF-сертификата по завершении предмета.

---

## 3. Следующие шаги

1.  **Реализовать модули прогресса и сертификатов:** Создать сервисы для отслеживания прогресса и генерации сертификатов (**Шаг 5**).
2.  **Реализовать вспомогательные модули:** Добавить сервисы для работы с файлами и уведомлениями (Шаг 6).
3.  **Написать тесты:** Покрыть реализованную бизнес-логику юнит- и e2e-тестами.

Следующие задачи по плану:

   * Шаг 5: Прогресс и сертификаты (`certificates` модуль)
   * Шаг 6: Вспомогательные модули (`files`, `notifications`)
   * Написание тестов

  Готовы приступить к модулю certificates?