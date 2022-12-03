import { reactive} from 'vue';

export default reactive({
  dbUrl: '',
  token: {
    iat: 0,
    exp:0,
    user: '',
    slug: ''
  },
  setDbUrl(url: string, tokenObject: object){
    localStorage.setItem('dbUrl', url);
    localStorage.setItem('token', JSON.stringify(tokenObject));
    this.dbUrl = url;
  },
  getDbUrl(){
    if(this.dbUrl === ''){
      const dbUrlFromLS = localStorage.getItem('dbUrl');
      const tokenObjectFromLS = localStorage.getItem('token');
      if(dbUrlFromLS && tokenObjectFromLS){
        this.token = JSON.parse(tokenObjectFromLS);
        this.dbUrl = dbUrlFromLS;
        return this.dbUrl;
      }
    }
    return this.dbUrl;
  }
});
