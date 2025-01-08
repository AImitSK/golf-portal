import { useSession } from "next-auth/react";
import { UserRole } from "@/types/auth";

export const useCurrentRole = () => {
  const session = useSession();
  return session.data?.user?.role as UserRole | undefined;
};
