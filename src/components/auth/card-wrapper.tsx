"use client";

import { Button } from '@/components/catalyst-ui-kit/button';
import { Heading } from '@/components/catalyst-ui-kit/heading';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial
}: CardWrapperProps) => {
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  }

  return (
    <div className="w-[400px] rounded-xl bg-white p-6 border border-brand-lightgray">
      <div className="w-full flex flex-col gap-y-4 items-center justify-center mb-6">
        <div className="w-24 h-24 relative">
          <Image
            src="/images/logo.svg"
            alt="Golf Course List Logo"
            fill
            className="object-contain"
          />
        </div>
        <p className="text-brand text-sm">
          {headerLabel}
        </p>
      </div>
      <div className="space-y-4">
        {children}
        {showSocial && (
          <div className="flex items-center w-full gap-x-2">
            <Button
              onClick={() => onClick("google")}
              className="w-full bg-brand-dark hover:bg-brand text-white"
              plain
            >
              <FcGoogle className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => onClick("github")}
              className="w-full bg-brand-dark hover:bg-brand text-white"
              plain
            >
              <FaGithub className="h-5 w-5" />
            </Button>
          </div>
        )}
        <div className="text-center">
          <Link href={backButtonHref}>
            <Button variant="link" className="font-normal text-brand hover:text-brand-accent">
              {backButtonLabel}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
