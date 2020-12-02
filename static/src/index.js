// Copyright 2020 Dell Inc, or its subsidiaries.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

/**
 * Renders our component into the HTML element with the id "plugin-example-root",
 * defined in templates/index.html.
 */
ReactDOM.render(<App />, document.getElementById("plugin-example-root"));