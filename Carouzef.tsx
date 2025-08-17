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
} from "./utils";
import { useSwipeDirection } from "@/hooks/useSwipeMotion";

type CarouselState = {
  index: number;
  numberOfItems: number;
  realNumberOfItems: number;
  itemsPerView: number;
  loop: boolean;
};
interface CarouselContext extends CarouselState {
  incrementIndex: (n: number) => void;
  setIndex: (n: number) => void;
}

const CarouselContextComp = createContext<CarouselContext | null>(null);
export function useCarousel() {
  return useContext(CarouselContextComp);
}

interface ItemContext {
  index: number;
  activeIndex: number;
  toActiveIndex: number;
  position: ItemPosition;
}
const ItemContextComp = createContext<ItemContext | null>(null);
export function useCarouselItem() {
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
function reducerFunction(prevState: CarouselState, { type, arg }: Action) {
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

interface CarouselPropType extends PropsWithChildren {
  itemsPerView?: number;
  startingItem?: number;
  loop?: boolean;
  autoPlay?: number | AutoPlayConfig | true;
  cssStyle?: Record<string, string>;
  changeItemOnClick?: boolean;
}
interface AutoPlayConfig {
  interval: number;
  step?: number;
}
const defaultAutoPlayConfig: AutoPlayConfig = {
  interval: 3000,
  step: 1,
};

export function Carousel({
  children,
  startingItem = 0,
  itemsPerView = 2,
  loop = true,
  autoPlay,
  cssStyle,
  changeItemOnClick = true,
}: CarouselPropType) {
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
  const initialState: CarouselState = {
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

  const setIndex = useCallback(
    (arg: number) => setValue({ type: ActionType.SET, arg }),
    []
  );
  const incrementIndex = useCallback(
    (arg: number) => setValue({ type: ActionType.INCR, arg }),
    []
  );

  const [value, setValue] = useReducer(reducerFunction, initialState);
  const swipeHandle = useSwipeDirection({
    onSwipeLeft: () => incrementIndex(1),
    onSwipeRight: () => incrementIndex(-1),
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
    <div
      style={
        { "--items-per-view ": itemsPerView, ...cssStyle } as CSSProperties
      }
      {...swipeHandle}
      className="carousel-container"
    >
      <CarouselContextComp.Provider
        value={{
          setIndex,
          incrementIndex,
          ...value,
        }}
      >
        {Children.map(itemArray, (child, id) => (
          <Item key={id} index={id} changeItemOnClick={changeItemOnClick}>
            {child}
          </Item>
        ))}
        {inactiveChilds}
      </CarouselContextComp.Provider>
    </div>
  );
}

interface ItemPropType extends PropsWithChildren {
  index: number;
  changeItemOnClick: boolean;
}

function Item({ children, index, changeItemOnClick }: ItemPropType) {
  const mainContext = useCarousel();
  if (!mainContext) return children;
  const toActiveIndex = indexDistance(
    index,
    mainContext.index,
    mainContext.numberOfItems,
    mainContext.loop
  );
  const style = {
    "--item-index": `${index}`,
    "--distance-to-active": `${toActiveIndex}`,
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
