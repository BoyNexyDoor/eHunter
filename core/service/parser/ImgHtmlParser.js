// a parser for album's img page
class ImgHtmlParser {
    constructor(html) {
        this.htmlText = html.replace(/src=/g, 'x-src='); // avoid load assets
        this.html = document.createElement('html');
        this.html.innerHTML = this.htmlText;
        this.document = this.html.ownerDocument;
        this._initI2Element();
        this._initImgSizeInfo();
        return this;
    }

    getTitle() {
        return this.html.querySelector('h1').textContent;
    }

    getCurPageNum() {
        return this.i2.getElementsByTagName('span')[0].textContent * 1;
    }

    getPageCount() {
        return this.i2.getElementsByTagName('span')[1].textContent * 1;
    }

    getImgHeight() {
        return this.imgSizeInfo[0].trim();
    }

    getImgWidth() {
        return this.imgSizeInfo[1].trim();
    }

    getIntroUrl() {
        let url = this.html.querySelectorAll('.sb')[0].children[0].getAttribute('href')
        .replace(/^.*?org/g, '').replace(/\?p=.*?$/g, '');
        return process.env.NODE_ENV !== 'testing' ? url : 'https://e-hentai.org' + url;
    }

    getAlbumId() {
        return this.getIntroUrl().match(/g\/\d+(?=\/)/)[0].replace('g/', '');
    }

    getImgId() {
        return window.location.pathname.split('/')[2];
    }

    getNextImgId() {
        return this.document.getElementById('i3').children[0].getAttribute('href').split('/')[4];
    }

    getImgUrl() {
        this.htmlText.match('id="img" x-src="(.*?)"');
        return RegExp.$1;
    }

    getOriginalImgUrl() {
        return this.html.querySelector('#i7>a').attributes['href'].value;
    }

    getSourceId() {
        this.html.querySelector('#loadfail').attributes['onclick'].value.match(/nl\('(.*?)'\)/g);
        return RegExp.$1;
    }

    _initI2Element() {
        this.i2 = this.html.querySelector('#i2');
    }

    _initImgSizeInfo() {
        this.imgSizeInfo = this.i2.children[1].textContent.split('::')[1].split('x');
    }
}

export default ImgHtmlParser;
