import SpotifyWebApi from "spotify-web-api-node";
import SpotifyWebApiServer from "spotify-web-api-node/src/server-methods";

type ModifiedSpotifyWebApiClass = {
  _addMethods: (any) => void;
} & typeof SpotifyWebApi;
(SpotifyWebApi as ModifiedSpotifyWebApiClass)._addMethods(SpotifyWebApiServer);
type ModifiedSpotifyWebApi = SpotifyWebApi & {
  createAuthorizeURL: (
    scopes: string[],
    state: string,
    showDialog: boolean,
    responseType: string
  ) => string;
};

export { SpotifyWebApi };

export type Segment = {
  confidence: number;
  duration: number;
  loudness_end: number;
  loudness_max: number;
  loudness_max_time: number;
  loudness_start: number;
  pitches: number[];
  start: number;
  timbre: number[];
};

export interface AudioAnalysisData {
  segments: Segment[];
  [key: string]: any;
}

export const CLIENT_ID = "c476f085f3ce45ffaa1930335706312e";

export const createSpotifyAuthUrl = (url: string = "http://localhost:3000") => {
  const redirectUrl =
    url.startsWith("https://") || url.startsWith("http://")
      ? url
      : `https://${url}`;
  const scopes = ["streaming", "user-read-private", "user-read-email"];
  const redirect = `${redirectUrl}/app`;
  const showDialog = true;
  const responseType = "token";

  const spotifyApi = new SpotifyWebApi({
    redirectUri: redirect,
    clientId: CLIENT_ID,
  }) as ModifiedSpotifyWebApi;

  return spotifyApi.createAuthorizeURL(scopes, "", showDialog, responseType);
};

export const createSpotifyApi = (token: string) => {
  return new SpotifyWebApi({
    clientId: CLIENT_ID,
    accessToken: token,
  });
};
