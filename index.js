'use strict';

var fs = require('fs');
var marked = require('marked');
var path = require('path');
var _ = require('lodash');


var markdownLinkExtractor = function (markdown) {
    var links = [];

    var renderer = new marked.Renderer();

    renderer.link = function (href, title, text) {
        links.push({ "text": text, "href": href , "title": title});
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
                    var singleEntry = { to:  link["href"] , from: name, text: link["text"], title: link["title"] };
                    files.push(singleEntry);
            })
        };
    });

    return files;
}


const links = readFilesSync('./site/content/notes/')

var grouped = _.mapValues(_.groupBy(links, 'to'),
    clist => clist.map(link => _.omit(link, 'to')));



const jsonString = JSON.stringify(grouped)
fs.writeFile('./site/data/backlinks.json', jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
})

//console.log(grouped);
