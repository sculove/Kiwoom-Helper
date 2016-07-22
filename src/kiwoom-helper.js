// import { Promise } from "es6-promise";

// 이벤트의 키를 얻음
function getEventKey(eventName, trCode) {
	return eventName + "_" + trCode;
}

class KiwoomHelper {
	constructor() {
		window.KiwoomHelper = this;
		this._eventHandler = {};
		this._screenNo = 0;
		this._requestScreens = [];
		this._registerScreens = [];
		this._attach();
	}
	isQWebviewPlus() {
		return "kiwoom" in window;
	}
	_attach() {
		// 사용자 구분 요청 명은 trCode와 동일하다.
		KiwoomHelper.EVENTS.forEach(v => {
			document.addEventListener(v + ".kiwoom", this);
		});
	}
	// 화면 번호를 얻음
	_getScreenNo() {
		return "SRC" + (this._screenNo++);
	}
	handleEvent(e) {
		// console.log(e.type, e);
		let data = e.detail;
		let type = e.type.substring(0, e.type.indexOf(".kiwoom"));
		if (type === "receiveTrData") {
			data.size = kiwoom ? kiwoom.getRepeatCnt(data.trCode, data.rQName) : 0;
		}

		let handler = this._eventHandler[getEventKey(type, data.trCode)];
		// console.log(type,data,handler);
		handler && handler.call(this, data);
	}
	/**
	 * Attach an event handler function.
	 * @method KiwoomHelper#on
	 * @param {String} eventName
	 * @param {String} trCode
	 * @param {Function} handler
	 * @return {this} instance of itself
	 * @example
		// 코드별 핸들러 등록 (string)
		KiwoomHelper.on("receiveTrData", "opt10001", function(data) {
			// ...
		});
		// 코드별 핸들러 등록 (hashmap)
		KiwoomHelper.on("receiveTrData", {
			"opt10001" : function(data) { // ... },
			"opt10002" : function(data) { // ... }
		});
	 */
	on(eventName, trCode, handler) {
		if ( !this.isQWebviewPlus() ) {
			return this;
		}
		if ( KiwoomHelper.EVENTS.indexOf(eventName) === -1) {
			return;
		}

		// trCode가 object 인 경우.
		if (typeof trCode === "object" && typeof handler === "undefined") {
			Object.keys(trCode).forEach(v => {
				this.on(eventName, v, trCode[v]);
			});
			return this;
		// 단건인 경우.
		} else if (typeof trCode === "string" && typeof handler === "function") {
			this._eventHandler[getEventKey(eventName, trCode)] = handler;
		}
		return this;
	}
	/**
	 * Detach an event handler function.
	 * @method KiwoomHelper#off
	 * @param {String} eventName
	 * @param {String} trCode
	 * @return {this} instance of itself
	 * @example
		KiwoomHelper.off();
		KiwoomHelper.off("receiveTrData.kiwoom");
		KiwoomHelper.off("receiveTrData.kiwoom", "opt10001");
		KiwoomHelper.off("receiveTrData.kiwoom", ["opt10001", "opt10002"] );
	 */
	off(eventName, trCode) {
		if ( !this.isQWebviewPlus() ) {
			return this;
		}
		// All event detach.
		if (arguments.length === 0) {
			this._eventHandler = {};
			return this;
		}
		if (typeof trCode === "undefined" ) {
			this._eventHandler[eventName] = undefined;
		} else if (typeof trCode === "string") {
			this._eventHandler[getEventKey(eventName, trCode)] = undefined;
		} else if (Array.isArray(trCode)) {
			Object.keys(this._eventHandler)
				.filter(v => v.indexOf(eventName + "_") === 0)
				.forEach(v => {
					this._eventHandler[getEventKey(eventName, v)] = undefined;
				});
		}
		return this;
	}
	/**
	 * isLogin
	 * @method KiwoomHelper#isLogin
	 * @return {Number} login status
	 * @example
		KiwoomHelper.isLogin();
	 */
	isLogin() {
		if ( !this.isQWebviewPlus() ) {
			return false;
		}
		return kiwoom.getConnectState();
	}
	/**
	 * login
	 * @method KiwoomHelper#login
	 * @return {Promise} Promise instance
	 * @example
		KiwoomHelper.login().then(function() {
			// ...
		});
	 */
	login() {
		if ( !this.isQWebviewPlus() ) {
			return Promise.reject();
		}
		return new Promise((resolve, reject) => {
			const status = kiwoom.getConnectState();
		    if(status == 0) {
		        let rt = kiwoom.commConnect();
		        rt < 0 && reject(Error(rt));
		    } else if(status == 1) {
		        resolve();
		    }
		    let hander = (e) => {
		    	var errcode = e.detail;
			    errcode == 0 ? resolve() : reject(Error(errcode));
				document.removeEventListener("eventConnect.kiwoom", hander);
		    }
		    document.addEventListener("eventConnect.kiwoom", hander);

		});
	}
	/**
	 * get login information
	 * @method KiwoomHelper#getLoginInfo
	 * @return {Object} user information
	 * @example
		KiwoomHelper.getLoginInfo();
	 */
	getLoginInfo() {
		if ( !this.isQWebviewPlus() ) {
			return {};
		}
		return {
			account : kiwoom.getLoginInfo("ACCNO").replace(/;$/,"").split(";"),
			user : {
				id : kiwoom.getLoginInfo("USER_ID"),
				name : kiwoom.getLoginInfo("USER_NAME")
			}
		};
	}
	/**
	 * request
	 * @method KiwoomHelper#request
	 * @param {String} trCode
	 * @param {Object} input
	 * @param {Boolean} isContinue=false
	 * @return {String} screenNo
	 * @example
		KiwoomHelper.request("opt10001", {
			"종목코드" : "035420"
		});
	 */
	request(trCode, input, isContinue = false) {
		if ( !this.isQWebviewPlus() ) {
			return -1;
		}
		//@todo screenNo 200개가 넘으면 안된다.
		//실시간 조건검색은 최대 10개
		Object.keys(input).forEach(v => {
			kiwoom.setInputValue(v, input[v]);
		});
		// 화면 번호는 자동으로
		let screenNo = this._getScreenNo();
		let result = kiwoom.commRqData(trCode, trCode, isContinue ? 2 : 0, screenNo);
		if(result === 0) {
			// 화면 번호를 저장
			this._requestScreens.push(screenNo);
		}
		return screenNo;
	}
	register(stockcodes, fids, isNew = true) {
		if ( !this.isQWebviewPlus() ) {
			return -1;
		}
		if(!Array.isArray(stockcodes)) {
			stockcodes = [stockcodes];
		}
		if(!Array.isArray(fids)) {
			fids = [fids];
		}
		let screenNo = this._getScreenNo();
		let result = kiwoom.setRealReg(screenNo, stockcodes.join(";"), fids.join(";"), isNew ? 0 : 1);

		if(result === 0) {
			// 화면 번호를 저장
			this._registerScreens.push(screenNo);
		}
		return result;
	}
	/**
	 * disconnect
	 * @method KiwoomHelper#disconnect
	 * @param {String} screenNo
	 * @param {String} [stockcode="ALL"]
	 * @example
		KiwoomHelper.disconnect("SRC1");
		KiwoomHelper.disconnect("SRC2", ""035420");
	 */
	disconnect(screenNo, stockcode = "ALL") {
		if ( !this.isQWebviewPlus() ) {
			return;
		}
		if(screenNo) {
			if(this._requestScreens.indexOf(screenNo) !== -1) {
				kiwwom.DisconnectRealData(screenNo);
			} else if(this._registerScreens.indexOf(screenNo) !== -1) {
				kiwwom.SetRealRemove(screenNo, stockcode);
			}
		} else {
			this._requestScreens.forEach(v => {
				kiwwom.DisconnectRealData(v);
			});
			this._requestScreens.length = 0;
			kiwwom.SetRealRemove("ALL", "ALL");
			this._registerScreens.length = 0;
		}
	}
	get() {
		if ( !this.isQWebviewPlus() ) {
			return null;
		}
		switch(arguments.length) {
			case 1:
				// 대용량 데이터 (trCode만 입력)
				return JSON.parse(kiwoom.getCommDataEx(arguments[0], arguments[0]));
			case 2:
				// 체결 데이터
				return kiwoom.commGetData(arguments[0], "-1", "", arguments[1], "");
			case 3:
				if(!isNaN(arguments[1]) && isNaN(arguments[2])) {
					// trans 데이터
					// get(“OPT00001”, 0, “현재가”);
					return kiwoom.commGetData(arguments[0], "", ...arguments);
				} else {
					// real 데이터
					// 종목코드, realType, fid
					// get("000600", 'A', 10);
					return kiwoom.commGetData(...arguments,  0, "");
				}
		}
	}
}
KiwoomHelper.EVENTS = [
	"receiveMsg",
	"receiveTrData",
	"receiveRealData",
	"receiveChejanData",
	"receiveConditionVer",
	"receiveTrCondition",
	"receiveRealCondition"
];

// singleton
export default new KiwoomHelper();