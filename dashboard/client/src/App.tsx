import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from '@material-ui/core/styles';
import React, { useState } from "react";
import { Provider } from "react-redux";
import { HashRouter, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Events from "./pages/event/Events";
import BasicLayout from "./pages/layout";
import { Logs } from "./pages/log/Logs";
import Node from "./pages/node";
import NodeDetail from "./pages/node/NodeDetail";
import { store } from "./store";
import { darkTheme, lightTheme } from "./theme";
import CMDResult from "./pages/cmd/CMDResult";

const RAY_DASHBOARD_THEME_KEY = 'ray-dashboard-theme';

const getDefaultTheme = () => window.localStorage.getItem(RAY_DASHBOARD_THEME_KEY) || 'light';
const setLocalTheme = (theme: string) => window.localStorage.setItem(RAY_DASHBOARD_THEME_KEY, theme);

const App = () => {
  const [theme, _setTheme] = useState(getDefaultTheme());
  const getTheme = (name: string) => {
    switch (name) {
      case 'dark':
        return darkTheme;
      case 'light':
      default:
        return lightTheme;
    }
  }
  const setTheme = (name: string) => {
    setLocalTheme(name);
    _setTheme(name);
  }

  return (
    <ThemeProvider theme={getTheme(theme)}>
      <Provider store={store}>
        <CssBaseline />
        <HashRouter>
          <Route render={props => <BasicLayout {...props} setTheme={setTheme} theme={theme}>
            <Route component={Dashboard} exact path="/" />
            <Route component={Node} exact path="/node" />
            <Route component={Events} exact path="/event" />
            <Route render={props => <Logs {...props} theme={theme as 'light' | 'dark'} />} exact path="/log/:host?/:path?" />
            <Route component={NodeDetail} path="/node/:id" />
            <Route component={CMDResult} path="/cmd/:cmd/:ip/:pid" />
          </BasicLayout>} path="/" />
        </HashRouter>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
