// Global theme configuration for CheckMate
export const theme = {
    // Color Palettes
    colors: {
        primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
        },
        secondary: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
            900: '#581c87',
        },
        success: {
            50: '#f0fdf4',
            100: '#dcfce7',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
        },
        warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
        },
        danger: {
            50: '#fef2f2',
            100: '#fee2e2',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
        },
        dark: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
            950: '#030712',
        },
    },

    // Glassmorphism Effects
    glass: {
        light: {
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'rgba(255, 255, 255, 0.2)',
            blur: '10px',
            shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        },
        medium: {
            background: 'rgba(255, 255, 255, 0.15)',
            border: 'rgba(255, 255, 255, 0.3)',
            blur: '16px',
            shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        },
        strong: {
            background: 'rgba(255, 255, 255, 0.25)',
            border: 'rgba(255, 255, 255, 0.4)',
            blur: '20px',
            shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.3)',
        },
        dark: {
            background: 'rgba(17, 25, 40, 0.75)',
            border: 'rgba(255, 255, 255, 0.125)',
            blur: '16px',
            shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        },
    },

    // Gradients
    gradients: {
        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        danger: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        dark: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        cyber: 'linear-gradient(135deg, #00d2ff 0%, #3a47d5 100%)',
        sunset: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
        ocean: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },

    // Animation Presets
    animations: {
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
            transition: { duration: 0.4 },
        },
        slideDown: {
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 20 },
            transition: { duration: 0.4 },
        },
        slideLeft: {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 },
            transition: { duration: 0.4 },
        },
        slideRight: {
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: 20 },
            transition: { duration: 0.4 },
        },
        scale: {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.9 },
            transition: { duration: 0.3 },
        },
        stagger: {
            animate: {
                transition: {
                    staggerChildren: 0.1,
                },
            },
        },
    },

    // Spacing
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
    },

    // Border Radius
    borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        full: '9999px',
    },

    // Shadows
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        glow: '0 0 20px rgba(59, 130, 246, 0.5)',
        glowStrong: '0 0 40px rgba(59, 130, 246, 0.8)',
    },

    // Typography
    typography: {
        fontFamily: {
            sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            mono: "'Fira Code', 'Courier New', monospace",
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
        },
        fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
        },
    },

    // Breakpoints
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },

    // Z-Index Scale
    zIndex: {
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modalBackdrop: 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
    },
};

// Helper function to get glassmorphism styles
export const getGlassStyle = (variant = 'medium', isDark = false) => {
    const glassVariant = isDark ? theme.glass.dark : theme.glass[variant];
    return {
        background: glassVariant.background,
        backdropFilter: `blur(${glassVariant.blur})`,
        WebkitBackdropFilter: `blur(${glassVariant.blur})`,
        border: `1px solid ${glassVariant.border}`,
        boxShadow: glassVariant.shadow,
    };
};

// Helper function to get gradient background
export const getGradient = (gradientName) => {
    return theme.gradients[gradientName] || theme.gradients.primary;
};

export default theme;
