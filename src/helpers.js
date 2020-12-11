const axios = require('axios');
const cheerio = require('cheerio');

export async function getGames(page) {
    const proxyurl_cors = "https://whispering-falls-66092.herokuapp.com/";
    
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
    "https://api.rawg.io/api/games?key=06297f268fe14959b425f9315a01218b&page_size=1&search=";

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
          /*
          let game_tags = game_data.tags.map(item => (
          //(item.name).toLowerCase().includes(players_tags) && item
          item.name
          ))
          */
          let game_screenshots = game_data.short_screenshots.map(item => (
          item.image
          ))
          allGames[index].info = {
            game_name: game_data.name,
            game_genres: game_genres,
            //game_tags: game_tags,
            game_screenshots: game_screenshots
        }
      })
      })
    )
    .catch(errors => {
        // react on errors.
        console.error(errors);
    });

    console.log(allGames);
  return allGames;
}