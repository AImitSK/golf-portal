"use client";

import { logout } from "@/actions/logout";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({
  children
}: LogoutButtonProps) => {
    
  const onClick = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Wenn keine Children übergeben werden, zeige den Backend-Style
  if (!children) {
    return (
      <div className="mt-4 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={onClick}
          className="group flex w-full items-center gap-x-3 rounded-md p-3 text-sm/6 font-extrabold text-gray-700 hover:bg-gray-50 hover:text-red-600"
        >
          <ArrowLeftOnRectangleIcon
            aria-hidden="true"
            className="h-6 w-6 text-gray-400 group-hover:text-red-600"
          />
          Logout
        </button>
      </div>
    );
  }

  // Standard-Fall mit übergebenen Children
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};