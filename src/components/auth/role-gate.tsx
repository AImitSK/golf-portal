"use client";

import { UserRole } from "@/models/typings";

import { useCurrentRole } from "@/hooks/use-current-role";
import { FormError } from "@/components/auth/form-error";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
};

export const RoleGate = ({
  children,
  allowedRole,
}: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <FormError message="You do not have permission to view this content!" />
    )
  }

  return (
    <>
      {children}
    </>
  );
};