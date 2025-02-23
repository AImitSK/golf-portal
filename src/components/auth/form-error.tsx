interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="rounded-md bg-red-50 p-4 mb-4">
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm text-red-700">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};