var Twig = require("twig"),
    express = require('express'),
    app = express(),
    fs = require('fs'),
    pdf = require('html-pdf');

const path = require('path');

app.use("/public", express.static(__dirname + '/public'));

var twigTemplates = './templates';
var htmlTemplates = './public/html';
var pdfTemplates = './public/pdf';

// fs.readdir(twigTemplates, function(err, items) {
//     if (err) console.log(err);
//     console.log(items);
//
//     for (var i=0; i<items.length; i++) {
//
//         var fileName = items[i];
//         console.log(twigTemplates + '/' + fileName);
//
//
//
//     }
// });










app.get('/', function(req, res){

    fs.readdir(twigTemplates, function(err, items) {
        Twig.renderFile('app.twig', {pdf_templates: items}, (err, html) => {
            if (err) res.status(500).write('Something wen wrong(');

            res.send(html);
        });

    });

});

app.get('/:page', function(req, res){

    var template = req.params.page.replace('.pdf','');

    Twig.renderFile(twigTemplates + '/' + template + '.twig', {foo:'bar'}, (err, html) => {

        pdf.create(html, { format: 'A4' }).toFile(pdfTemplates + '/' + template + '.pdf', function(err, filePath) {
            if (err) return console.log(err);

            var fileName = template + '.pdf';

            console.log(__dirname + '/public/pdf/' + fileName);

            fs.readFile(__dirname + '/public/pdf/' + fileName , function (err,data){
                res.contentType("application/pdf");
                res.send(data);
            });

        });
    });

});



app.listen(9999);