import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { IntegrationService } from 'src/auth/integration.service';

@Injectable()
export class ProtectedIntegration implements CanActivate {
  constructor(private readonly integrationService: IntegrationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Clave de API requerida.');

    const apiKey = authHeader.split('Bearer ')[1].trim();
    if (!apiKey) throw new UnauthorizedException('Clave de API requerida.');

    const integration = await this.integrationService.findOne(apiKey);
    if (!integration) throw new UnauthorizedException('Clave de API inválida.');

    return true;
  }
}
