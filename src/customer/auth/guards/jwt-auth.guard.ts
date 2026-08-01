import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Protects routes: requires a valid JWT in the Authorization header
@Injectable()
export class JwtAuthGuard extends AuthGuard('customer-jwt') {}
