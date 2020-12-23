const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();
const SECRET_RAWG_API_URL = "https://api.rawg.io/api/games?key="+process.env.REACT_APP_RAWG_API_KEY;

export async function getGames(page) {
    const proxyurl_cors = process.env.REACT_APP_MY_PROXY_URL_CORS;
    
    let page_link = "";
    if (page>1){
      page_link = 'page/'+(page++)+'/';
    }
    const scrapedpage = "https://skidrowreloaded.com/"+page_link;
    
    const pageContent = await axios.get(proxyurl_cors + scrapedpage);
    
    const $ = cheerio.load(pageContent.data);
    const allGames = [];

    let requestList=[];
    let req =
    SECRET_RAWG_API_URL+"&page_size=1&search=";

    
    $('#main-content .post-excerpt a>img').map((_, el) => {
        el = $(el);
        const title = el.attr('alt');
        const imageurl = el.attr('data-lazy-src');
        //const link = el.parentNode.getAttribute('href');
        const link = el.parent().attr('href');
        allGames.push({
          src: imageurl,
          title: title,
          link: link,
          info:[]
        })

        //prepare api call for info of each game
        let item_game_name = title.toLowerCase().replace('early access','').split('-')[0];
        requestList.push(axios.get(req+item_game_name));
        return allGames;
    }).get();

    const players_tags = ["Singleplayer", "Multiplayer", "Co-op"];

    await axios
    .all(requestList)
    .then(
      axios.spread((...responses) => {
      // use/access the results
      responses.forEach((item,index)=>{
          let game_data = item.data.results[0];
          let game_genres = game_data.genres.map(item => (
          item.name
          ))
          let game_tags = game_data.tags.filter(item => item.language === 'eng' &&
          players_tags.includes(item.name)).map(item => item.name)
          let game_screenshots = game_data.short_screenshots.map(item => (
          item.image
          ))
          allGames[index].info = {
            game_name: game_data.name,
            game_genres: game_genres,
            game_tags: game_tags,
            game_screenshots: game_screenshots
        }
      })
      })
    )
    .catch(errors => {
        // react on errors.
        console.error(errors);
    });

  return allGames;
}

export async function getMovies() {
  const proxyurl_cors = process.env.REACT_APP_MY_PROXY_URL_CORS;
  
  const scrapedpage = "https://www.gnula.nu/";
  
  const pageContent = await axios.get(proxyurl_cors + scrapedpage);
  const $ = cheerio.load(pageContent.data);

  const allMovies = [];
  
   $('.sidebar2 .capa2 a>img').map((_, el) => {
      el = $(el);
      let movie_poster = el.attr('src').replace('3.gif', '2.gif')
      let movie_info = el.attr('title');
      let movie_info_split = movie_info.split(' - ');
      let movie_title = movie_info_split[0];
      let movie_genres = movie_info_split.pop();
      allMovies.push({
        src: movie_poster,
        title: movie_title,
        genres: movie_genres.split(', ')
      })
      return allMovies;
  }).get();

return allMovies;
}