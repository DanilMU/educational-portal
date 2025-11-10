import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/prisma/prisma.module';

import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';

@Module({
	imports: [PrismaModule],
	controllers: [CertificatesController],
	providers: [CertificatesService]
})
export class CertificatesModule {}
