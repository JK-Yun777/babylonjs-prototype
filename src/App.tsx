import { BrowserRouter, Route, Switch } from "react-router-dom";

import Main from "./pages/Main";
import Sub from "./pages/Sub";
import Third from "./pages/Third";
import MainScene from "./components/MainScene";
import Video from "./components/Video";

function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Main} />
          <Route path="/fpv" exact component={Sub} />
          <Route path="/door" exact component={Third} />
          <Route path="/main" exact component={MainScene} />
          <Route path="/video" exact component={Video} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
