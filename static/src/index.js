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

/**
 * We can export functions used throughout the app anywhere, but having them
 * in index.js is a common practice.
 */
export function getToken() {
    /**
     * As a plugin, we get the authorization token from DataIQ, the parent window.
     * If this is running locally in development, parent.token() will not exist.
     *
     * We could better detect development vs. production, likely using Node environment variables,
     * but will leave that as a future item.
     */
    let token = null;
    if (parent.location.hostname !== '127.0.0.1') {
      token = parent.token();
    }
    return token;
}