import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Apply @UseGuards(JwtAuthGuard) to any route that requires a logged-in user.
// Returns 401 automatically if the token is missing, expired, or invalid.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
