
var fs = require('fs');
var chai = require('chai');
var groupCssMediaQueries = require('..')

chai.should()

describe('groupCssMediaQueries', function() {
	var fixturesPath = __dirname + "/fixtures";
	var allFiles = fs.readdirSync(fixturesPath);
	var inputFiles = allFiles.filter(function(path) {
		return path.indexOf('.sorted.css')===-1 && path.indexOf('css')!==-1;
	});

	var testInputFile = function(inputFilename) {
		it(inputFilename, function() {
			var outputFilename = inputFilename.replace(/\.css$/, '.sorted.css');
			var input = fs.readFileSync(fixturesPath + '/' + inputFilename, {encoding: 'utf8'});
			var output = fs.readFileSync(fixturesPath + '/' + outputFilename, {encoding: 'utf8'});

			return groupCssMediaQueries(input).should.eql(output);
		});
	}

	inputFiles.map(testInputFile);
});
