const mssql=require("mssql");
const sqlconfig=require("../config/config");

class Connection {
  constructor() {
    this.pool = this.getConnection()
    .then((pool)=>{
        console.log("DB connection successful")
        return pool;
    })
    .catch((error)=>{
        console.log("error connecting to DB:")
        throw error;
    })
  }
  async getConnection(){
    const pool = mssql.connect(sqlconfig)
    return pool;
  }
  
  createRequest(request, data) {
    const keys = Object.keys(data);
    keys.map((keyName) => {
      const keyValue = data[keyName];

      request.input(keyName, keyValue);
    });

    return request;
  }

  async exec(procedureName, data= {}) {
    let pool = await this.pool;
    let request = await pool.request();

    request = this.createRequest(request, data);

    const result = await request.execute(procedureName);
    return result;
  }

  async query(query) {
    const results = await (await this.pool).request().query(query);
    return results;
  }
}

module.exports=Connection