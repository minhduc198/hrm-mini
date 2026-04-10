import { useState, useEffect } from "react";

export type Role = "admin" | "delegated_admin" | "employee";

export function useAuth() {
  const [role, setRole] = useState<Role>("admin");

  useEffect(() => {
    const savedRole = localStorage.getItem("mock_role") as Role;
    if (savedRole && ["admin", "delegated_admin", "employee"].includes(savedRole)) {
      setRole(savedRole);
    }
  }, []);

  const changeRole = (newRole: Role) => {
    setRole(newRole);
    localStorage.setItem("mock_role", newRole);
  };

  const user = {
    name: "Nguyễn Minh Đức",
    initials: "NM",
    email: "nguyenminhduc@gmail.com",
  };

  return { role, setRole: changeRole, user };
}
