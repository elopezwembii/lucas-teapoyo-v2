import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    console.log(configService.get('JWT_SECRET') );
  }
  async validate(payload: any): Promise<any> {
    if (!payload) throw new UnauthorizedException('Token no valido');
    // if (!payload.verifiedAccountCheck)
    //   throw new UnauthorizedException(
    //     'El usuario está inactivo, Contacta con el administrador.',
    //   );
    if (payload) return payload;
    return payload;
  }
}
