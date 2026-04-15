import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';

interface GoogleProfile {
  googleId: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

@Injectable()
export class AuthService {
  private readonly allowedEmails: string[] | null;

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    const raw = this.config.get<string>('ALLOWED_EMAILS');
    this.allowedEmails = raw
      ? raw.split(',').map((e) => e.trim().toLowerCase())
      : null; // null = open access (no restriction)
  }

  async validateGoogleUser(profile: GoogleProfile): Promise<User> {
    // Check if email is in the allowlist (if configured)
    if (
      this.allowedEmails &&
      !this.allowedEmails.includes(profile.email.toLowerCase())
    ) {
      throw new ForbiddenException(
        'Access denied. Your email is not authorized to use this application.',
      );
    }

    let user = await this.userRepo.findOne({
      where: { googleId: profile.googleId },
    });

    if (!user) {
      user = this.userRepo.create({
        googleId: profile.googleId,
        email: profile.email,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl ?? null,
      });
      user = await this.userRepo.save(user);
    }

    return user;
  }

  login(user: User): { accessToken: string } {
    const payload = { sub: user.id, email: user.email };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async getProfile(userId: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id: userId } });
  }
}
