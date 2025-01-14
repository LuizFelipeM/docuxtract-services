import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator';
import { PermissionsService } from './permissions.service';

class ResourceParam {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  tenant?: string;
  attributes?: Record<string, any>;
}

class UserParam {
  @IsString()
  @IsNotEmpty()
  id: string;
  attributes?: Record<string, any>;
}

class CheckBody {
  @IsString()
  @IsNotEmpty()
  action: string;

  @IsNotEmptyObject()
  user: UserParam;

  @IsNotEmptyObject()
  resource: ResourceParam;
}

@Controller('permissions')
export class PermissionController {
  private readonly logger = new Logger(PermissionController.name);

  constructor(private readonly permissionService: PermissionsService) {}

  @Post('check')
  @HttpCode(HttpStatus.OK)
  async check(@Body() body: CheckBody) {
    this.logger.log(`body = ${JSON.stringify(body)}`);

    const { user, resource, action } = body;
    return await this.permissionService.check(
      { key: user.id, attributes: user.attributes },
      action,
      {
        key: resource.key,
        type: resource.name,
        attributes: resource.attributes,
        tenant: resource.tenant,
      },
    );
  }
}
