const net = require('net');

const server = net.createServer();
const PORT = process.env.PORT || 3000;
server.on('connection', (client) => {
  client.once('data', (data) => {
    // need first packet so we will use once instead of on

    let dataChange = data
      .toString()
      .replace(
        'Host: proxy-server-weather.herokuapp.com',
        'Host: sid22071-weather-app.herokuapp.com'
      );
    let host = 'sid22071-weather-app.herokuapp.com';
    let port = 80;
    console.log(client.address());
    console.log('local address' + client.localAddress);
    console.log('remote address' + client.remoteAddress);
    if (
      client.remoteAddress === '::1' ||
      client.remoteAddress === '::ffff:10.1.52.4'
    ) {
      client.write('blocked');
    } else {
      const proxyServerToRemote = net.createConnection({ host, port }, () => {
        proxyServerToRemote.write(dataChange);

        client.pipe(proxyServerToRemote);
        proxyServerToRemote.pipe(client);
      });
      proxyServerToRemote.on('error', (error) => {
        console.log(error);
      });
    }
  });
  server.on('error', () => {
    console.log(error);
  });
});

server.setMaxListeners(0);
server.listen(PORT, () => {
  console.log('Proxy server is running on 3000');
});
