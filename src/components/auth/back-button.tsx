// src/components/auth/back-button.tsx
import Link from "next/link";
import { Button } from "@/components/catalyst-ui-kit";

interface BackButtonProps {
  href: string;
  label: string;
}

export const BackButton = ({
  href,
  label,
}: BackButtonProps) => {
  return (
    <Button
      variant="link"
      className="font-normal w-full"
      asChild
    >
      <Link href={href}>
        {label}
      </Link>
    </Button>
  );
};