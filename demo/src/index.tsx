import React, { CSSProperties } from "react";
import ReactDOM from "react-dom/client";
import { Carouzef } from "../../Carouzef";
import "../../css/sphere.css"

function App() {
  const divStyle: CSSProperties = {
    width: "95%",
    height: "30vh",
    border: "2px solid black",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    fontSize: "5rem",
  };
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Carouzef itemsPerView={3} autoPlay={true}>
        <div style={{ ...divStyle, backgroundColor: "green" }}>1</div>
        <div style={{ ...divStyle, backgroundColor: "blue" }}>2</div>
        <div style={{ ...divStyle, backgroundColor: "orange" }}>3</div>
        <div style={{ ...divStyle, backgroundColor: "purple" }}>4</div>
        <div style={{ ...divStyle, backgroundColor: "yellow" }}>5</div>
        <div style={{ ...divStyle, backgroundColor: "red" }}>6</div>
      </Carouzef>
    </main>
  );
}
//@ts-expect-error
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
