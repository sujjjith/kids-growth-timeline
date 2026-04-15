import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req: Request, @Res() res: Response) {
    const frontendUrl =
      this.config.get<string>('FRONTEND_URL') || 'http://localhost:5173';

    if (!req.user) {
      res.redirect(`${frontendUrl}/login?error=access_denied`);
      return;
    }

    const { accessToken } = this.authService.login(req.user as any);
    res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: { userId: string }) {
    const profile = await this.authService.getProfile(user.userId);
    if (!profile) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'User not found' };
    }
    return {
      id: profile.id,
      email: profile.email,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
    };
  }
}
