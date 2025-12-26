import { motion } from "framer-motion";
import PropTypes from "prop-types";

/**
 * AnimatedPage - Reusable page transition wrapper
 * Provides consistent page animations across the application
 */
const AnimatedPage = ({ children, variant = "fadeIn", className = "" }) => {
    const variants = {
        fadeIn: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.3 },
        },
        slideUp: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: { duration: 0.4, ease: "easeOut" },
        },
        slideDown: {
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 20 },
            transition: { duration: 0.4, ease: "easeOut" },
        },
        slideLeft: {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 },
            transition: { duration: 0.4, ease: "easeOut" },
        },
        slideRight: {
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: 20 },
            transition: { duration: 0.4, ease: "easeOut" },
        },
        scale: {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 },
            transition: { duration: 0.3, ease: "easeOut" },
        },
    };

    const selectedVariant = variants[variant] || variants.fadeIn;

    return (
        <motion.div
            className={className}
            initial={selectedVariant.initial}
            animate={selectedVariant.animate}
            exit={selectedVariant.exit}
            transition={selectedVariant.transition}
        >
            {children}
        </motion.div>
    );
};

AnimatedPage.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf([
        "fadeIn",
        "slideUp",
        "slideDown",
        "slideLeft",
        "slideRight",
        "scale",
    ]),
    className: PropTypes.string,
};

export default AnimatedPage;
