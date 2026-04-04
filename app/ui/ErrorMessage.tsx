export const ErrorMessage = ({ message }: { message: string | undefined }) => (
  <p role="alert" className="mt-1 text-xs text-red-500 md:text-base">
    {message}
  </p>
);
