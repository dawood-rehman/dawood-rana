export const smoothTransition = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1],
};

export const quickTransition = {
  duration: 0.2,
  ease: [0.2, 0, 0, 1],
};

export const viewportOnce = {
  once: true,
  amount: 0.22,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};
