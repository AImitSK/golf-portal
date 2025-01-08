import { ResetForm } from "@/components/auth/reset-form";

const ResetPage = () => {
  return (
    <div className="container flex h-full w-full flex-col items-center justify-center">
      <div className="w-[400px] space-y-6">
        <ResetForm />
      </div>
    </div>
  );
};

export default ResetPage;
