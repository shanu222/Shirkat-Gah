import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { LoginDto, RegisterDto, ResetPasswordDto } from './dto/auth.dto';
import { JwtPayload } from '@shirkat-gah/shared';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private email: EmailService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (user.status === 'SUSPENDED') throw new UnauthorizedException('Account suspended');
    if (user.status === 'PENDING_VERIFICATION') {
      throw new UnauthorizedException('Please verify your email first');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
      },
    });

    return this.generateTokens(user);
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const learnerRole = await this.prisma.role.findUnique({ where: { slug: 'learner' } });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        roles: learnerRole ? { create: { roleId: learnerRole.id } } : undefined,
      },
      include: {
        roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
      },
    });

    const token = randomBytes(32).toString('hex');
    await this.prisma.emailVerification.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return {
      message: 'Registration successful. Please verify your email.',
      userId: user.id,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user) return { message: 'If the email exists, a reset link has been sent.' };

    const token = randomBytes(32).toString('hex');
    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const appUrl = this.config.get('NEXT_PUBLIC_APP_URL', 'http://localhost:3000');
    const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;
    await this.email.sendPasswordReset(user.email, resetUrl, user.firstName);

    return { message: 'If the email exists, a reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const reset = await this.prisma.passwordReset.findUnique({
      where: { token: dto.token },
    });
    if (!reset || reset.used || reset.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: reset.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordReset.update({
        where: { id: reset.id },
        data: { used: true },
      }),
    ]);

    return { message: 'Password reset successful' };
  }

  async refreshToken(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: {
        user: {
          include: {
            roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
          },
        },
      },
    });

    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateTokens(stored.user);
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.updateMany({
        where: { token: refreshToken, userId },
        data: { revoked: true },
      });
    }
    await this.prisma.auditLog.create({
      data: { userId, action: 'LOGOUT', entity: 'User', entityId: userId },
    });
    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        status: true,
        theme: true,
        preferredLanguage: true,
        lastLoginAt: true,
        createdAt: true,
        organization: { select: { id: true, name: true, slug: true } },
        roles: { include: { role: { select: { name: true, slug: true } } } },
      },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }

  private async generateTokens(user: {
    id: string;
    email: string;
    roles: { role: { slug: string; permissions: { permission: { slug: string } }[] } }[];
  }) {
    const roles = user.roles.map((r) => r.role.slug);
    const permissions = [
      ...new Set(
        user.roles.flatMap((r) => r.role.permissions.map((p) => p.permission.slug)),
      ),
    ];

    const payload: JwtPayload = { sub: user.id, email: user.email, roles, permissions };

    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
    });

    const refreshTokenValue = randomBytes(40).toString('hex');
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshTokenValue,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
      user: {
        id: user.id,
        email: user.email,
        roles,
        permissions,
      },
    };
  }
}
