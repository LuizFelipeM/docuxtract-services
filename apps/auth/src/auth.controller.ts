import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  // private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  // @Post('verify')
  // @HttpCode(HttpStatus.OK)
  // async verify(@Body('token') token: string) {
  //   return await this.authService.verify(token);
  // }

  @MessagePattern('verify')
  async verifyToken(@Payload() data: any): Promise<{ name: string }> {
    console.log('data', data);
    // const jwt = await this.authService.verify(data.authorization);
    // console.log(jwt);
    // const user = await this.authService.getUser(jwt.sub);
    // console.log(user);
    // return user;

    return { name: 'Luiz' };
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
