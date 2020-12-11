import logo from './logo.svg';
import './App.css';
import React,  { useState, useEffect, Fragment, useRef } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import { getGames } from './helpers.js';
import Modal from 'react-bootstrap/Modal';


function App() {

  var page = 0;
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

  function InfiniteList() {
    const [data, setData] =  useState([]);
    const [selectedGame, setSelectedGame]= useState({show:false,data:['', '', '','','','','','','','']});
    const lastitemRef = useRef();
    var animdelay=0;

    async function fetchMoreListItems() {
      page++;
      const photos_resp = await getGames(page);
      const newPhotos = [...data, ...photos_resp];
      setData(newPhotos);
    }
  
      return (
        <Fragment>
          {data.map((photo, i) => { 
            let gameInfo = photo.info;
            animdelay++
            return <div key={i} className="xl-2 lg-3 md-4 sm-6 xs-12 posterdiv" 
              style={{'marginBottom': '20px', width:"250px", height:"350px",
              backgroundImage: "url(" + photo.src + ")", backgroundSize: "100%", 
              backgroundRepeat  : 'no-repeat', backgroundPosition: 'center', 
              animationDelay: '.'+(animdelay===9 ? animdelay=0 : animdelay)+'s'}}
              onClick={() => {setSelectedGame({show: true, data: gameInfo.game_screenshots})}}>
              {
                gameInfo &&
                <div style={{position:'absolute', bottom:'0px',right: '5%',left: '5%',
                 paddingBottom:'20px', paddingTop:'20px', textAlign:'center'}}>
                  <GameBadges gameBadgesData={gameInfo.game_genres}/>
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
        centered={true}
      >
        <Modal.Body>
          <Carousel interval={null} indicators={false}>
          {selectedGame.data.map((e, i) => {
              return <Carousel.Item>
                <img alt=""
                  className="d-block fit-image"
                  src={selectedGame.data[i] ? selectedGame.data[i] : ''}
                />
              </Carousel.Item>   
            })}
          </Carousel>
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
    };
  });

  return (
    <div ref={props.lastitemRef}>
    <span><img src={logo} className="App-logo" alt="logo" /></span>
    </div>
  );
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

