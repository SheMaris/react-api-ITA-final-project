import React from "react";
import Container from 'react-bootstrap/Container';

import {getMovies } from './helpers.js';


function MoviesNews() {
    //fetchMoreListItems()
    
  return (
      <Container>
        
      </Container>
  )};
export default () => {
  return <MoviesNews/>;
};

async function fetchMoreListItems() {
    const movies_req = await getMovies();
    console.log(movies_req);
}