
import React from 'react';
import { motion } from 'framer-motion';
import { LucideSparkles } from 'lucide-react';

const Header = () => {
  return (
    <motion.header 
      className="w-full py-6 px-6 sm:px-8 flex justify-between items-center z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
    >
      <motion.div 
        className="flex items-center space-x-2"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <LucideSparkles className="w-6 h-6 text-primary" />
        <span className="text-xl font-medium tracking-tight">Animate.ai</span>
      </motion.div>
      
      <motion.nav className="hidden md:flex items-center space-x-8">
        {['How it works', 'Examples', 'About'].map((item, index) => (
          <motion.a
            key={item}
            href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.1 * index, 
              ease: [0.42, 0, 0.58, 1] 
            }}
          >
            {item}
          </motion.a>
        ))}
      </motion.nav>
    </motion.header>
  );
};

export default Header;
