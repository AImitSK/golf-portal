import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const useCurrentUser = () => {
  const { data: session, update } = useSession();

  useEffect(() => {
    if (session) update();
  }, [session]);

  return session?.user;
};