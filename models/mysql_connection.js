const mysql=require('mysql')

const host="localhost";
const user="root";
const password="";
const database="knowyourmess";


module.exports.query=(query,callback)=>{
    var connection=mysql.createConnection({
        host,
        user,
        password,
        database
    });
    connection.connect((error)=>
    {
        if(error)
            callback(error);
            connection.query(query,(err,results)=>
            {
                if(err)
                callback(err);
                connection.end((err)=>
                {
                    callback(err,results);            
                });
            });
    });
};