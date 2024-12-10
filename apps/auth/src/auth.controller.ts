import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { User } from '@clerk/backend';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  // @Post('verify')
  // @HttpCode(HttpStatus.OK)
  // async verify(@Body('token') token: string) {
  //   return await this.authService.verify(token);
  // }

  @MessagePattern({ cmd: 'auth.verify' })
  async verifyToken(@Payload() data: { authorization: string }): Promise<User> {
    const jwt = await this.authService.verify(data.authorization);
    this.logger.log(jwt);
    const user = await this.authService.getUser(jwt.sub);
    this.logger.log(user);
    return user;
  }

  // @Get('user')
  // async getUserDetails(@Query('userId') userId: string) {
  //   return await this.authService.getUserDetails(userId);
  // }

  // @Get('all-users')
  // async getUsers() {
  //   return await this.authService.getUsers();
  // }

  // @Get()
  // @UseGuards(ClerkAuthGuard)
  // getHello(): string {
  //   return this.authService.getHello();
  // }
}
