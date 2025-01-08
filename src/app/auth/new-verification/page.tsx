import { NewVerificationForm } from "@/components/auth/new-verification-form";

const NewVerificationPage = () => {
  return (
    <div className="container flex h-full w-full flex-col items-center justify-center">
      <div className="w-[400px] space-y-6">
        <NewVerificationForm />
      </div>
    </div>
  );
};

export default NewVerificationPage;
