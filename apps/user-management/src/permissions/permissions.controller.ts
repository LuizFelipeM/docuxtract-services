import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
} from 'class-validator';
import { Role } from '../role';
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

class OrganizationParam {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  max_integration_count: number;
}

class SyncBody {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNotEmptyObject()
  organization: OrganizationParam;

  @IsString()
  @IsNotEmpty()
  email: string;

  attributes?: Record<string, unknown>;

  @IsEnum(Role, { each: true })
  roles?: Role[];
}

@Controller('permissions')
export class PermissionController {
  private readonly logger = new Logger(PermissionController.name);

  constructor(private readonly permissionService: PermissionsService) {}

  @Post('sync')
  async sync(@Body() body: SyncBody) {
    this.logger.log(`Sync body ${JSON.stringify(body)}`);

    const {
      userId,
      organization: { id, name, max_integration_count },
      email,
      attributes,
      roles,
    } = body;

    await this.permissionService.createOrganization(id, name, {
      max_integration_count,
    });

    await this.permissionService.syncUser(id, {
      id: userId,
      email,
      attributes,
      roles,
    });
  }

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
