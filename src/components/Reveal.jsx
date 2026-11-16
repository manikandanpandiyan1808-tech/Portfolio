import { motion } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
  ...rest
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
