import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

export const CURRENT_USER_KEY = 'currentUser';
export const CurrentUser = () => {
  return (target: object, propertyKey: string | symbol, parameterIndex: number) => {
    // Parameter decorator - handled by CurrentUser decorator in controller
  };
};
