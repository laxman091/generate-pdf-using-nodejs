var express     = require('express');
var router      = express.Router();
var PDFDocument = require('pdfkit');
var orm         = require('orm');
var http = require('http');
var https = require('https');
var request = require('request');


var url = 'http://allcodingworld.com/api/employees.php';

router.use(orm.express("mysql://root:mysql@localhost:/dbnews", {
  define: function (db, models, next) {
    models.news = db.define("tbl_posts", {
    id           : Number,
    title        : String,
    detail       : String,
    author_name  : String,
    link         : String,
    publish_date : { type: 'date', time: false },
  });
  next();
  }
}));

router.get('/', function(req, res, next) {
  var result = req.models.news.find({
  }, function(error, news){
      if(error) throw error;
      console.log(news);
      //res.render('index', { news:news, title: 'Generate PDF using NodeJS' });
  });
  var requestConfig = {
                        url: url,
                        json: true
                    };
  request(requestConfig, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //res.status(200).send(body.employees);
      //res.setHeader('content-type', 'text/html');
        //console.log(body); // Print the result.
        res.render('index', { 'title': 'Generate PDF using NodeJS', 'employees': body.employees});
     }
});
});

router.get('/pdf', function(req, res, next) {
  var id  = req.query.id;
  const doc = new PDFDocument();
      var id = req.query.id; // $_GET["id"]
    var url2 = 'http://www.allcodingworld.com/api/read.php?id=' + id;
    var requestConfig = {
                        url: url2,
                        json: true
                    };
    request(requestConfig, function(error, response, body) {
                if(error) throw error;
      //console.log(body);
      //console.log(body.employee[0].firstName);
      var title        = body.employee[0].firstName;
      var content      = 'ANY_TEXT_YOU_WANT_TO_WRITE_IN_PDF_DOC';
      var publish_date = body.employee[0].extension;
      var author_name  = body.employee[0].email;
      var link         = 'http://www.allcodingworld.com';
      var img_url       = 'http://relatedpakistan.com/wp-content/uploads/2018/06/maxresdefault-1-1.jpg';

      var dir = __dirname + '/pdfs/'
      var filename = dir + title + '.pdf';
      //var filename = encodeURIComponent(title) + '.pdf';
      res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
      res.setHeader('Content-type', 'application/pdf');
      /*doc.image(img_url, {
          fit: [400, 300],
          align: 'center',
          valign: 'center'
        });*/
      //doc.image('images/cat1.jpeg', 400 );
      doc.font('Times-Roman', 18)
        .fontSize(25)
        .text(title, 100, 50);

      doc.fontSize(15)
         .fillColor('blue')
         .text('Read Full Article', 100, 100)
         .link(100, 100, 160, 27, link);
      doc.moveDown()
         .fillColor('red')
         .text("Author: "+author_name);
      doc
         .moveDown()
         .fillColor('black')
         .fontSize(15)
         .text(content, {
           align: 'justify',
           indent: 30,
           height: 300,
           ellipsis: true
         });
      doc.pipe(res);
      doc.end();
});
});

module.exports = router;
