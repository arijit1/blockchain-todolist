module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", //HTTP://127.0.0.1:7545
      port: 7545,
      network_id: "*" // Match any network id
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}