import {reactive} from 'vue';

console.log(import.meta.env.VITE_LOCAL_ONLY === undefined);
const setGetFriendlyDate = (timestamp: number): string => {
  const date = new Date(0);
  date.setSeconds(timestamp);
  return date.toLocaleString();
};

const baseUrl = import.meta.env.VITE_BASE_NODE_URL ?? '';

export default reactive({
  dbUrl: '',
  token: {
    iat: 0,
    exp:0,
    user: '',
    slug: '',
  },
  viewExpireDate: '',
  viewIssuedDate: '',
  expiredToken: false,
  setDbUrl(url: string, tokenObject: object){
    localStorage.setItem('dbUrl', url);
    localStorage.setItem('token', JSON.stringify(tokenObject));
    //HACK this is def a hack and should type token then map it that way
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.token = tokenObject;
    this.viewExpireDate = setGetFriendlyDate(this.token.exp);
    this.viewIssuedDate = setGetFriendlyDate(this.token.iat);
    this.expiredToken = this.token.exp <  Math.floor(Date.now() / 1000);
    this.dbUrl = url;
  },
  getLocalDbUrl(){
    if(this.dbUrl === ''){
      const dbUrlFromLS = localStorage.getItem('dbUrl');
      const tokenObjectFromLS = localStorage.getItem('token');
      if(dbUrlFromLS && tokenObjectFromLS){
        this.token = JSON.parse(tokenObjectFromLS);
        this.dbUrl = dbUrlFromLS;
        this.viewExpireDate = setGetFriendlyDate(this.token.exp);
        this.viewIssuedDate = setGetFriendlyDate(this.token.iat);
        this.expiredToken = this.token.exp <  Math.floor(Date.now() / 1000);
        return this.dbUrl;
      }
    }
    return this.dbUrl;
  },
  alert: false,
  async checkLogin() {
     const result = await fetch(`${baseUrl}/api/repl_auth`);
     const resultData = await result.json();
     if(resultData != null && result.status === 200){
       this.userInfo.id = resultData.id;
       this.userInfo.username = resultData.name;
       this.userInfo.profileImage = resultData.profileImage;
       this.loggedIn = true;
     }
  },
  loggedIn: false,
  userInfo: {
    username: '',
    id: '',
    profileImage: ''
  },
  localOnly: import.meta.env.VITE_LOCAL_ONLY === 'true' || import.meta.env.VITE_LOCAL_ONLY === undefined,
  userDatabases:[{}]
});
