import { SetMetadata } from "@nestjs/common";
import { type UserRole} from '@prisma/client';

export const ROLE_KEYS = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLE_KEYS, roles);