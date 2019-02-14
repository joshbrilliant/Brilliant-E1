var http = require('http');
var server = http.createServer(requestHandler); 
server.listen(process.env.PORT, process.env.IP, startHandler);

function startHandler()
{
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
}

function requestHandler(req, res) 
{
  try
  {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    if (query['cmd'] == undefined)
      throw Error("A command must be specified");
      
    var result = {};
    if (query['cmd'] == 'calcDistance')
    {
      result = calcDistance(query);
    }
    else if (query['cmd'] == 'calcCost')
    {
      result = calcCost(query);
    }   
    else
    {
      throw Error("Invalid command: " + query['cmd']);
    }
 
    res.write(JSON.stringify(result));
    res.end('');
  }
  catch (e)
  {
    var error = {'error' : e.message};
    res.write(JSON.stringify(error));
    res.end('');
  }
}

function calcDistance(query)
{
  if (query['budget'] == undefined || isNaN(query['budget']) || query['budget'] <= 0) 
    throw Error("Invalid value for budget");
    
  if (query['mpg'] == undefined || isNaN(query['mpg']) || query['mpg'] <= 0) 
    throw Error("Invalid value for mpg");
    
  if (query['fuelCost'] == undefined || isNaN(query['fuelCost']) || query['fuelCost'] <= 0) 
    throw Error("Invalid value for fuelCost");
    
  var distance = 0;
  var fuel = 0;
  
  fuel = (query['budget']) / (query['fuelCost']);
  
  distance = (query['mpg'] * fuel);

  var result = {'distance' : distance}; 
  return result;
}

function calcCost(query)
{
  if (query['distance'] == undefined || isNaN(query['distance']) || query['distance'] <= 0) 
    throw Error("Invalid value for budget");
    
  if (query['mpg'] == undefined || isNaN(query['mpg']) || query['mpg'] <= 0) 
    throw Error("Invalid value for mpg");
    
  if (query['fuelCost'] == undefined || isNaN(query['fuelCost']) || query['fuelCost'] <= 0) 
    throw Error("Invalid value for fuelCost");
    
  var cost = 0;
  var gals = 0;
  
  gals = (query['mpg']) / (query['distance']);
  
  cost = (query['fuelCost'] / gals);

  var result = {'cost' : cost}; 
  return result;
}