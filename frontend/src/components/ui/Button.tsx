interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const Button: React.FC<ButtonProps> = ({ label, ...props }) => {
  return (
    <button
      {...props}
      className="w-full py-3 bg-blue-300 hover:bg-blue-400 font-semibold rounded-lg shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
    >
      {label}
    </button>
  );
};
