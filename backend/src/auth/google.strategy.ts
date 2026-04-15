import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    config: ConfigService,
  ) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: config.get<string>('GOOGLE_CALLBACK_URL')!,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const user = await this.authService.validateGoogleUser({
        googleId: profile.id,
        email: profile.emails[0].value,
        displayName: profile.displayName,
        avatarUrl: profile.photos?.[0]?.value,
      });
      done(null, user);
    } catch {
      // Email not in allowlist — pass false to signal auth failure
      done(null, false);
    }
  }
}
