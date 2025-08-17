import { Children, isValidElement, useRef, useEffect, } from "react";
export function incrementIndexSafe(value, count, max, modular) {
    if (modular) {
        return (max + value + count) % max;
    }
    return Math.max(Math.min(count + value, max - 1), 0);
}
export function getIndexSafe(value, max, modular) {
    if (!modular)
        return Math.min(max - 1, Math.max(0, value));
    return (value + max) % max;
}
export function indexDistance(value, target, max, modular) {
    if (!modular)
        return value - target;
    const distance = value - target;
    const invDistance = distance > 0 ? distance - max : distance + max;
    if (Math.abs(distance) < Math.abs(invDistance)) {
        return distance;
    }
    return invDistance;
}
export function filterChildren(children, filter) {
    const out = { activeChilds: [], inactiveChilds: [] };
    Children.forEach(children, (child) => {
        if (isValidElement(child)) {
            const { className } = child.props;
            if (className === null || className === void 0 ? void 0 : className.includes(filter)) {
                out.inactiveChilds.push(child);
            }
            else {
                out.activeChilds.push(child);
            }
        }
    });
    return out;
}
export function duplicateChildren(children, itemsPerView) {
    const count = Children.count(children);
    if (!count)
        return [];
    let childArray = Children.toArray(children);
    const minItems = Math.max(itemsPerView * 2, 3); // More robust minimum
    while (childArray.length < minItems) {
        childArray = [...childArray, ...childArray.slice(0, count)];
    }
    return childArray;
}
export var ItemPosition;
(function (ItemPosition) {
    ItemPosition["HIDDEN"] = "hidden";
    ItemPosition["PREV"] = "prev";
    ItemPosition["NEXT"] = "next";
    ItemPosition["AFTER"] = "after";
    ItemPosition["BEFORE"] = "before";
    ItemPosition["ACTIVE"] = "active";
})(ItemPosition || (ItemPosition = {}));
export function getItemPosition(distance, perView) {
    if (distance === 0) {
        return ItemPosition.ACTIVE;
    }
    if (distance === -1) {
        return ItemPosition.PREV;
    }
    if (distance === 1) {
        return ItemPosition.NEXT;
    }
    if (Math.abs(distance) > perView / 2 + 1) {
        return ItemPosition.HIDDEN;
    }
    if (distance < 0) {
        return ItemPosition.BEFORE;
    }
    return ItemPosition.AFTER;
}
function throttle(func, limit) {
    let inThrottle = false;
    return function (...args) {
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
export function useNavigation({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onKeysUp: keyboardNavigation, swipeThreshold, keyboardEventThrottle, }) {
    const touchStart = useRef(null);
    const touchEnd = useRef(null);
    const threshold = swipeThreshold;
    const onKeyUp = (ev) => {
        for (let key in keyboardNavigation) {
            if (ev.key == key) {
                keyboardNavigation[key]();
            }
        }
    };
    useEffect(() => {
        const handle = throttle(onKeyUp, keyboardEventThrottle);
        window.addEventListener("keyup", handle);
        return () => window.removeEventListener("keyup", handle);
    }, []);
    const onTouchStart = (e) => {
        touchEnd.current = e.nativeEvent.targetTouches[0];
        touchStart.current = e.nativeEvent.targetTouches[0];
    };
    const onTouchMove = (e) => (touchEnd.current = e.nativeEvent.targetTouches[0]);
    const onTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current)
            return;
        const distanceX = touchEnd.current.clientX - touchStart.current.clientX;
        const distanceY = touchEnd.current.clientY - touchStart.current.clientY;
        if (distanceX > threshold) {
            onSwipeRight();
        }
        if (distanceX < -threshold) {
            onSwipeLeft();
        }
        if (distanceY > threshold) {
            onSwipeDown();
        }
        if (distanceY < -threshold) {
            onSwipeUp();
        }
    };
    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd,
    };
}
//# sourceMappingURL=utils.js.map