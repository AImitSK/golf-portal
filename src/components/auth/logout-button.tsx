"use client";

import { logout } from "@/actions/logout";
import { Button } from "@/components/catalyst-ui-kit/button";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({
  children
}: LogoutButtonProps) => {
  const onClick = async () => {
    await logout();
  };

  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="sm"
    >
      {children || "Abmelden"}
    </Button>
  );
};
