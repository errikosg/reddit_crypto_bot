## Reddit crypto bot

#### Summary (v. 1.0.1)
A simple server that explores the "Daily Discussions" post of the subreddit "CryptoCurrency" and find word frequency of the cryptocurrencies that are mentioned by redditors, in order for trends to be found.

#### ## Installing prerequisites
- Install nodejs, npm
- Clone the project
- Run `cd backend; npm install` to install dependencies
- Run `npm run dev` to run development mode

#### Client requirements (v.1.0.0)
Any client can currently access this server only through the: **/reddit-crypto-bot/frequencies** endpoint. The custom header *custom-cache-data* (0 for no cache, 1 for cache, default is 0) is used for caching the CMC (CoinMarketCap) coin list.
