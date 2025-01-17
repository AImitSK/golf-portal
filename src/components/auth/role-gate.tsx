"use client";

import { UserRole } from "@/models/typings";

import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { FormError } from "@/components/auth/form-error";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
};

export const RoleGate = ({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: string;
}) => {
  const user = useCurrentUser();
  
  if (user?.role !== allowedRole) {
      return <div>Keine Berechtigung</div>;
  }

  return (
    <>
      {children}
    </>
  );
};