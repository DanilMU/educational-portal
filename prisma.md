У меня есть старый проект Payment у него имеется следующая структура я хочу чтобы ты адаптировал её под наш проект education-platform

payment/backend/src/infra/
├── prisma/
│ ├── data/
│ │ ├── index.ts
│ │ └── plans.data.ts
│ ├── prisma.module.ts
│ ├── prisma.seed.ts
│ └── prisma.service.ts
└── infra.module.ts

### Описание файлов:

- **`prisma/data/plans.data.ts`** - данные тарифных планов
- **`prisma/data/index.ts`** - экспорт данных
- **`prisma/prisma.seed.ts`** - сиды для базы данных
- **`prisma/prisma.service.ts`** - сервис для работы с Prisma
- **`prisma/prisma.module.ts`** - модуль Prisma
- **`infra.module.ts`** - корневой модуль инфраструктуры
