export const smoothTransition = {
  duration: 0.38,
  ease: [0.16, 1, 0.3, 1],
};

export const quickTransition = {
  duration: 0.22,
  ease: [0.16, 1, 0.3, 1],
};

export const springTransition = {
  type: 'spring',
  damping: 26,
  stiffness: 320,
};

export const viewportOnce = {
  once: true,
  amount: 0.12,
  margin: '0px 0px -50px 0px',
};

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: smoothTransition,
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

export const cardHover = {
  y: -4,
  transition: {
    duration: 0.24,
    ease: [0.16, 1, 0.3, 1],
  },
};

export const cardTap = {
  scale: 0.99,
  transition: {
    duration: 0.12,
    ease: [0.16, 1, 0.3, 1],
  },
};
