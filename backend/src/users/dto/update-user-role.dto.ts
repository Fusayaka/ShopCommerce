import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsEnum(UserRole, { message: 'Invalid Role' })
  role: UserRole;
}