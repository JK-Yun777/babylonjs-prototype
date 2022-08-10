import { BrowserRouter, Route, Switch } from "react-router-dom";

import Main from "./pages/Main";
import Sub from "./pages/Sub";
import Third from "./pages/Third";
import Fourth from "./pages/Fourth";
import Video from "./components/Video";
import Fifth from "./pages/Fifth";

function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Main} />
          <Route path="/fpv" exact component={Sub} />
          <Route path="/door" exact component={Third} />
          <Route path="/main" exact component={Fourth} />
          <Route path="/video" exact component={Video} />
          <Route path="/village" exact component={Fifth} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
