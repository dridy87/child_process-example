const puppeteer = require('puppeteer');
const $ = require('cheerio');
const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dridy:fkawk1@cluster0.etzbx.mongodb.net/dridy?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

var _code = process.argv[2];
//https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyByPiFzLn8FcE16Wh-BmZ1aSwmiJ8g7bbQ

async function printConsole(content) {
    //console.log(content)


    const body = $.load(content);

    const anchorsSelector = '.html-attribute';
    var anchors = [];

    var classify = {
        code: '',
        cname: '',
        data: [],
        dt: ''
    }
    body(anchorsSelector).each(function () {
        //console.log($(this))
        anchors.push($(this));
    });
    if (anchors.length > 0) {
        var i = 0;

        for (const el of anchors) {

            console.log(el.text())

            var _el = el.text().split('=');
            // console.log(_el[0])
            // console.log(_el[1])
            if (_el[0].trim() == 'symbol') {

                console.log('종목코드: ' + _el[1].replace(/\"/gi, "").trim());
                classify.code = _el[1].replace(/\"/gi, "").trim();
            } else if (_el[0].trim() == 'name') {
                console.log('종목이름: ' + _el[1].replace(/\"/gi, "").trim());
                classify.cname = _el[1].replace(/\"/gi, "").trim();
            } else if (_el[0].trim() == 'data') {
                console.log('data: ' + _el[1].replace(/\"/gi, "").trim());
                var _data = _el[1].replace(/\"/gi, "").trim().split('|');

                var stockData = {
                    dt: '',
                    open: '',
                    high: '',
                    low: '',
                    close: '',
                    volume: ''

                }
                for (var i = 0; i < _data.length; i++) {


                    switch (i) {
                        case 0:
                            console.log('dt: ' + _data[i]);
                            stockData.dt = _data[i];
                            break;
                        case 1:
                            console.log('시가: ' + _data[i]);
                            stockData.open = _data[i];
                            break;
                        case 2:
                            console.log('고가: ' + _data[i]);
                            stockData.high = _data[i];
                            break;
                        case 3:
                            console.log('저가: ' + _data[i]);
                            stockData.low = _data[i];
                            break;
                        case 4:
                            console.log('종가: ' + _data[i]);
                            stockData.close = _data[i];
                            break;
                        case 5:
                            console.log('거래량: ' + _data[i]);
                            stockData.volume = _data[i];
                            break;
                        default:
                            break;
                    }
                }

                classify.data.push(stockData);
            }


        }

        console.log(classify)

        client.connect(err => {
            const collection = client.db("dridy").collection("stockData");
            console.log('stock_data~~~ Insert')
            try {
                collection.insertOne(classify, function (err, res) {
                    client.close();
                })

            } catch (e) {
                console.log(e);
            }


        });
    }
}

(async () => {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();

    //console.log("https://finance.naver.com" + a)
    await page.goto("https://fchart.stock.naver.com/sise.nhn?symbol=" + _code + "&timeframe=day&count=100&requestType=0", { waitUntil: "networkidle2" });
    const content = await page.content();

    await printConsole(content)

    await browser.close();


})();