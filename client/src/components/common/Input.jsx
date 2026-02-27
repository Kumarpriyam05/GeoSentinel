import { cn } from "@/lib/cn";

const Input = ({ className, ...props }) => <input className={cn("input-base", className)} {...props} />;

export default Input;

