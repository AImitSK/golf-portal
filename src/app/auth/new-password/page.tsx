import { NewPasswordForm } from "@/components/auth/new-password-form";

const NewPasswordPage = () => {
  return (
    <div className="container flex h-full w-full flex-col items-center justify-center">
      <div className="w-[400px] space-y-6">
        <NewPasswordForm />
      </div>
    </div>
  );
};

export default NewPasswordPage;
