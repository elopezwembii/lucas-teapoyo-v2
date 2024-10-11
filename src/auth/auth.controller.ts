import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateIntegrationDto } from './dto/create-integration.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('generate-api-key')
  create(@Body() createAuthDto: CreateIntegrationDto) {
    return this.authService.create(createAuthDto);
  }
}
