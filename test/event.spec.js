describe("Event", () => {
	"use strict";

	describe("on", () => {
		context("sync events", () => {
			it("should call handler (single)", () => {
				//Given
				var handler_opt10001 = sinon.spy();

				//When
				KiwoomHelper.on("receiveTrData", "opt10001", handler_opt10001);
				KiwoomHelper.handleEvent({
					detail: {
						trCode: "opt10001"
					},
					type: "receiveTrData.kiwoom"
				});

				//Then
				handler_opt10001.calledOnce.should.be.true;
				handler_opt10001.args[0][0]["trCode"].should.equal("opt10001");
				handler_opt10001.args[0][0]["size"].should.be.a("number");
				Object.keys(KiwoomHelper._eventHandler).should.have.lengthOf(1);
			});

			it("should call handlers (multi)", () => {
				//Given
				var handler_opt10001 = sinon.spy();
				var handler_opt10081 = sinon.spy();

				//When
				KiwoomHelper.on("receiveTrData", {
					"opt10001": handler_opt10001,
					"opt10081": handler_opt10081
				});
				KiwoomHelper.handleEvent({
					detail: {
						trCode: "opt10001"
					},
					type: "receiveTrData.kiwoom"
				});
				KiwoomHelper.handleEvent({
					detail: {
						trCode: "opt10081"
					},
					type: "receiveTrData.kiwoom"
				});

				//Then
				handler_opt10001.calledOnce.should.be.true;
				handler_opt10001.args[0][0]["trCode"].should.equal("opt10001");
				handler_opt10001.args[0][0]["size"].should.be.a("number");
				handler_opt10081.calledOnce.should.be.true;
				handler_opt10081.args[0][0]["trCode"].should.equal("opt10081");
				handler_opt10081.args[0][0]["size"].should.be.a("number");
				Object.keys(KiwoomHelper._eventHandler).should.have.lengthOf(2);
			});

			afterEach( () => {
				KiwoomHelper.off();
			});
		});
	});
});