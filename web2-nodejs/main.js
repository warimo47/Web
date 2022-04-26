var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response)
{
  // console.log(`request : ${request}`);
  var _url = request.url;
  // console.log(`_url : ${_url}`);
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  var title = path.parse(queryData.id).base;

  // console.log(`url.parse(_url, true) : ${url.parse(_url, true)}`);
  // console.log(`queryData : ${queryData}`);
  // console.log(`title : ${title}`);

  var filelist = fs.readdirSync('data');
  var list = template.list(filelist);
  // console.log(filelist);

  // console.log(`pathname : ${pathname}`);

  if (pathname === '/')
  {
    fs.readFile(`data/${title}`, 'utf8', function(error, description)
    {
      var create_update = `<a href="/create">create</a>
      <a href="/update?id=${title}">update</a>
      <form action="delete_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <input type="submit" value="delete">
      </form>`;
      if (title === undefined)
      {
        title = 'Welcome';
        description = 'The World Wide Web (abbreviated WWW or the Web) is an information space where documents and other web resources are identified by Uniform Resource Locators (URLs), interlinked by hypertext links, and can be accessed via the Internet.[1] English scientist Tim Berners-Lee invented the World Wide Web in 1989. He wrote the first web browser computer program in 1990 while employed at CERN in Switzerland.[2][3] The Web browser was released outside of CERN in 1991, first to other research institutions starting in January 1991 and to the general public on the Internet in August 1991.';
        create_update =  `<a href="/create">create</a>`;
      }
      var template1 = template.html(title, list,
        `<h2>${title}</h2><p>${description}</p>`,
        create_update);
      response.writeHead(200);
      // response.end(fs.readFileSync(__dirname + _url));
      response.end(template1);
    });
  }
  else if (pathname === '/create')
  {
    var template1 = template.html('Create', list, `<h2>Create</h2>
    <form action="create_process" method="post">
      <p>
        <input type="text" name="title" placeholder="title">
      </p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit">
      </p>
    </form>`, '');
    response.writeHead(200);
    // response.end(fs.readFileSync(__dirname + _url));
    response.end(template1);
  }
  else if (pathname === '/create_process')
  {
    var body = '';
    request.on('data', function(data)
    {
      body = body + data;
    });
    request.on('end', function()
    {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function(error)
      {
        response.writeHead(302, {location: `/?id=${title}`});
        response.end();
      });
    });
  }
  else if (pathname === '/update')
  {
    fs.readdir('data', function(error, filelist)
    {
      fs.readFile(`data/${title}`, 'utf8', function(error, description)
      {
        var template1 = template.html('Update', list, `<h2>Update</h2>
        <form action="http://localhost/update_process" method="post">
          <p>
            <input type="hidden" name="id" placeholder="title" value="${title}">
          </p>
          <p>
            <input type="text" name="title" placeholder="title" value="${title}">
          </p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>`, '');
        response.writeHead(200);
        response.end(template1);
      });
    });
  }
  else if (pathname === '/update_process')
  {
    var body = '';
    request.on('data', function(data)
    {
      body = body + data;
    });
    request.on('end', function()
    {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function(error)
      {
        fs.writeFile(`data/${title}`, description, 'utf8', function(error)
        {
          response.writeHead(302, {location: `/?id=${title}`});
          response.end();
        });
      });
    });
  }
  else if (pathname === '/delete_process')
  {
    var body = '';
    request.on('data', function(data)
    {
      body = body + data;
    });
    request.on('end', function()
    {
      var post = qs.parse(body);
      var id = path.parse(post.id).base;
      var title = post.title;
      fs.unlink(`data/${id}`, function(error)
      {
        response.writeHead(302, {location: '/'});
        response.end();
      });
    });
  }
  else
  {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(80);
