import { ReactElement, ReactNode, TouchEvent } from "react";
export declare function incrementIndexSafe(value: number, count: number, max: number, modular: boolean): number;
export declare function getIndexSafe(value: number, max: number, modular: boolean): number;
export declare function indexDistance(value: number, target: number, max: number, modular: boolean): number;
type FilteredChild = {
    activeChilds: ReactElement[];
    inactiveChilds: ReactElement[];
};
export declare function filterChildren(children: ReactNode, filter: string): FilteredChild;
export declare function duplicateChildren(children: ReactNode, itemsPerView: number): (string | number | bigint | ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | import("react").ReactPortal | Promise<string | number | bigint | boolean | ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | import("react").ReactPortal | Iterable<ReactNode> | null | undefined>)[];
export declare enum ItemPosition {
    HIDDEN = "hidden",
    PREV = "prev",
    NEXT = "next",
    AFTER = "after",
    BEFORE = "before",
    ACTIVE = "active"
}
export declare function getItemPosition(distance: number, perView: number): ItemPosition;
interface NavigationOptions {
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    onSwipeUp: () => void;
    onSwipeDown: () => void;
    onKeysUp: Record<string, () => void>;
    keyboardEventThrottle: number;
    swipeThreshold: number;
}
export declare function useNavigation({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onKeysUp: keyboardNavigation, swipeThreshold, keyboardEventThrottle, }: NavigationOptions): {
    onTouchStart: (e: TouchEvent) => void;
    onTouchMove: (e: TouchEvent) => Touch;
    onTouchEnd: () => void;
};
export {};
//# sourceMappingURL=utils.d.ts.map