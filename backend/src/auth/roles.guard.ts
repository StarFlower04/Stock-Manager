import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      console.log('No roles defined for this route');
      return true; 
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      console.error('Authorization header not found');
      throw new UnauthorizedException('Authorization header not found');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.error('Token not found');
      throw new UnauthorizedException('Token not found');
    }

    let user;
    try {
      user = this.jwtService.verify(token);
      request.user = user; 
      console.log('Verified user:', user); 
    } catch (error) {
      console.error('Invalid or expired token', error);
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!roles.includes(user.role)) {
      console.error('User role not authorized');
      throw new UnauthorizedException('User role not authorized');
    }

    return true;
  }
}