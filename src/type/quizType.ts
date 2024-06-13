export type EventHandlers = {
  handleStart: (event: React.MouseEvent<Element, MouseEvent> | React.TouchEvent<Element>) => void;
  handleMove: (event: React.MouseEvent<Element, MouseEvent> | React.TouchEvent<Element>) => void;
  handleEnd: () => void;
};
