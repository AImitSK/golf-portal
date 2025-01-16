"use client";

import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

import { newVerification } from "@/actions/new-verification";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import Link from "next/link";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {/* Optional: Überschrift oder Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center mb-4">
        <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Confirming your verification
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* Zurück-Button oder Link */}
        <Link
          href="/auth/login"
          className="text-sm font-semibold text-[#006633] hover:text-[#2CDB48]"
        >
          Back to login
        </Link>

        {/* Inhalt */}
        <div className="mt-6 flex w-full items-center justify-center">
          {!success && !error && <BeatLoader />}
          <FormSuccess message={success} />
          {!success && <FormError message={error} />}
        </div>
      </div>
    </div>
  );
};