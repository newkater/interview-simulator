interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => {
  return (
    <label className="block text-slate-800 font-semibold">
      {label}
      <input
        {...props}
        className="w-full px-4 py-3 bg-slate-200 border border-slate-300 rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all mt-2 font-normal"
      />
    </label>
  );
};
