import logo from './logo.svg';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import React, { useState, useEffect } from 'react';
import {getMovies } from './helpers.js';


function MoviesNews() {
  const [data, setData] =  useState([]);
  const [fetching, setFetching] = useState(true);
  let animdelay = 0.0;
  
  useEffect(() => {
    fetchMoreListItems()
  },[]);

  async function fetchMoreListItems() {
    const movies_req = await getMovies();
    setData(movies_req);
    setFetching(false);
    console.log(movies_req);
  }

  return (
      <Container>
      {fetching && <span><img src={logo} className="App-logo" alt="logo" /></span>}
      {data.map((movie, i) => {
        animdelay=animdelay+0.1
        return <Card key={i} className="xl-2 lg-3 md-4 sm-6 xs-12 posterdiv" 
        style={{ width: '150px', display: "inline-block", margin: "5px",
         backgroundColor: "transparent", border: "0px",  verticalAlign:"top",
          animationDelay: animdelay+'s' }}>
          <Card.Img style={{width:"150px", height:"215px"}} variant="top" src={movie.src} />
          <Card.Body>
            <Card.Text>
              <Badge variant="dark" style={{whiteSpace: "normal"}}>{movie.title}</Badge>
              {movie.genres.map( (genre, index) => {
                return <Badge key={index} variant="primary">{genre}</Badge>
              })}
            </Card.Text>
          </Card.Body>
        </Card>
      })}
      </Container>
  );
}

export default MoviesNews;