import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';

@Module({})
export class SharedModule {
  imports: [AuthModule];
}
