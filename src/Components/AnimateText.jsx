import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import CursorBlinker from "./CursorBlinker";

export default function AnimText({ delay, aboutMeText }) {
  const [done, setDone] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) =>
    aboutMeText.slice(0, latest)
  );

  useEffect(() => {
    const controls = animate(count, aboutMeText.length, {
      type: "tween",
      delay: delay,
      duration: 5,
      ease: "easeInOut",
      onComplete: () => {
        setDone(true);
      },
    });
    return controls.stop;
  }, []);

  return (
    <span className="">
      <motion.span className="text-black font-medium font-mono">{displayText}</motion.span>
      {done && (
        <>
          <br /> <br />
        </>
      )}
      {!done && <CursorBlinker />}
    </span>
  );
}
