import logo from './logo.svg';
import './App.css';
import React,  { useState, useEffect, Fragment, useRef } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import { getGames } from './helpers.js';
import Modal from 'react-bootstrap/Modal';


function GamesNews() {

  var page = 0;
  return (
      <Container>
        <Row>
        <InfiniteList/>
      </Row>
      </Container>
  );

  function InfiniteList() {
    const [data, setData] =  useState([]);
    const [selectedGame, setSelectedGame]= useState({show:false,data:['', '', '','','','','','','','']});
    const lastitemRef = useRef();
    var animdelay=-1;

    async function fetchMoreListItems() {
      page++;
      const photos_resp = await getGames(page);
      const newPhotos = [...data, ...photos_resp];
      setData(newPhotos);
    }
  
      return (
        <Fragment>
          {data.map((game, i) => { 
            let gameInfo = game.info;
            let gameTitle = game.title;
            animdelay++
            return <div key={i} className="xl-2 lg-3 md-4 sm-6 xs-12 posterdiv" 
              style={{'marginBottom': '20px', width:"250px", height:"350px", position:"relative", 
              animationDelay: '.'+(animdelay===9 ? animdelay=0 : animdelay)+'s'}} 
              onClick={() => {setSelectedGame({show: true, data: gameInfo.game_screenshots})}}>
                <img src={game.src} alt={gameTitle}></img>
              
                <div style={{position:'absolute', top:'0px', textAlign:'center', width:"100%"}}>
                  <Badge variant="dark" style={{whiteSpace: "normal"}}>{gameTitle}</Badge>
                </div>
              { 
                gameInfo && gameInfo.game_genres && gameInfo.game_tags &&
                <div style={{position:'absolute', bottom:'0px',right: '5%',left: '5%',
                 paddingBottom:'20px', paddingTop:'20px', textAlign:'center'}}>
                 
                  <GameBadges gameBadgesData={[...gameInfo.game_genres , ...gameInfo.game_tags]}/>
                </div>
              }

            </div>
          })}
          <LastItem className="loading" lastitemRef={lastitemRef} onScreen={fetchMoreListItems} />
          
          <Modal
            size="lg"
            show={selectedGame.show}
            onHide={() => setSelectedGame({show: false, data: selectedGame.data})}
            aria-labelledby="example-custom-modal-styling-title"
            centered={true}>
            <Modal.Body className="text-center">
            { selectedGame.data && (typeof selectedGame.data[0] !== "undefined") &&
              <Carousel interval={null} indicators={false}>
                {selectedGame.data.map((e, i) => {
                  return <Carousel.Item key={i}>
                    <img alt=""
                      className="d-block w-100"
                      src={selectedGame.data[i] ? selectedGame.data[i] : ''}
                    />
                  </Carousel.Item>   
                })}
              </Carousel>
            }
            { selectedGame.data && (typeof selectedGame.data[0] === "undefined") &&
              <span>No screenshots found</span>}
            </Modal.Body>
          </Modal>
        </Fragment>
      );
  }
}

function LastItem(props) {
  const [fetching, setFetching] = useState(false);

  const isOnScreen = () => {
    let top  = props.lastitemRef.current.getBoundingClientRect().top;
    return top <= window.innerHeight;
  };

  const checkOnScreen = () => {
    const onScreen = isOnScreen();
    if (onScreen && !fetching) {
      const asyncFetch = async () => {
        setFetching(true);
        await props.onScreen();
        setFetching(false);
      };
      asyncFetch();
    }
  };

  useEffect(() => {
    checkOnScreen();
    
    window.addEventListener('scroll', checkOnScreen);

    // cleanup this component
    return () => {
      window.removeEventListener('scroll', checkOnScreen);
    }
  });

  return (
    <div ref={props.lastitemRef}>
    <span><img src={logo} className="App-logo" alt="logo" /></span>
    </div>
  )
};

function GameBadges (props) {
  
  let gameBadgesData = props.gameBadgesData;
  let gamebadges = gameBadgesData.map( (genre, index) => {
    return <Badge key={index} variant="primary">{genre}</Badge>
  })
  return gamebadges;  
}

export default GamesNews;