// get img page urls from album intro page
import ReqQueueService from 'src/service/request/ReqQueueService.js'
import IntroHtmlParser from './IntroHtmlParser.js'

class ImgUrlListParser {
    constructor(introUrl, sumOfImgPage) {
        this.introUrl = introUrl;
        this.introHtmls = {};
        this.FirstPage = {};
        this.sumOfIntroPage = this._getSumOfIntroPage(sumOfImgPage);
        this.introPageUrls = this._getIntroPageUrls();
    }

    request() {
        return new Promise((resolve, reject) => {
            this._request(resolve, reject);
        });
    }

    _getSumOfIntroPage(sumOfImgPage) {
        // 40 is the thumb sum per intro page when small thumb model
        if (sumOfImgPage < 40) {
            return 1;
        }
        let reminder = sumOfImgPage % 40;
        if (reminder > 1) {
            return (sumOfImgPage - reminder) / 40 + 1;
        } else {
            return sumOfImgPage / 40;
        }
    }

    _getIntroPageUrls() {
        let urls = [];
        for (let i = 0; i < this.sumOfIntroPage; i++) {
            urls.push(`${this.introUrl}?p=${i}`);
        }
        return urls;
    }

    _request(resolve, reject) {
        new ReqQueueService(this.introPageUrls)
            .request()
            .then(map => {
                let result = this.introPageUrls.reduce((imgUrls, introUrl) => {
                    imgUrls = imgUrls.concat(new IntroHtmlParser(map.get(introUrl), introUrl).getImgUrls());
                    return imgUrls;
                }, []);
                if (result.length !== 0) {
                    resolve(result);
                } else {
                    reject(new Error('parsing img html failed. It may be in Large mode'))
                }
            }, err => {
                reject(err);
                // TODO: show tip for this error
            });
    }
}

export default ImgUrlListParser;
