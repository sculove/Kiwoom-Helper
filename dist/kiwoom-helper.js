/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**************************!*\
  !*** ./kiwoom-helper.js ***!
  \**************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// 이벤트의 키를 얻음
	function getEventKey(eventName, trCode) {
		return eventName + "_" + trCode;
	}
	
	var KiwoomHelper = function () {
		function KiwoomHelper() {
			_classCallCheck(this, KiwoomHelper);
	
			window.KiwoomHelper = this;
			this._eventHandler = {};
			this._screenNo = 0;
			this._requestScreens = [];
			this._registerScreens = [];
			this._attach();
		}
	
		_createClass(KiwoomHelper, [{
			key: "_attach",
			value: function _attach() {
				var _this = this;
	
				// 사용자 구분 요청 명은 trCode와 동일하다.
				KiwoomHelper.EVENTS.forEach(function (v) {
					document.addEventListener(v + ".kiwoom", _this);
				});
			}
			// 화면 번호를 얻음
	
		}, {
			key: "_getScreenNo",
			value: function _getScreenNo() {
				return "SRC" + this._screenNo++;
			}
		}, {
			key: "handleEvent",
			value: function handleEvent(e) {
				// console.log(e.type, e);
				var data = e.detail;
				var type = e.type.substring(0, e.type.indexOf(".kiwoom"));
				if (type === "receiveTrData") {
					data.size = kiwoom ? kiwoom.getRepeatCnt(data.trCode, data.rQName) : 0;
				}
	
				var handler = this._eventHandler[getEventKey(type, data.trCode)];
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
	
		}, {
			key: "on",
			value: function on(eventName, trCode, handler) {
				var _this2 = this;
	
				if (KiwoomHelper.EVENTS.indexOf(eventName) === -1) {
					return;
				}
	
				// trCode가 object 인 경우.
				if ((typeof trCode === "undefined" ? "undefined" : _typeof(trCode)) === "object" && typeof handler === "undefined") {
					Object.keys(trCode).forEach(function (v) {
						_this2.on(eventName, v, trCode[v]);
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
	
		}, {
			key: "off",
			value: function off(eventName, trCode) {
				var _this3 = this;
	
				// All event detach.
				if (arguments.length === 0) {
					this._eventHandler = {};
					return this;
				}
				if (typeof trCode === "undefined") {
					this._eventHandler[eventName] = undefined;
				} else if (typeof trCode === "string") {
					this._eventHandler[getEventKey(eventName, trCode)] = undefined;
				} else if (Array.isArray(trCode)) {
					Object.keys(this._eventHandler).filter(function (v) {
						return v.indexOf(eventName + "_") === 0;
					}).forEach(function (v) {
						_this3._eventHandler[getEventKey(eventName, v)] = undefined;
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
	
		}, {
			key: "isLogin",
			value: function isLogin() {
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
	
		}, {
			key: "login",
			value: function login() {
				return new Promise(function (resolve, reject) {
					var status = kiwoom.getConnectState();
					if (status == 0) {
						var rt = kiwoom.commConnect();
						rt < 0 && reject(Error(rt));
					} else if (status == 1) {
						resolve();
					}
					var hander = function hander(e) {
						var errcode = e.detail;
						errcode == 0 ? resolve() : reject(Error(errcode));
						document.removeEventListener("eventConnect.kiwoom", hander);
					};
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
	
		}, {
			key: "getLoginInfo",
			value: function getLoginInfo() {
				return {
					account: kiwoom.getLoginInfo("ACCNO").replace(/;$/, "").split(";"),
					user: {
						id: kiwoom.getLoginInfo("USER_ID"),
						name: kiwoom.getLoginInfo("USER_NAME")
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
	
		}, {
			key: "request",
			value: function request(trCode, input) {
				var isContinue = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	
				//@todo screenNo 200개가 넘으면 안된다.
				//실시간 조건검색은 최대 10개
				Object.keys(input).forEach(function (v) {
					kiwoom.setInputValue(v, input[v]);
				});
				// 화면 번호는 자동으로
				var screenNo = this._getScreenNo();
				var result = kiwoom.commRqData(trCode, trCode, isContinue ? 2 : 0, screenNo);
				if (result === 0) {
					// 화면 번호를 저장
					this._requestScreens.push(screenNo);
				}
				return screenNo;
			}
		}, {
			key: "register",
			value: function register(stockcodes, fids) {
				var isNew = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
	
				if (!Array.isArray(stockcodes)) {
					stockcodes = [stockcodes];
				}
				if (!Array.isArray(fids)) {
					fids = [fids];
				}
				var screenNo = this._getScreenNo();
				var result = kiwoom.setRealReg(screenNo, stockcodes.join(";"), fids.join(";"), isNew ? 0 : 1);
	
				if (result === 0) {
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
	
		}, {
			key: "disconnect",
			value: function disconnect(screenNo) {
				var stockcode = arguments.length <= 1 || arguments[1] === undefined ? "ALL" : arguments[1];
	
				if (screenNo) {
					if (this._requestScreens.indexOf(screenNo) !== -1) {
						kiwwom.DisconnectRealData(screenNo);
					} else if (this._registerScreens.indexOf(screenNo) !== -1) {
						kiwwom.SetRealRemove(screenNo, stockcode);
					}
				} else {
					this._requestScreens.forEach(function (v) {
						kiwwom.DisconnectRealData(v);
					});
					this._requestScreens.length = 0;
					kiwwom.SetRealRemove("ALL", "ALL");
					this._registerScreens.length = 0;
				}
			}
		}, {
			key: "get",
			value: function get() {
				switch (arguments.length) {
					case 1:
						// 대용량 데이터 (trCode만 입력)
						return JSON.parse(kiwoom.getCommDataEx(arguments[0], arguments[0]));
					case 2:
						// 체결 데이터
						return kiwoom.commGetData(arguments[0], "-1", "", arguments[1], "");
					case 3:
						if (!isNaN(arguments[1]) && isNaN(arguments[2])) {
							var _kiwoom;
	
							// trans 데이터
							// get(“OPT00001”, 0, “현재가”);
							return (_kiwoom = kiwoom).commGetData.apply(_kiwoom, [arguments[0], ""].concat(Array.prototype.slice.call(arguments)));
						} else {
							var _kiwoom2;
	
							// real 데이터
							// 종목코드, realType, fid
							// get("000600", 'A', 10);
							return (_kiwoom2 = kiwoom).commGetData.apply(_kiwoom2, Array.prototype.slice.call(arguments).concat([0, ""]));
						}
				}
			}
		}]);
	
		return KiwoomHelper;
	}();
	
	KiwoomHelper.EVENTS = ["receiveMsg", "receiveTrData", "receiveRealData", "receiveChejanData", "receiveConditionVer", "receiveTrCondition", "receiveRealCondition"];
	
	// singleton
	exports.default = new KiwoomHelper();

/***/ }
/******/ ]);
//# sourceMappingURL=kiwoom-helper.js.map