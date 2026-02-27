import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const Card = ({ children, className, delay = 0, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className={cn("card-base", className)}
    {...props}
  >
    {children}
  </motion.div>
);

export default Card;

