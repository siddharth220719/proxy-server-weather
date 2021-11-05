const net = require('net');

const server = net.createServer();
const PORT = process.env.PORT || 3000;
server.on('connection', (client) => {
  client.once('data', (data) => {
    // need first packet so we will use once instead of on

    let host = 'sid22071-weather-app.herokuapp.com';
    let port = 80;

    const proxyServerToRemote = net.createConnection({ host, port }, () => {
      console.log(`Proxy server has established connection with ${host}`);

      proxyServerToRemote.write(data);

      client.pipe(proxyServerToRemote);
      proxyServerToRemote.pipe(client);
    });
    proxyServerToRemote.on('error', (error) => {
      console.log(error);
    });
  });
  server.on('error', () => {
    console.log(error);
  });
});

server.setMaxListeners(0);
server.listen(PORT, () => {
  console.log('Proxy server is running on 3000');
});
