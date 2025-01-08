import { useSession } from "next-auth/react";
import { User } from "@/types/auth";

export const useCurrentUser = () => {
  const session = useSession();
  return session.data?.user as User | undefined;
};
