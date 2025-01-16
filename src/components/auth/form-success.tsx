interface FormSuccessProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div className="rounded-md bg-green-50 p-4 mb-4">
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm text-green-700">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};