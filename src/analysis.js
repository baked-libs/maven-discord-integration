const process = require('child-process-promise');
const fs = require('fs').promises;
const xml = require('xml-library');

module.exports.start = test;

function test() {
	console.log("Running 'mvn clean test'...");

	var maven = process.spawn("mvn", ["test", "-B"], { shell: true });

	maven.childProcess.stdout.on('data', data => console.log(data.toString('utf8')));
	maven.childProcess.stderr.on('data', data => console.log(data.toString('utf8')));

	return maven.then(() => aggregate(), aggregate);
}

function aggregate(err) {
	console.log("Aggregating test results...");
	var evaluation = {
		status: (err ? "FAILURE": "SUCCESS")
	}

	return new Promise((resolve, reject) => {
		Promise.all([getTestResults('surefire-reports'), getTestResults('failsafe-reports'), getCoverage('site/jacoco/jacoco.xml')]).then((results) => {
			evaluation.tests = results[0].concat(results[1]);
			evaluation.coverage = results[2];

			evaluation.time = evaluation.tests.length == 0 ? 0 : evaluation.tests.reduce((a, b) => {
				var x = a.time ? parseFloat(a.time): a;
				var y = b.time ? parseFloat(b.time): b;
				return x + y;
			});

			evaluation.time = evaluation.time.toFixed(3);
			console.log(evaluation);
			resolve(evaluation);
		}, reject);
	});
}

function getCoverage(path) {
	return new Promise((resolve, reject) => {
		fs.access("./target/" + path).then(() => {
			fs.readFile("./target/" + path, "UTF-8").then((data) => {
				xml.promises.fromXML(data).then((xml) => {
					resolve(calculateCoverage(xml));
				}, (err) => {
					console.log(err);
					resolve(0);
				});
			}, () => resolve(0));
		}, () => resolve(0));
	});
}

function calculateCoverage(xml) {
	var tested = [];
	var total = [];

	for (var key in xml.elements) {
		if (key.startsWith("counter[")) {
			var attributes = xml.elements[key].attributes;
			var type = attributes.type;
			var missed = parseInt(attributes.missed);
			var covered = parseInt(attributes.covered);

			console.log("COVERAGE: " + type + " - " + covered + "/" + (covered + missed));
			tested.push(covered);
			total.push((covered + missed));
		}
	}

	var coverage = 100.0 * tested.reduce((a, b) => a + b) / total.reduce((a, b) => a + b);
	return coverage.toFixed(2);
}

function getTestResults(path) {
	return new Promise((resolve, reject) => {
		fs.readdir("./target/" + path, { withFileTypes: true }).then((files) => {
			var promises = [];

			for (var i in files) {
				var file = files[i];

				if (file.isFile() && file.name.startsWith("TEST-") && file.name.endsWith(".xml")) {
					console.log(`Found test file ${file.name}`);
					promises.push(fs.readFile("./target/" + path + "/" + file.name, "UTF-8"));
				}
			}
			console.log(`> Found ${promises.length} test report(s)`);
			readTestSuites(promises).then(resolve);
		}, (err) => {
			console.log(`Could not find directory '${'/target/' + path}'`);
			resolve([]);
		});
	});
}

function readTestSuites(promises) {
	return new Promise((resolve, reject) => {
		Promise.all(promises).then((results) => {
			for (var i in results) {
				results[i] = xml.promises.fromXML(results[i]);
			}

			Promise.all(results).then((suites) => {
				var tasks = [];

				for (var i in suites) {
					tasks.push(readTestSuite(suites[i]));
				}

				Promise.all(tasks).then((tests) => resolve(tests.flat()), reject);
			}, reject);
		}, reject);
	});
}

function readTestSuite(suite) {
	return new Promise((resolve, reject) => {
		if (!suite) {
			resolve([]);
			return;
		}

		var tests = [];
		for (var key in suite.elements) {
			if (key.startsWith("testcase[")) {
				var status = "OK";
				var attributes = suite.elements[key].attributes;
				var path = attributes.classname.split('.');

				if (suite.elements[key].getChild("skipped")) {
					status = "SKIPPED";
				}
				else if (suite.elements[key].getChild("failure")) {
					status = "FAILED";
				}

				tests.push({
					name: path[path.length - 1] + '.' +  attributes.name,
					time: attributes.time,
					status: status
				});

				console.log(path[path.length - 1] + '.' +  attributes.name + ": " + status);
			}
		}

		resolve(tests);
	});
}

function onSuccess() {

}

function onFailure() {

}
