var expect;
if(typeof require === "function") {
	expect = require('chai').expect;
	require('chai').should();
} else {
	expect = chai.expect;
	chai.should();
}
