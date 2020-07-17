import React from "react";
import ReactDOM from "react-dom";
import HelloWorld from "./HelloWorld";

/**
 * Renders our component into the HTML element with the id "plugin-example-root",
 * defined in example/templates/index.html.
 */
ReactDOM.render(<HelloWorld />, document.getElementById("plugin-example-root"));