import './App.css';
import React from 'react';
import MoviesNews from './MoviesNews';
import GamesNews from './GamesNews';
import { Route, Switch, NavLink, Redirect } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';



function App() {

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
      <div className="link-container">
        
        
      </div>
      <Navbar bg="dark" variant="dark" style={{marginBottom: '20px'}}>
        <Nav className="mx-auto">
          <NavLink activeClassName="active" className="nav-link" to="/games">
          Games
        </NavLink>
        <NavLink activeClassName="active" className="nav-link" to="/movies">
          Movies
        </NavLink>
        </Nav>
      </Navbar>
      <Switch>
        <Route exact path="/">
            <Redirect to="/games" />
        </Route>
        <Route path="/games" exact component={GamesNews} />
        <Route path="/movies" component={MoviesNews} />
      </Switch>
    </div>
  );
}

export default App;

