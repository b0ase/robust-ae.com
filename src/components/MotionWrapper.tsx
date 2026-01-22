"use client";

import React from 'react';
import { motion } from 'framer-motion';

type AnimationType = 'fadeIn' | 'slideUp' | 'scaleUp';

interface MotionWrapperProps {
    children: React.ReactNode;
    type?: AnimationType;
    delay?: number;
    duration?: number;
    className?: string;
    viewportOnce?: boolean;
}

export const MotionWrapper: React.FC<MotionWrapperProps> = ({
    children,
    type = 'fadeIn',
    delay = 0,
    duration = 0.5,
    className = '',
    viewportOnce = true
}) => {
    const getVariants = () => {
        switch (type) {
            case 'slideUp':
                return {
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                };
            case 'scaleUp':
                return {
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: { opacity: 1, scale: 1 }
                };
            case 'fadeIn':
            default:
                return {
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 }
                };
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: viewportOnce, amount: 0.2 }}
            variants={getVariants()}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const StaggerContainer: React.FC<{ children: React.ReactNode, className?: string, delay?: number }> = ({ children, className = '', delay = 0 }) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.2,
                        delayChildren: delay
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
