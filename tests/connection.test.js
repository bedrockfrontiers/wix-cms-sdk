import { WixCMS } from "../src/core/cms.js";

let cms = new WixCMS(
	"uesleidev",
	"db-example",
	"my-strong-secret-key"
);

cms.query("CollectionEX").find().then(res => {
	console.log(res.result.items);
});