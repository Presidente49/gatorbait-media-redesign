"use client";
import {motion,useReducedMotion,useScroll,useSpring} from "motion/react";
export function ScrollProgress(){const {scrollYProgress}=useScroll();const scaleX=useSpring(scrollYProgress,{stiffness:180,damping:32,restDelta:.001});const reduce=useReducedMotion();return <motion.div aria-hidden className="progress" style={{scaleX:reduce?scrollYProgress:scaleX}}/>}
