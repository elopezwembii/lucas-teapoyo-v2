import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ProtectedIntegration } from 'src/auth/guards/protected-integration.guard';

export const Protected = () => applyDecorators(UseGuards(ProtectedIntegration));
