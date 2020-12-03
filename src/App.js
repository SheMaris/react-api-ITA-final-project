import logo from './logo.svg';
import './App.css';
import React,  { useState, useEffect, Fragment, useRef } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import { getGames } from './helpers.js';


function App() {
  let page = 0;
  
function InfiniteList() {
  const [data, setData] =  useState([]);
  const lastitemRef = useRef();
  var animdelay_arr=[0,1,2,3,4,5,6,7,8];
  var animdelay=0;

  async function fetchMoreListItems() {
    console.log("fetchMoreListItems "+data.length+ " PAGE "+page);
    page++;
    const photos_resp = await getGames(page);
    const newPhotos = [...data, ...photos_resp];
    setData(newPhotos);
  }

    return (
      <Fragment>
        {console.log(" render fragment "+data.length)}
        {data.map((photo, i) => { 
          let gameInfo = photo.info;
          animdelay++
          return <div key={i} className="xl-2 lg-3 md-4 sm-6 xs-12 posterdiv" 
            style={{'marginBottom': '20px', width:"250px", height:"350px",
            backgroundImage: "url(" + photo.src + ")", backgroundSize: "100%", 
            backgroundRepeat  : 'no-repeat', backgroundPosition: 'center', 
            animationDelay: '.'+animdelay_arr[(animdelay===10 ? animdelay=0 : animdelay)]+'s'}}>
            {
              gameInfo &&
            <GameInfoCarousel gameInfo={gameInfo} index_game={photo.id}/>
            }
          </div>
        })}
        <LastItem className="loading" lastitemRef={lastitemRef} onScreen={fetchMoreListItems} />
      </Fragment>
    );
}

function LastItem(props) {
  const [fetching, setFetching] = useState(false);

  const isOnScreen = () => {
    let top  = props.lastitemRef.current.getBoundingClientRect().top;
    return top <= window.innerHeight;
  };

  const checkOnScreen = () => {
    console.log("checkOnScreen");
    const onScreen = isOnScreen();
    if (onScreen && !fetching) {
      const asyncFetch = async () => {
        setFetching(true);
        console.log("is onscreen and is fetching");
        await props.onScreen();
        console.log("is onscreen and is not fetching");
        setFetching(false);
      };
      asyncFetch();
    }
  };

  useEffect(() => {
    console.log("LastItem useEffect")
    checkOnScreen();
    window.addEventListener('scroll', checkOnScreen);

    // cleanup this component
    return () => {
      console.log("CLEAN");
      window.removeEventListener('scroll', checkOnScreen);
    };
  });

  return (
    <div ref={props.lastitemRef}>
    {console.log("render loading")}
    <span><img src={logo} className="App-logo" alt="logo" /></span>
    </div>
  );
}

  return (
    <div className="App">
      <header>
      </header>
      <Container>
      <Row>
        <InfiniteList/>
      </Row>
      </Container>
    </div>
  );
}

function GameInfoCarousel (props) {
    let gameInfo = props.gameInfo;
    let index_game = props.index_game;
    let screenshot1 = null;
    let screenshot2 = null;
    let screenshot3 = null;
    if (gameInfo) screenshot1 = gameInfo.game_screenshots[0];
    if (gameInfo) screenshot2 = gameInfo.game_screenshots[1];
    if (gameInfo) screenshot3 = gameInfo.game_screenshots[2];

    return <Carousel key={index_game} interval={null} indicators={false}>
      <Carousel.Item>
        <Carousel.Caption>
          <GameBadges gameBadgesData={gameInfo.game_genres}/>
        </Carousel.Caption>
      </Carousel.Item>
      { screenshot1 &&
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={ screenshot1 }
          />
        </Carousel.Item>
      }
      { screenshot2 &&
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={ screenshot2 }
          />
        </Carousel.Item>
      }
      { screenshot3 &&
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={ screenshot3 }
          />
        </Carousel.Item>
      }
    </Carousel>
  }

function GameBadges (props) {
  const players_tags = ["singleplayer", "multiplayer", "co-op", "co-op online"];
  let gameBadgesData = props.gameBadgesData;
  let gamebadges = gameBadgesData.map( (genre, index) => {
    return <Badge key={index} variant="primary">{genre}</Badge>
  })
  return gamebadges;  
}



export default App;

