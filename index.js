const { CMS } = require("./dist/index.js");

const cms = new CMS("uesleidev", "db-example", "token");

cms.query("CollectionEX").eq("name", "John").eq("age", 40).find().then((res) => {
	console.log(res);
});