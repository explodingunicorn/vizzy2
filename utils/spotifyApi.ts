import SpotifyWebApi from "spotify-web-api-node";
import SpotifyWebApiServer from "spotify-web-api-node/src/server-methods";

SpotifyWebApi._addMethods(SpotifyWebApiServer);

export { SpotifyWebApi };
