import React from 'react'
import { AnimatePresence, motion, useCycle } from "framer-motion";
import AnimText from './AnimateText';

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(0px at 400px 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};
const AboutMe = () => {
    const [isOpen, toggleOpen] = useCycle(false, true);
  return (
    <motion.div initial={false} animate={isOpen ? "open" : "closed"}>
      <motion.div
        className="absolute right-0 top-0 bg-[#d2d3dc] w-[300px] h-screen"
        variants={sidebar}
      >
        <AnimatePresence>
          <div
            onClick={() => toggleOpen()}
            className="text-black p-4 cursor-pointer"
          >
            X
          </div>
          {isOpen && (
            <div className="text-black p-2">
              <AnimText delay={0} aboutMeText="My name is Manishankar. I have 1.2 year of experience working as a Software developement engineer at orianwave and I'm skilled in MERN and aslo have strong problem solving skill, currently i am looking for a Frontend role. If you need more info aboute me kindly contact me at +91 7061338807 or send a mail at manishankarkumar789@gmail.com           Thanks." />
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      <div onClick={() => toggleOpen()} className="cursor-pointer">
        About me
      </div>
    </motion.div>
  );
}

export default AboutMe