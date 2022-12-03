import {reactive, ref} from 'vue';

const setGetFriendlyDate = (timestamp: number): string => {
  const date = new Date(0);
  date.setSeconds(timestamp);
  return date.toLocaleString();
};


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
  setDbUrl(url: string, tokenObject: object){
    localStorage.setItem('dbUrl', url);
    localStorage.setItem('token', JSON.stringify(tokenObject));
    //HACK this is def a hack and should type token then map it that way
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.token = tokenObject;
    this.viewExpireDate = setGetFriendlyDate(this.token.exp);
    this.viewIssuedDate = setGetFriendlyDate(this.token.iat);
    this.dbUrl = url;
  },
  getDbUrl(){
    if(this.dbUrl === ''){
      const dbUrlFromLS = localStorage.getItem('dbUrl');
      const tokenObjectFromLS = localStorage.getItem('token');
      if(dbUrlFromLS && tokenObjectFromLS){
        this.token = JSON.parse(tokenObjectFromLS);
        this.dbUrl = dbUrlFromLS;
        this.viewExpireDate = setGetFriendlyDate(this.token.exp);
        this.viewIssuedDate = setGetFriendlyDate(this.token.iat);
        return this.dbUrl;
      }
    }
    return this.dbUrl;
  }
});
