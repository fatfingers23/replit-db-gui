import store from '@/store';


export default class Webclient{

  protected fetchOptions;
  protected errorMessage = 'Welp. That web call did not work. Going want to check console for more info.';
  protected baseUrl = import.meta.env.VITE_BASE_NODE_URL ?? import.meta.env.BASE_URL;
  constructor(dbUrl: string) {
    this.fetchOptions = {
      headers: new Headers({'db_url': dbUrl})
    };
  }

  public async getKeys(prefix = ''): Promise<Array<string>>{
    try {
      const result = await fetch(this.baseUrl + `/keys?prefix=${prefix}` , this.fetchOptions);
      return await result.json() as Array<string>;
    }catch (error: unknown){
      alert(this.errorMessage);
      console.log('There was an error getting the keys for the prefix: ' + prefix);
      console.log(error);
      throw error;
    }
  }

  public async getValue(key:string): Promise<Promise<object> | Promise<Array<unknown>> | Promise<string>>{
    try {
      const result = await fetch(this.baseUrl + `/key?name=${key}` , this.fetchOptions);
      return await result.json();
    }catch (error: unknown){
      alert(this.errorMessage);
      console.log('There was an error getting the value of the key: ' + key);
      console.log(error);
      throw error;
    }
  }

}







