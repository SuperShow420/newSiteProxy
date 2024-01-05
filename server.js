const express = require('express')
const port = 80
const cors = require('cors')
const app = express()
const cheerio = require('cheerio');

app.use(cors());
app.use(express.json());


app.listen(port, () => {
    console.log("listening on port 80")
})


import('node-fetch').then((module) => {
    const fetch = module.default;
    app.post('/hh', async (req, res) => {
      try {
        const url = `https://hentaihaven.xxx/watch/${req.body.hhId}`;
        const response = await fetch(url);
        const htmlContent = await response.text();
        const $ = cheerio.load(htmlContent);

        const iframeSrcArray = [];
            $('iframe').each((index, element) => {
                const src = $(element).attr('src');
                iframeSrcArray.push(src);
            });

            res.status(200).json(iframeSrcArray[2]);

      } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).send('Internal Server Error');
      }
    })

    app.get('/ha/:anime/:ep', async (req, res) => {

      console.log('vefv',req.body)
      try {
        const url = `https://hanime.tv/videos/hentai/${req.params.anime}-${req.params.ep}`;
        const response = await fetch(url);
        const htmlContent = await response.text();
        const $ = cheerio.load(htmlContent);

        const img = $(".hvpi-cover").attr('src')
        const releaseDateHeader = $('.hvpimbc-header:contains("Release Date")');
        const released = releaseDateHeader.next('.hvpimbc-text').text();
        const alternateTitlesHeader = $('.hvpimbc-header:contains("Alternate Titles")');
        const alternateTitles = alternateTitlesHeader.next('.hvpimbc-text').text();
        const description = $(".hvpist-description p").text()
        const hvpisTextElement = $('.hvpis-text.grey--text.text--lighten-1');
        const tags = hvpisTextElement.find('.btn__content').map((index, element) => $(element).text()).get();

        res.status(200).json({
          "img" : img,
          "released" : released,
          "alternateTitle" : alternateTitles,
          "description" : description,
          "tags" : tags
        });

      } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).send('Internal Server Error');
      }
    })

    app.post('/nh', async (req, res) => {

      console.log('vefv',req.body)
      try {
        const url = `https://nhentai.to/g/${req.body.nhId}`;
        const response = await fetch(url);
        const htmlContent = await response.text();
        const $ = cheerio.load(htmlContent);

        const poster = $('#cover img').attr('src')
        console.log(poster)
        const title = $("h1").text()
        const otherNames = $("h2").text()
        const tagsContainer = $(".tags").eq(1);
        
        const tagItems = tagsContainer.find('.name');
        
        const tagTexts = tagItems.map((index, element) => $(element).text()).get();
        
        console.log(tagTexts);
        
        const langContainer = $(".tags").eq(2);
        
        const langItems = tagsContainer.find('.name');
        
        const langTexts = tagItems.map((index, element) => $(element).text()).get();

        console.log(langTexts);

        const pgCountContainer = $(".tags").eq(4);
        
        const pgCount = parseInt(pgCountContainer.find('.name').text());

        const uploaded = $("time").text()

        const gallery = $("#thumbnail-container")
        
        const galleryItem = gallery.find('img');
        
        const imgSrc = galleryItem.map((index, element) => $(element).attr('data-src')).get();
        
        console.log(imgSrc);

        res.status(200).json({
          "img" : poster,
          "title" : title,
          "otherNames" : otherNames,
          "tags" : tagTexts,
          "lang" : langTexts,
          "pgCount" : pgCount,
          "uploaded" : uploaded,
          "pages" : imgSrc
        });

      } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).send('Internal Server Error');
      }
    })

    app.get('/nh/:id/:pg', async (req, res) => {

      console.log('vefv',req.body)
      try {
        const url = `https://nhentai.to/g/${req.params.id}/${req.params.pg}`;
        const response = await fetch(url);
        const htmlContent = await response.text();
        const $ = cheerio.load(htmlContent);

        const img = $(".fit-horizontal").attr('src')

        res.status(200).json({
          "img" : img
        });

      } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).send('Internal Server Error');
      }
    })
  })
