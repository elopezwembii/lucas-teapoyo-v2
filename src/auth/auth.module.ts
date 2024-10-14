import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Integration, IntegrationSchema } from './entities/integration.entity';
import { IntegrationService } from './integration.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '60s' },
    }),
    MongooseModule.forFeature(
      [
        {
          name: Integration.name,
          schema: IntegrationSchema,
        },
      ],
      'general',
    ),
  ],
  providers: [AuthService, JwtStrategy, IntegrationService],
  exports: [AuthService, IntegrationService],
  controllers: [AuthController],
})
export class AuthModule {}
