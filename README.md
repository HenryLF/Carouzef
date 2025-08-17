# React Carouzef - A Flexible and Interactive Carousel Component

![Carouzef Preview](gif/default.gif)

If you kwnow CSS and don't want or **need** to go through the

## Features

- 🔄 **Smart Looping**: Seamless infinite scrolling with automatic item duplication
- ⚡️ **Auto-Play**: Configurable rotation with custom intervals and step sizes
- 👆 **Intuitive Controls**: Swipe gestures, click navigation, and direct item selection
- 🧩 **CSS Customization**: Write your own carousel animations and import them in your components.
- 🚫 **Ignorable Children**: Special class to exclude elements from carousel flow
- ⚛️ **React Hooks API**: `useCarouzef` and `useCarouzefItem` for advanced customization
- 📱 **Responsive Design**: Adapts to different screen sizes and item counts
- 🧪 **TypeScript Support**: Fully typed components and hooks

## Installation

```bash
npm install carouzef
# or
yarn add carouzef
```

## Usage

### Basic Implementation

```jsx
import { Carouzef } from "carouzef";
import "sphere.css"; // Import your css

function MyCarousel() {
  return (
    <div className="carousel">
      <Carouzef itemsPerView={3} autoPlay={true}>
        <div style={{ ...divStyle, backgroundColor: "red" }}>0</div>
        <div style={{ ...divStyle, backgroundColor: "green" }}>1</div>
        <div style={{ ...divStyle, backgroundColor: "blue" }}>2</div>
        <div style={{ ...divStyle, backgroundColor: "orange" }}>3</div>
        <div style={{ ...divStyle, backgroundColor: "purple" }}>4</div>
        <div style={{ ...divStyle, backgroundColor: "yellow" }}>5</div>
      </Carouzef>
    </div>
  );
}
```

![Carouzef Preview](gif/sphere.gif)


## Props

| Prop Name           | Type                        | Default | Description                                  |
| ------------------- | --------------------------- | ------- | -------------------------------------------- |
| `itemsPerView`      | number                      | `2`     | Number of items visible at once              |
| `startingItem`      | number                      | `0`     | Initial active item index                    |
| `loop`              | boolean                     | `true`  | Enable infinite looping                      |
| `autoPlay`          | number \| object \| boolean | `false` | Auto-rotation configuration                  |
| `cssStyle`          | Record<string, string>      | `{}`    | Custom CSS variables for styling             |
| `changeItemOnClick` | boolean                     | `true`  | Enable item selection on click               |
| `swipeThreshold`    | number                      | `50`    | Minimum swipe distance to trigger navigation |

### AutoPlay Configuration

When using the `autoPlay` prop:

- **Number**: Interval in milliseconds (e.g., `3000`)
- **Object**:
  ```ts
  {
    interval: number, // Required
    step?: number     // Optional (default: 1)
  }
  ```
- **Boolean**: `true` uses default interval of 3000ms

## Hooks

### `useCarouzef()`

Provides access to carousel state and navigation methods:

```ts
interface CarouzefContext {
  index: number; // Current active index
  numberOfItems: number; // Total items (including duplicates)
  realNumberOfItems: number; // Original item count
  itemsPerView: number; // Visible items
  loop: boolean; // Looping enabled
  incrementIndex: (n: number) => void; // Navigate by n items
  setIndex: (n: number) => void; // Set specific index
}
```

### `useCarouzefItem()`

Provides context for individual carousel items:

```ts
interface ItemContext {
  index: number; // Item index
  activeIndex: number; // Current active index
  toActiveIndex: number; // Relative position to active item
  position: ItemPosition; // Position classification
}

enum ItemPosition {
  HIDDEN = "hidden",
  PREV = "prev",
  NEXT = "next",
  AFTER = "after",
  BEFORE = "before",
  ACTIVE = "active",
}
```

## Styling Options

Choose from multiple built-in styles by importing the corresponding CSS file:

1. **Sphere Effect** (`sphere.css`)

   ```js
   import "carouzef/dist/sphere.css";
   ```

2. **Cube Effect** (`cube.css`)

   ```js
   import "carouzef/dist/cube.css";
   ```

3. **Throw Effect** (`throw.css`)

   ```js
   import "carouzef/dist/throw.css";
   ```

4. **Default Effect** (`default.css`)
   ```js
   import "carouzef/dist/default.css";
   ```

### Custom Styling

Customize the carousel using CSS variables:

```jsx
<Carouzef
  cssStyle={{
    "--perspective": "1200px",
    "--translate-z": "180px",
    "--scale": "0.8",
    "--spin": "45deg",
  }}
>
  {/* ... */}
</Carouzef>
```

## Item Positioning

Each carousel item receives a position class based on its relation to the active item:

- `.Carouzef-item-active`: Currently centered item
- `.Carouzef-item-prev`: Immediately before active
- `.Carouzef-item-next`: Immediately after active
- `.Carouzef-item-before`: Further before active
- `.Carouzef-item-after`: Further after active
- `.Carouzef-item-hidden`: Outside visible range

## Ignoring Items

Add items that shouldn't be part of the carousel flow by including the `Carouzef-ignore` class:

```jsx
<Carouzef itemsPerView={3}>
  <div>Carousel Item 1</div>
  <div className="Carouzef-ignore">Non-Carousel Content</div>
  <div>Carousel Item 2</div>
</Carouzef>
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

MIT © [Your Name]
