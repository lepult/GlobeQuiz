import React from "react";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./redux-modules/store";

const AppWrapper = () => (
    <Provider store={store}>
        <App/>
    </Provider>
)

export default AppWrapper;