// a parser for album's intro page
class IntroHtmlParser {
    constructor(html) {
        this.html = document.createElement('html');
        this.html.innerHTML = html.replace(/src=/g, 'x-src='); // avoid load assets
        this.document = this.html.ownerDocument;
    }

    getImgUrls() {
        return Array.prototype.slice.call(this.html.getElementsByClassName('gdtm'), 0).map(item => {
            item.children[0].getAttribute('style').match(/width:(.*?)px; height:(.*?)px;/g);
            const thumbHeight = Number(RegExp.$2);
            const thumbWidth = Number(RegExp.$1);
            let pageUrl = item.getElementsByTagName('a')[0].getAttribute('href').match(/\/s.*$/) + '';
            return {
                pageUrl: process.env.NODE_ENV !== 'testing' ? pageUrl : 'https://e-hentai.org' + pageUrl,
                src: '',
                thumbHeight,
                thumbWidth,
                heightOfWidth: thumbHeight / thumbWidth
            };
        })
    }

    getThumbObjList(sumOfPage, albumId) {
        return this._computeThumbList(this._getThumbImgList(albumId, sumOfPage), sumOfPage);
    }

    _getThumbKeyId() {
        let tmp = this.html.getElementsByClassName('gdtm')[0].children[0].getAttribute('style').match(/m\/.*?\//);
        return (tmp + '').replace(/(m|\/)/g, '');
    }

    _getThumbPageCount(sumOfPage) {
        // 20 is the img sum per spirit in small thumb model
        if (sumOfPage < 20) {
            return 1;
        }
        let reminder = sumOfPage % 20;
        if (reminder > 1) {
            return (sumOfPage - reminder) / 20 + 1;
        } else {
            return sumOfPage / 20;
        }
    }

    _getThumbImgList(albumId, sumOfPage) {
        let thumbKeyId = this._getThumbKeyId();
        let imgList = [];
        for (let i = 0; i < this._getThumbPageCount(sumOfPage); i++) {
            if (window.location.hostname === 'e-hentai.org') {
                imgList.push(`https://ehgt.org/m/${thumbKeyId}/${albumId}-${i < 10 ? '0' + i : i}.jpg`);
            } else {
                imgList.push(`/m/${thumbKeyId}/${albumId}-${i < 10 ? '0' + i : i}.jpg`);
            }
        }
        return imgList;
    }

    _computeThumbList(imgList, sumOfPage) {
        let thumbObjList = [];
        for (let i = 0; i < imgList.length; i++) {
            for (let t = 0; t < 20; t++) {
                if (i !== imgList.length - 1 || (sumOfPage === 20 ? t < 20 : t < sumOfPage % 20)) {
                    thumbObjList.push({
                        url: imgList[i],
                        offset: t * 100
                    })
                }
            }
        }
        return thumbObjList;
    }
}

export default IntroHtmlParser;
