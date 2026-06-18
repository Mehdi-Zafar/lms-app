export const Role = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  PARENT: "PARENT",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

export const ROLE_LABELS: Record<RoleType, string> = {
  ADMIN: "Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
  PARENT: "Parent",
};

const PERMISSIONS = {
  // Admin permissions
  "users:create": [Role.ADMIN],
  "users:read": [Role.ADMIN],
  "users:update": [Role.ADMIN],
  "users:delete": [Role.ADMIN],
  "classes:assign": [Role.ADMIN],
  "grades:override": [Role.ADMIN],

  // Teacher permissions
  "courses:create": [Role.ADMIN, Role.TEACHER],
  "courses:update": [Role.TEACHER],
  "courses:publish": [Role.TEACHER],
  "modules:create": [Role.TEACHER],
  "modules:update": [Role.TEACHER],
  "modules:publish": [Role.TEACHER],
  "lessons:create": [Role.TEACHER],
  "lessons:update": [Role.TEACHER],
  "assignments:create": [Role.TEACHER],
  "assignments:update": [Role.TEACHER],
  "submissions:grade": [Role.TEACHER, Role.ADMIN],
  "reports:write": [Role.TEACHER],
  "attendance:manage": [Role.TEACHER],

  // Student permissions
  "courses:view": [Role.ADMIN, Role.TEACHER, Role.STUDENT],
  "lessons:view": [Role.ADMIN, Role.TEACHER, Role.STUDENT],
  "submissions:create": [Role.STUDENT],
  "submissions:view-own": [Role.STUDENT],
  "grades:view-own": [Role.STUDENT],

  // Parent permissions
  "child:grades": [Role.PARENT],
  "child:attendance": [Role.PARENT],
  "child:reports": [Role.PARENT],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: string, permission: Permission): boolean {
  const allowedRoles: readonly string[] = PERMISSIONS[permission];
  return allowedRoles.includes(role);
}

export function getRolePermissions(role: RoleType): Permission[] {
  return (Object.entries(PERMISSIONS) as [Permission, readonly RoleType[]][])
    .filter(([, roles]) => roles.includes(role))
    .map(([permission]) => permission);
}

export const ROLE_DASHBOARDS: Record<RoleType, string> = {
  ADMIN: "/admin",
  TEACHER: "/teacher",
  STUDENT: "/student",
  PARENT: "/parent",
};

export const PROTECTED_ROUTES: Record<string, RoleType[]> = {
  "/admin": [Role.ADMIN],
  "/teacher": [Role.TEACHER],
  "/student": [Role.STUDENT],
  "/parent": [Role.PARENT],
};
