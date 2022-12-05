export default class Webclient{

  private fetchOptions;
  protected errorMessage = 'Welp. That web call did not work. Going want to check console for more info.';
  protected baseUrl = import.meta.env.VITE_BASE_NODE_URL ?? '';
  constructor(dbUrl: string) {
    this.fetchOptions = {
      headers: new Headers({
        'db_url': dbUrl,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
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

  public async setValue(key:string, value:unknown): Promise<void>{
    try {
      const body = {
        updatedValue: value
      };
      const postOptions = {headers: this.fetchOptions.headers, method: 'POST', body: JSON.stringify(body)};
      await fetch(this.baseUrl + `/key?name=${key}` , postOptions);
    }catch (error: unknown){
      alert(this.errorMessage);
      console.log('There was an error setting the value of the key: ' + key);
      console.log(value);
      console.log(error);
      throw error;
    }
  }

  public async deleteKey(key:string): Promise<void>{
    try {
      await fetch(this.baseUrl + `/delete/key?name=${key}` , this.fetchOptions);
    }catch (error: unknown){
      alert(this.errorMessage);
      console.log('There was an error deleting the value of the key: ' + key);
      console.log(error);
      throw error;
    }
  }

  public async getAll(): Promise<Promise<object> | Promise<Array<unknown>> | Promise<string>>{
    try {
      const result = await fetch(this.baseUrl + '/keys/all' , this.fetchOptions);
      return await result.json();
    }catch (error: unknown){
      alert(this.errorMessage);
      console.log('There was an error getting all the values.');
      console.log(error);
      throw error;
    }
  }
  public async addDatabase(dbUrl:string): Promise<void>{
    try {
      const body = {
        dbUrl: dbUrl
      };
      const postOptions = {headers: this.fetchOptions.headers, method: 'POST', body: JSON.stringify(body)};
      await fetch(this.baseUrl + '/api/database/add' , postOptions);
    }catch (error: unknown){
      alert(this.errorMessage);
      console.log(error);
      throw error;
    }
  }

  public async listDatabases(): Promise<Array<{ [key:string] : any }>>{
    try {
      const result = await fetch(this.baseUrl + '/api/database/list' , this.fetchOptions);
      try {
        return await  result.json();
      }catch (e) {
        console.log(result.body);
        throw new Error();
      }

    }catch (error: unknown){
      console.log(error);

      alert(this.errorMessage);
      console.log('There was an error getting the databases from supabase. Guess you can call this a supa-problem');
      console.log(error);
      throw error;
    }
  }

  public async createABackup(dbId: string): Promise<void>{
    try {
      const result = await fetch(this.baseUrl + `/api/database/backup/add?id=${dbId}` , this.fetchOptions);
      const resultJson = await result.json();
      if(result.status !== 200){
        throw new Error(resultJson);
      }
      return  resultJson;
    }catch (error: unknown){
      alert(this.errorMessage);
      console.log('There was an error creating a back up of the databases.');
      console.log(error);
      throw error;
    }
  }
  
  public async deleteDatabase(dbId: string): Promise<void>{
    try {
      const result = await fetch(this.baseUrl + `/api/database/delete?id=${dbId}` , this.fetchOptions);
      const resultJson = await result.json();
      if(result.status !== 200){
        throw new Error(resultJson);
      }
      return  resultJson;
    }catch (error: unknown){
      alert(this.errorMessage);
      console.log('There was an error creating a back up of the databases.');
      console.log(error);
      throw error;
    }
  }
}







