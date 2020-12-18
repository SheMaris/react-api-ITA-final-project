import './App.css';
import MoviesNews from './MoviesNews';
import GamesNews from './GamesNews';
import { Route, Switch, Link, NavLink, Redirect } from "react-router-dom";

function App() {

  var page = 0;
  /*return (
    <div className="App overflowHidden">
      <header>
      </header>
      <Container>
        <Row>
        <InfiniteList/>
      </Row>
      </Container>
    </div>
  );*/

  return (
    <div className="App overflowHidden">
      <Switch>
        <Route exact path="/">
          <Redirect to="/games" />
        </Route>
        <Route path="/games" component={GamesNews} />
        <Route path="/movies" component={MoviesNews} />
      </Switch>
    </div>
  );
}

export default App;

