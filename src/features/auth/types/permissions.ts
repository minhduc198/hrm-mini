export interface PermissionItem {
  module: string;
  action: string;
}

export interface PermissionResponse {
  permissions: PermissionItem[];
}
