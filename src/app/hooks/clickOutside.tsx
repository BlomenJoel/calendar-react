import { useRef, useEffect, MutableRefObject } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref: MutableRefObject<any>, handleOutsideClick: () => void) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        handleOutsideClick()
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
export default function OutsideAlerter(props: { children: React.ReactNode, handelOutsideClick: () => void }) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props.handelOutsideClick);

  return <div ref={wrapperRef}>{props.children}</div>;
}