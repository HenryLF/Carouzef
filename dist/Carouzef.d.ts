import { PropsWithChildren } from "react";
import { ItemPosition } from "./utils";
import "./carouzef.css";
type CarouzefState = {
    index: number;
    numberOfItems: number;
    realNumberOfItems: number;
    itemsPerView: number;
    loop: boolean;
};
interface CarouzefContext extends CarouzefState {
    incrementIndex: (n: number) => void;
    setIndex: (n: number) => void;
}
export declare function useCarouzef(): CarouzefContext | null;
interface ItemContext {
    index: number;
    activeIndex: number;
    toActiveIndex: number;
    position: ItemPosition;
}
export declare function useCarouzefItem(): ItemContext | null;
interface CarouzefPropType extends PropsWithChildren {
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
interface AutoPlayConfig {
    interval: number;
    step?: number;
}
export declare function Carouzef({ children, startingItem, itemsPerView, loop, autoPlay, cssStyle, changeItemOnClick, swipeThreshold, keyboardEventThrottle, keyboardNavigation, axis, }: CarouzefPropType): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Carouzef.d.ts.map