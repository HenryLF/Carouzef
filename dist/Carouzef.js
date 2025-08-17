import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Children, createContext, isValidElement, useCallback, useContext, useEffect, useMemo, useReducer, } from "react";
import { duplicateChildren, filterChildren, getIndexSafe, getItemPosition, incrementIndexSafe, indexDistance, useNavigation, } from "./utils";
import "./carouzef.css";
const CarouzefContextComp = createContext(null);
export function useCarouzef() {
    return useContext(CarouzefContextComp);
}
const ItemContextComp = createContext(null);
export function useCarouzefItem() {
    return useContext(ItemContextComp);
}
var ActionType;
(function (ActionType) {
    ActionType["INCR"] = "increment_index";
    ActionType["SET"] = "set_index";
})(ActionType || (ActionType = {}));
function reducerFunction(prevState, { type, arg }) {
    let index;
    switch (type) {
        case ActionType.INCR:
            index = incrementIndexSafe(prevState.index, arg, prevState.numberOfItems, prevState.loop);
            return Object.assign(Object.assign({}, prevState), { index });
        case ActionType.SET:
            index = getIndexSafe(arg, prevState.numberOfItems, prevState.loop);
            return Object.assign(Object.assign({}, prevState), { index });
        default:
            return prevState;
    }
}
const defaultAutoPlayConfig = {
    interval: 3000,
    step: 1,
};
export function Carouzef({ children, startingItem = 0, itemsPerView = 2, loop = true, autoPlay, cssStyle, changeItemOnClick = true, swipeThreshold = 50, keyboardEventThrottle = 500, keyboardNavigation = { ArrowLeft: "previous", ArrowRight: "next" }, axis = "horizontal", }) {
    const [itemArray, activeChilds, inactiveChilds] = useMemo(() => {
        const { activeChilds, inactiveChilds } = filterChildren(children, "carouzef-ignore");
        return [
            duplicateChildren(activeChilds, itemsPerView),
            activeChilds,
            inactiveChilds,
        ];
    }, [children, itemsPerView]);
    const numberOfItems = Children.count(itemArray);
    const initialState = {
        index: getIndexSafe(startingItem, numberOfItems, loop),
        itemsPerView: itemsPerView,
        numberOfItems,
        realNumberOfItems: activeChilds.length,
        loop,
    };
    const autoPlayConfig = Object.assign({}, defaultAutoPlayConfig);
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
    const style = Object.assign({ "--items-per-view": itemsPerView }, cssStyle);
    console.log(style);
    const setIndex = useCallback((arg) => setValue({ type: ActionType.SET, arg }), []);
    const incrementIndex = useCallback((arg) => setValue({ type: ActionType.INCR, arg }), []);
    const [value, setValue] = useReducer(reducerFunction, initialState);
    const verticalAxis = axis == "vertical";
    const onKeysUp = {};
    for (let key in keyboardNavigation) {
        if (keyboardNavigation[key] == "next") {
            onKeysUp[key] = () => incrementIndex(1);
        }
        else {
            onKeysUp[key] = () => incrementIndex(-1);
        }
    }
    const navigationHandles = useNavigation({
        onSwipeLeft: !verticalAxis ? () => incrementIndex(1) : () => { },
        onSwipeRight: !verticalAxis ? () => incrementIndex(-1) : () => { },
        onSwipeUp: verticalAxis ? () => incrementIndex(1) : () => { },
        onSwipeDown: verticalAxis ? () => incrementIndex(-1) : () => { },
        onKeysUp,
        swipeThreshold,
        keyboardEventThrottle,
    });
    useEffect(() => {
        const cleanUp = [() => { }];
        if (autoPlay && autoPlayConfig) {
            const interval = setInterval(() => incrementIndex(1), autoPlayConfig.interval);
            cleanUp.push(() => {
                clearInterval(interval);
            });
        }
        return () => cleanUp.forEach((e) => e());
    }, [autoPlay]);
    return (_jsx("div", Object.assign({ style: style }, navigationHandles, { className: "carousel-container", children: _jsxs(CarouzefContextComp.Provider, { value: Object.assign({ setIndex,
                incrementIndex }, value), children: [Children.map(itemArray, (child, id) => (_jsx(Item, { index: id, changeItemOnClick: changeItemOnClick, axis: axis, children: child }, id))), inactiveChilds] }) })));
}
function Item({ children, index, changeItemOnClick, axis }) {
    const mainContext = useCarouzef();
    if (!mainContext)
        return children;
    const toActiveIndex = indexDistance(index, mainContext.index, mainContext.numberOfItems, mainContext.loop);
    const cssSize = {};
    if (axis == "horizontal") {
        cssSize["height"] = "auto";
    }
    else {
        cssSize["width"] = "auto";
    }
    const style = Object.assign({ "--item-index": `${index}`, "--distance-to-active": `${toActiveIndex}` }, cssSize);
    if (isValidElement(children)) {
        const childStyle = children.props
            .cssStyle;
        if (childStyle) {
            Object.assign(style, childStyle);
        }
    }
    const position = getItemPosition(toActiveIndex, mainContext.itemsPerView);
    const onClickCapture = (ev) => {
        if (index != (mainContext === null || mainContext === void 0 ? void 0 : mainContext.index)) {
            ev.stopPropagation();
            ev.preventDefault();
            mainContext.setIndex(index);
        }
    };
    return (_jsx("div", { onClickCapture: changeItemOnClick ? onClickCapture : () => { }, className: `carousel-item carousel-item-${position}`, style: style, children: _jsx(ItemContextComp.Provider, { value: {
                index: index,
                activeIndex: mainContext === null || mainContext === void 0 ? void 0 : mainContext.index,
                toActiveIndex,
                position,
            }, children: children }) }));
}
//# sourceMappingURL=Carouzef.js.map