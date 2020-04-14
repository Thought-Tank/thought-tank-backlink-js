'use strict';

var fs = require('fs');
var marked = require('marked');
var path = require('path');
var _ = require('lodash');


var markdownLinkExtractor = function (markdown) {
    var links = [];

    var renderer = new marked.Renderer();

    renderer.link = function (href, title, text) {
        //        links.push(href);
        links.push({ "text": text, "url": href });
    };

    marked(markdown, { renderer: renderer });

    return links;
};

function readFilesSync(dir) {
    const files = [];

    fs.readdirSync(dir).forEach(filename => {
        const name = path.parse(filename).name;
        const ext = path.parse(filename).ext;
        const filepath = path.resolve(dir, filename);
        const stat = fs.statSync(filepath);
        const isFile = stat.isFile();

        if (isFile) {
            var markdown = fs.readFileSync(dir + filename).toString();

            var links = markdownLinkExtractor(markdown);
            links.forEach(function (link) {
                var singleEntry = {};
                //TODO clean an validate to
                singleEntry = { "to": link["url"], "from": name, text: link["text"], link: link["url"] };
                files.push(singleEntry);
            })
        };
    });

    return files;
}


const links = readFilesSync('../one-click-netlify-ThoughtTank/site/content/notes/')

var grouped = _.mapValues(_.groupBy(links, 'to'),
    clist => clist.map(link => _.omit(link, 'to')));


console.log(grouped);
