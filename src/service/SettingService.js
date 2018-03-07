import storage from './storage/LocalStorage'
import store from '../store/index.inject'
import * as tags from '../assets/value/tags'
import config from '../config'
// import Logger from '../utils/Logger';

class SettingService {
    constructor() {
        this.version = '2.0';
        this.storageName = 'Settings';
        this.storageVersionName = 'SettingsVersion';
        this._initStorage();
        this._migrate();
    }

    _getDefaultSettings() {
        return {
            albumWidth: { eventName: 'setAlbumWidth', val: 80 }, // eventName is action name of vuex
            toggleEHunter: { val: true },
            toggleThumbView: { eventName: 'toggleThumbView', val: true },
            loadNum: { eventName: 'setLoadNum', val: 3 },
            volumeSize: { eventName: 'setVolumeSize', val: 50 },
            showBookScreenAnimation: { eventName: 'setBookScreenAnimation', val: false },
            showBookPagination: { eventName: 'setBookPagination', val: true },
            readingMode: { eventName: 'setReadingMode', val: 0 },
            bookDirection: { eventName: 'setBookDirection', val: 0 },
            bookScreenSize: { eventName: 'setBookScreenSize', val: 2 },
            lang: { eventName: 'setString', val: tags.LANG_EN },
            updateTime: { val: 0 }, // the time stamp of last showing a dialog of update
            firstOpen: { val: true }, // show instructions dialog for the users of first opening the eHunter
            firstOpenBookMode: { val: true }, // show instructions dialog for the users of first opening the book mode
            showTopBar: { eventName: 'toggleTopBar', val: true },
            isNormalMode: { val: true },
            version: { val: config.version } // for showing infos of update
        }
    }

    async _migrate() {
        // // remove version < 2.0
        // await Platform.storage.local.get('cache', async(value) => {
        //     if (typeof value['cache'] !== 'undefined') {
        //         await Platform.storage.local.remove('cache', () => {});
        //         await Platform.storage.local.remove('cacheVersion', () => {});
        //     }
        // });
        // remove old version >= 2.0
        let version = await storage.load({ key: this.storageVersionName });
        await storage.save({ key: this.storageVersionName, data: this.version });
        if (version !== this.version) {
            await storage.remove({ key: this.storageName });
            window.location.reload(); // TODO: need a notification
        }
    }

    _initStorage() {
        storage.sync[this.storageName] = (params) => {
            let { resolve } = params;
            resolve(this._getDefaultSettings());
        };
        storage.sync[this.storageVersionName] = (params) => {
            let { resolve } = params;
            return resolve(this.version);
        };
    }

    async _setSettingItem(key, val) {
        // store change
        let settings = await storage.load({ key: this.storageName });
        if (!settings.hasOwnProperty(key)) { // smoothly add new setting item
            settings[key] = this._getDefaultSettings()[key];
        }
        settings[key].val = val;
        await storage.save({ key: this.storageName, data: settings });
        // send change to vuex
        if (settings[key].eventName) {
            store.dispatch(settings[key].eventName, val);
        }
    }

    async _getSettingItem(key) {
        let settings = await storage.load({ key: this.storageName });
        if (settings.hasOwnProperty(key)) {
            return settings[key].val;
        } else {
            return this._getDefaultSettings()[key].val;
        }
    }

    async initSettings() {
        let settings = await storage.load({ key: this.storageName });
        for (let key in settings) {
            if (settings[key].eventName) {
                store.dispatch(settings[key].eventName, settings[key].val);
            }
        }
    }

    async setAlbumWidth(val) {
        await this._setSettingItem('albumWidth', val);
    }

    async getAlbumWidth() {
        return await this._getSettingItem('albumWidth');
    }

    async toggleEHunter(val) {
        await this._setSettingItem('toggleEHunter', val);
    }

    async getEHunterStatus() {
        return await this._getSettingItem('toggleEHunter');
    }

    async toggleThumbView(val) {
        await this._setSettingItem('toggleThumbView', val);
    }

    async getThumbViewStatus() {
        return await this._getSettingItem('toggleThumbView');
    }

    async setLoadNum(val) {
        await this._setSettingItem('loadNum', val);
    }

    async getLoadNum() {
        return await this._getSettingItem('loadNum');
    }

    async setVolumeSize(val) {
        await this._setSettingItem('volumeSize', val);
    }

    async getVolumeSize() {
        return await this._getSettingItem('volumeSize');
    }

    async setBookScreenAnimation(val) {
        await this._setSettingItem('showBookScreenAnimation', val);
    }

    async getBookScreenAnimation() {
        return await this._getSettingItem('showBookScreenAnimation');
    }

    async setBookPagination(val) {
        await this._setSettingItem('showBookPagination', val);
    }

    async getBookPagination() {
        return await this._getSettingItem('showBookPagination');
    }

    async setReadingMode(val) {
        await this._setSettingItem('readingMode', val);
    }

    async getReadingMode() {
        return await this._getSettingItem('readingMode');
    }

    async setBookDirection(val) {
        await this._setSettingItem('bookDirection', val);
    }

    async getBookDirection() {
        return await this._getSettingItem('bookDirection');
    }

    async setBookScreenSize(val) {
        await this._setSettingItem('bookScreenSize', val);
    }

    async getBookScreenSize() {
        return await this._getSettingItem('bookScreenSize');
    }

    async setLang(val) {
        await this._setSettingItem('lang', val);
    }

    async getLang() {
        return await this._getSettingItem('lang');
    }

    async setUpdateTime(val) {
        await this._setSettingItem('updateTime', val);
    }

    async getUpdateTime() {
        return await this._getSettingItem('updateTime');
    }

    async setFirstOpen(val) {
        await this._setSettingItem('firstOpen', val);
    }

    async getFirstOpen() {
        return await this._getSettingItem('firstOpen');
    }

    async setFirstOpenBookMode(val) {
        await this._setSettingItem('firstOpenBookMode', val);
    }

    async getFirstOpenBookMode() {
        return await this._getSettingItem('firstOpenBookMode');
    }

    async setShowTopBar(val) {
        await this._setSettingItem('showTopBar', val);
    }

    async getShowTopBar() {
        return await this._getSettingItem('showTopBar');
    }

    async setNormalMode(val) {
        await this._setSettingItem('isNormalMode', val);
    }

    async getNormalMode() {
        return await this._getSettingItem('isNormalMode');
    }

    async setVersion(val) {
        await this._setSettingItem('version', val);
    }

    async getVersion() {
        return await this._getSettingItem('version');
    }
}

let instance = new SettingService();
export default instance;
