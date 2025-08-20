import React from "react";

import {
  Children,
  createContext,
  CSSProperties,
  isValidElement,
  MouseEvent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  duplicateChildren,
  filterChildren,
  getIndexSafe,
  getItemPosition,
  incrementIndexSafe,
  indexDistance,
  ItemPosition,
  useNavigation,
} from "./utils";


type CarouzefState = {
  index: number;
  numberOfItems: number;
  realNumberOfItems: number;
  itemsPerView: number;
  loop: boolean;
};
export interface CarouzefContext extends CarouzefState {
  incrementIndex: (n: number) => void;
  setIndex: (n: number) => void;
}

const CarouzefContextComp = createContext<CarouzefContext | null>(null);
export function useCarouzef() {
  return useContext(CarouzefContextComp);
}

export interface ItemContext {
  index: number;
  activeIndex: number;
  toActiveIndex: number;
  position: ItemPosition;
}

const ItemContextComp = createContext<ItemContext | null>(null);
export function useCarouzefItem() {
  return useContext(ItemContextComp);
}
enum ActionType {
  INCR = "increment_index",
  SET = "set_index",
}
type Action = {
  type: ActionType;
  arg: number;
};
function reducerFunction(prevState: CarouzefState, { type, arg }: Action) {
  let index: number;
  switch (type) {
    case ActionType.INCR:
      index = incrementIndexSafe(
        prevState.index,
        arg,
        prevState.numberOfItems,
        prevState.loop
      );
      return {
        ...prevState,
        index,
      };
    case ActionType.SET:
      index = getIndexSafe(arg, prevState.numberOfItems, prevState.loop);
      return {
        ...prevState,
        index,
      };

    default:
      return prevState;
  }
}

export interface CarouzefProps extends PropsWithChildren {
  itemsPerView?: number;
  startingItem?: number;
  loop?: boolean;
  autoPlay?: number | AutoPlayConfig | true;
  cssStyle?: Record<string, string>;
  changeItemOnClick?: boolean;
  keyboardNavigation?: Record<string, "next" | "previous">;
  keyboardEventThrottle?: number;
  swipeThreshold?: number;
  axis?: "horizontal" | "vertical";
}
export interface AutoPlayConfig {
  interval: number;
  step?: number;
}
const defaultAutoPlayConfig: AutoPlayConfig = {
  interval: 3000,
  step: 1,
};

export function Carouzef({
  children,
  startingItem = 0,
  itemsPerView = 2,
  loop = true,
  autoPlay,
  cssStyle,
  changeItemOnClick = true,
  swipeThreshold = 50,
  keyboardEventThrottle = 500,
  keyboardNavigation = { ArrowLeft: "previous", ArrowRight: "next" },
  axis = "horizontal",
}: CarouzefProps) {
  const [itemArray, activeChilds, inactiveChilds] = useMemo(() => {
    const { activeChilds, inactiveChilds } = filterChildren(
      children,
      "carousel-ignore"
    );
    return [
      duplicateChildren(activeChilds, itemsPerView),
      activeChilds,
      inactiveChilds,
    ];
  }, [children, itemsPerView]);

  const numberOfItems = Children.count(itemArray);
  const initialState: CarouzefState = {
    index: getIndexSafe(startingItem, numberOfItems, loop),
    itemsPerView: itemsPerView,
    numberOfItems,
    realNumberOfItems: activeChilds.length,
    loop,
  };

  const autoPlayConfig = { ...defaultAutoPlayConfig };
  if (autoPlay) {
    switch (typeof autoPlay) {
      case "number":
        autoPlayConfig.interval = autoPlay;
        break;
      case "boolean":
        break;
      default:
        Object.assign(autoPlayConfig, autoPlay);
    }
  }

  const style = {
    "--items-per-view": itemsPerView,
    ...cssStyle,
  } as CSSProperties;

  const setIndex = useCallback(
    (arg: number) => setValue({ type: ActionType.SET, arg }),
    []
  );
  const incrementIndex = useCallback(
    (arg: number) => setValue({ type: ActionType.INCR, arg }),
    []
  );

  const [value, setValue] = useReducer(reducerFunction, initialState);

  const verticalAxis = axis == "vertical";
  const onKeysUp: Record<string, () => void> = {};
  for (let key in keyboardNavigation) {
    if (keyboardNavigation[key] == "next") {
      onKeysUp[key] = () => incrementIndex(1);
    } else {
      onKeysUp[key] = () => incrementIndex(-1);
    }
  }
  const navigationHandles = useNavigation({
    onSwipeLeft: !verticalAxis ? () => incrementIndex(1) : () => {},
    onSwipeRight: !verticalAxis ? () => incrementIndex(-1) : () => {},
    onSwipeUp: verticalAxis ? () => incrementIndex(1) : () => {},
    onSwipeDown: verticalAxis ? () => incrementIndex(-1) : () => {},
    onKeysUp,
    swipeThreshold,
    keyboardEventThrottle,
  });

  useEffect(() => {
    const cleanUp = [() => {}];
    if (autoPlay && autoPlayConfig) {
      const interval = setInterval(
        () => incrementIndex(1),
        autoPlayConfig.interval
      );
      cleanUp.push(() => {
        clearInterval(interval);
      });
    }
    return () => cleanUp.forEach((e) => e());
  }, [autoPlay]);
  return (
    <div style={style} {...navigationHandles} className="carousel-container">
      <CarouzefContextComp.Provider
        value={{
          setIndex,
          incrementIndex,
          ...value,
        }}
      >
        {Children.map(itemArray, (child, id) => (
          <Item
            key={id}
            index={id}
            changeItemOnClick={changeItemOnClick}
            axis={axis}
          >
            {child}
          </Item>
        ))}
        {inactiveChilds}
      </CarouzefContextComp.Provider>
    </div>
  );
}

interface ItemProps extends PropsWithChildren {
  index: number;
  changeItemOnClick: boolean;
  axis: "vertical" | "horizontal";
}

function Item({ children, index, changeItemOnClick, axis }: ItemProps) {
  const mainContext = useCarouzef();
  if (!mainContext) return children;
  const toActiveIndex = indexDistance(
    index,
    mainContext.index,
    mainContext.numberOfItems,
    mainContext.loop
  );

  const cssSize: Record<string, string> = {};
  if (axis == "horizontal") {
    cssSize["height"] = "auto";
  } else {
    cssSize["width"] = "auto";
  }
  const style = {
    "--item-index": `${index}`,
    "--distance-to-active": `${toActiveIndex}`,
    ...cssSize,
  } as CSSProperties;

  if (isValidElement(children)) {
    const childStyle = (children.props as { cssStyle?: CSSProperties })
      .cssStyle;
    if (childStyle) {
      Object.assign(style, childStyle);
    }
  }

  const position = getItemPosition(toActiveIndex, mainContext.itemsPerView);

  const onClickCapture = (ev: MouseEvent) => {
    if (index != mainContext?.index) {
      ev.stopPropagation();
      ev.preventDefault();
      mainContext.setIndex(index);
    }
  };

  return (
    <div
      onClickCapture={changeItemOnClick ? onClickCapture : () => {}}
      className={`carousel-item carousel-item-${position}`}
      style={style}
    >
      <ItemContextComp.Provider
        value={{
          index: index,
          activeIndex: mainContext?.index,
          toActiveIndex,
          position,
        }}
      >
        {children}
      </ItemContextComp.Provider>
    </div>
  );
}
