const connection=require('./mysql_connection.js');

const TableStructure=`
CREATE TABLE IF NOT EXISTS HOSTELS(
    hid int NOT NULL AUTO_INCREMENT,
    name char(100) NOT NULL,
    about TEXT,
    PRIMARY KEY(hid)
)
`;

const createHostel=(hostelDetails,callback)=>
{
    const createHostelQuery=`
        INSERT INTO HOSTELS(name) 
        VALUES(\"${hostelDetails}\");
    `;
    connection.query(createHostelQuery,callback);
};

const getHostelsList=(callback)=>
{
    const createHostelQuery=`
        SELECT hid,name FROM HOSTELS
    `;
    connection.query(createHostelQuery,(err,result)=>
    {
        console.log(result);
    });
};

module.exports={
    createHostel,
    getHostelsList
}