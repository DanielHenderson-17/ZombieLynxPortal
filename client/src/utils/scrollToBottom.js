export const scrollToBottom = (containerRef) => {
  if (containerRef?.current) {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }
};
