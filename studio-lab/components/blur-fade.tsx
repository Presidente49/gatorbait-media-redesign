"use client";
import {motion,useReducedMotion} from "motion/react";
export function BlurFade({children,delay=0,className=""}:{children:React.ReactNode;delay?:number;className?:string}){const reduce=useReducedMotion();return <motion.div className={className} initial={{opacity:0,filter:"blur(6px)",y:16}} whileInView={{opacity:1,filter:"blur(0px)",y:0}} viewport={{once:true,margin:"0px 0px -10% 0px"}} transition={reduce?{duration:0}:{delay,duration:.5,ease:[.21,.47,.32,.98]}}>{children}</motion.div>}
